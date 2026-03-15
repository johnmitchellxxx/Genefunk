import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import type { DieType, DieConfig } from '../types';
import { getDieGeometry, getFaceUp, INTERIOR_OBJECT_EMOJI } from '../utils/diceGeometry';

interface DieProps {
  dieType: DieType;
  config: DieConfig;
  id: string;
  spawnSide: 'left' | 'right' | 'top' | 'bottom';
  arenaX: number;
  arenaZ: number;
  onSettle?: (id: string, result: number) => void;
  rolling: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function makeNumberTexture(
  value: number,
  fontFamily: string,
  fontColor: string,
  fontSize: number,
  bold: boolean,
  italic: boolean,
  dieColor: string,
  /** Body opacity 0–1.  Background pixels use this alpha; number pixels are always alpha=1
   *  so the numeral is never washed out regardless of die transparency. */
  bodyOpacity: number,
): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx2d = canvas.getContext('2d')!;

  // Clear to fully transparent first so we start with a known alpha channel
  ctx2d.clearRect(0, 0, size, size);

  // Background: tinted-dark die color, alpha = bodyOpacity.
  // At opacity=1 this looks like before; at opacity=0.3 the face is glassy but
  // still tinted, and surface lighting (roughness/reflections) remains sharp.
  const [r, g, b] = hexToRgb(dieColor.startsWith('#') ? dieColor : '#8b5cf6');
  const darkBg = `rgb(${Math.round(r * 0.15)}, ${Math.round(g * 0.12)}, ${Math.round(b * 0.18)})`;
  ctx2d.globalAlpha = bodyOpacity;
  ctx2d.fillStyle = darkBg;
  ctx2d.fillRect(0, 0, size, size);

  // Number is always fully opaque so it reads clearly on any body opacity
  ctx2d.globalAlpha = 1.0;
  const weight = bold ? 'bold' : 'normal';
  const style = italic ? 'italic' : 'normal';
  const numStr = String(value);
  const sizeScale = numStr.length >= 3 ? 0.55 : numStr.length === 2 ? 0.70 : 1.0;
  const px = Math.round(90 * fontSize * sizeScale);
  ctx2d.font = `${style} ${weight} ${px}px ${fontFamily}`;
  ctx2d.textAlign = 'center';
  ctx2d.textBaseline = 'middle';
  ctx2d.shadowBlur = 0;
  ctx2d.fillStyle = fontColor;
  ctx2d.fillText(String(value), size / 2, size / 2);

  if (value === 6 || value === 9) {
    const metrics = ctx2d.measureText(String(value));
    const w = metrics.width;
    ctx2d.strokeStyle = fontColor;
    ctx2d.lineWidth = Math.max(3, px / 16);
    ctx2d.beginPath();
    ctx2d.moveTo(size / 2 - w / 2, size / 2 + px * 0.62);
    ctx2d.lineTo(size / 2 + w / 2, size / 2 + px * 0.62);
    ctx2d.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  // Premultiplied alpha ensures correct blending when texture alpha < 1
  tex.premultiplyAlpha = true;
  return tex;
}

function makeEmojiTexture(emoji: string): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx2d = canvas.getContext('2d')!;
  ctx2d.font = `${size * 0.7}px serif`;
  ctx2d.textAlign = 'center';
  ctx2d.textBaseline = 'middle';
  ctx2d.fillText(emoji, size / 2, size / 2);
  return new THREE.CanvasTexture(canvas);
}

const SETTLE_FRAMES = 45;
const SETTLE_SPEED_THRESHOLD = 0.08;
const SNAP_DURATION = 0.45;

export function Die({ dieType, config, id, spawnSide, arenaX, arenaZ, onSettle, rolling }: DieProps) {
  const { rapier } = useRapier();
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const settleCountRef = useRef(0);
  const hasSettledRef = useRef(false);

  // Snap-to-flat animation state
  const isSnappingRef = useRef(false);
  const snapProgressRef = useRef(0);
  const snapStartQuatRef = useRef<THREE.Quaternion | null>(null);
  const snapTargetQuatRef = useRef<THREE.Quaternion | null>(null);

  const { geometry, faceCount, faceNormals } = useMemo(() => getDieGeometry(dieType), [dieType]);

  const numberTextures = useMemo(() => {
    return Array.from({ length: faceCount }, (_, i) =>
      makeNumberTexture(i + 1, config.fontFamily, config.fontColor, config.fontSize, config.bold, config.italic, config.color, config.opacity)
    );
  }, [faceCount, config.fontFamily, config.fontColor, config.fontSize, config.bold, config.italic, config.color, config.opacity]);

  const interiorTexture = useMemo(() => {
    if (!config.interiorObject) return null;
    const emoji = INTERIOR_OBJECT_EMOJI[config.interiorObject];
    return emoji ? makeEmojiTexture(emoji) : null;
  }, [config.interiorObject]);

  const dieScale = config.scale ?? 1;

  const spawnPos = useMemo((): [number, number, number] => {
    // Clamp random offsets to inner 60% of each axis so spawn is always on-screen
    const rz = (Math.random() - 0.5) * arenaZ * 0.6;
    const rx = (Math.random() - 0.5) * arenaX * 0.6;
    const y = 3 + Math.random() * 2;
    switch (spawnSide) {
      case 'left':   return [-arenaX * 0.7, y, rz];
      case 'right':  return [arenaX * 0.7, y, rz];
      case 'top':    return [rx, y, -arenaZ * 0.7];
      case 'bottom': return [rx, y, arenaZ * 0.7];
    }
  }, [spawnSide, arenaX, arenaZ]);

  // Pre-compute launch vectors once per mount so they stay stable across frames
  const launchRef = useRef<{
    vx: number; vy: number; vz: number;
    ax: number; ay: number; az: number;
    applied: boolean;
  } | null>(null);
  if (launchRef.current === null) {
    // Lateral velocity scaled to arena size so dice traverse ~70% of arena
    const vx = spawnSide === 'left'   ?  3 + Math.random() * 3
              : spawnSide === 'right'  ? -(3 + Math.random() * 3)
              : (Math.random() - 0.5) * 4;
    const vz = spawnSide === 'top'    ?  4 + Math.random() * 3
              : spawnSide === 'bottom' ? -(4 + Math.random() * 3)
              : (Math.random() - 0.5) * 5;
    launchRef.current = {
      vx, vy: 2 + Math.random() * 3, vz,
      ax: (Math.random() - 0.5) * 50,
      ay: (Math.random() - 0.5) * 50,
      az: (Math.random() - 0.5) * 50,
      applied: false,
    };
  }

  // Reset launch + snap state when a new roll starts
  useEffect(() => {
    if (rolling && launchRef.current) {
      launchRef.current.applied = false;
      hasSettledRef.current = false;
      settleCountRef.current = 0;
      isSnappingRef.current = false;
      snapProgressRef.current = 0;
      snapStartQuatRef.current = null;
      snapTargetQuatRef.current = null;
    }
  }, [rolling]);

  useFrame((_, delta) => {
    // --- Snap-to-flat animation (runs after physics settles) ---
    if (isSnappingRef.current && rigidBodyRef.current && snapStartQuatRef.current && snapTargetQuatRef.current) {
      snapProgressRef.current = Math.min(snapProgressRef.current + delta / SNAP_DURATION, 1);
      const t = snapProgressRef.current;
      // easeOutCubic: fast start, soft landing
      const ease = 1 - Math.pow(1 - t, 3);
      const q = snapStartQuatRef.current.clone().slerp(snapTargetQuatRef.current, ease);
      // false = don't wake body; keep it sleeping while we rotate it visually
      rigidBodyRef.current.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w }, false);
      if (t >= 1) {
        isSnappingRef.current = false;
        // Hard-stop: zero velocities and re-sleep so physics never twitches it again.
        // Guard with try/catch — Rapier may throw if the world is mid-teardown.
        try {
          const rb = rigidBodyRef.current;
          if (rb) {
            rb.setLinvel({ x: 0, y: 0, z: 0 }, false);
            rb.setAngvel({ x: 0, y: 0, z: 0 }, false);
            rb.sleep();
          }
        } catch {
          // Body already removed from world; safe to ignore.
        }
      }
      return;
    }

    if (!rigidBodyRef.current || !rolling || !launchRef.current) return;

    // Apply launch impulse on the first frame Rapier body is ready
    if (!launchRef.current.applied && !hasSettledRef.current) {
      launchRef.current.applied = true;
      const rb = rigidBodyRef.current;
      const { vx, vy, vz, ax, ay, az } = launchRef.current;
      rb.wakeUp();
      rb.setLinvel({ x: vx, y: vy, z: vz }, true);
      rb.setAngvel({ x: ax, y: ay, z: az }, true);
      return;
    }

    if (hasSettledRef.current) return;

    const rb = rigidBodyRef.current;
    const linvel = rb.linvel();
    const angvel = rb.angvel();
    const speed = Math.sqrt(linvel.x ** 2 + linvel.y ** 2 + linvel.z ** 2);
    const spin = Math.sqrt(angvel.x ** 2 + angvel.y ** 2 + angvel.z ** 2);

    if (speed < SETTLE_SPEED_THRESHOLD && spin < SETTLE_SPEED_THRESHOLD) {
      settleCountRef.current += 1;
      if (settleCountRef.current >= SETTLE_FRAMES) {
        hasSettledRef.current = true;
        // Use wakeUp=false so zeroing velocities doesn't trigger a floor-collision response.
        rb.setLinvel({ x: 0, y: 0, z: 0 }, false);
        rb.setAngvel({ x: 0, y: 0, z: 0 }, false);
        // Freeze body so the snap rotation can't cause Rapier to detect
        // floor penetration and launch it skyward.
        rb.setBodyType(rapier.RigidBodyType.Fixed, false);
        rb.sleep();

        // Determine which face is up right now
        const rawQ = rb.rotation();
        const currentQuat = new THREE.Quaternion(rawQ.x, rawQ.y, rawQ.z, rawQ.w);
        const faceIndex = getFaceUp(currentQuat, { geometry, faceCount, faceNormals });
        const result = Math.max(1, Math.min(faceCount, faceIndex));

        // Compute the quaternion that puts the winning face perfectly flat (normal = world +Y)
        const faceNormalLocal = faceNormals[faceIndex - 1].clone();
        const worldFaceNormal = faceNormalLocal.applyQuaternion(currentQuat);
        const worldUp = new THREE.Vector3(0, 1, 0);
        const deltaQ = new THREE.Quaternion().setFromUnitVectors(worldFaceNormal, worldUp);
        // targetQuat = deltaQ applied in world space on top of currentQuat
        const targetQuat = deltaQ.clone().multiply(currentQuat);

        snapStartQuatRef.current = currentQuat.clone();
        snapTargetQuatRef.current = targetQuat;
        snapProgressRef.current = 0;
        isSnappingRef.current = true;

        onSettle?.(id, result);
      }
    } else {
      settleCountRef.current = 0;
    }
  });

  const faceMaterials = useMemo(() => {
    const translucent = config.opacity < 1;
    return numberTextures.map(tex => new THREE.MeshPhysicalMaterial({
      map: tex,
      // opacity is baked into the texture alpha channel (background=partial, number=1.0)
      // so we leave material opacity at 1 — surface shading (reflections, roughness)
      // then works independently from how see-through the body is.
      transparent: translucent,
      opacity: 1.0,
      alphaTest: 0,
      depthWrite: !translucent,
      roughness: translucent ? 0.08 : 0.35,   // glassy surface when translucent
      metalness: 0,
      // clearcoat gives the "lacquered resin" look real dice have
      clearcoat: translucent ? 0.8 : 0.2,
      clearcoatRoughness: 0.1,
      side: THREE.FrontSide,
    }));
  }, [numberTextures, config.opacity]);

  return (
    <RigidBody
      key={`rb-${dieScale}`}
      ref={rigidBodyRef}
      position={spawnPos}
      restitution={0.2}
      friction={0.8}
      linearDamping={0.6}
      angularDamping={0.5}
      colliders="hull"
      ccd={true}
    >
      <group scale={dieScale}>
        <mesh
          ref={meshRef}
          geometry={geometry}
          material={faceMaterials}
          castShadow
          receiveShadow
        />
        {interiorTexture && (
          <mesh scale={[0.35, 0.35, 0.35]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={interiorTexture}
              transparent
              opacity={0.9}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>
    </RigidBody>
  );
}

export type { DieProps };

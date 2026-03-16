import { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RigidBody, RapierRigidBody, useRapier } from '@react-three/rapier';
import * as THREE from 'three';
import type { DieType, DieConfig } from '../types';
import { getDieGeometry, getFaceUp, D4_OPPOSITE_VALUES, D4_FACE_VERTEX_VALUES } from '../utils/diceGeometry';

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
  /** When true (opaque die) the face background is drawn solid so the whole
   *  face is filled.  When false (translucent die) the background stays fully
   *  transparent — only the number pixels have any alpha — so the separate
   *  inner body mesh shows through where there's no numeral. */
  drawBackground: boolean,
): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx2d = canvas.getContext('2d')!;

  // Always start transparent
  ctx2d.clearRect(0, 0, size, size);

  if (drawBackground) {
    // Opaque die: fill with a dark tint of the die colour
    const [r, g, b] = hexToRgb(dieColor.startsWith('#') ? dieColor : '#8b5cf6');
    const darkBg = `rgb(${Math.round(r * 0.15)}, ${Math.round(g * 0.12)}, ${Math.round(b * 0.18)})`;
    ctx2d.globalAlpha = 1.0;
    ctx2d.fillStyle = darkBg;
    ctx2d.fillRect(0, 0, size, size);
  }
  // Translucent die: leave background at alpha=0; inner body mesh provides colour.

  // Number is ALWAYS drawn at full opacity — it is never blended or faded.
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

  return new THREE.CanvasTexture(canvas);
}

/**
 * D4 face texture — draws three numbers, one near each vertex corner.
 *
 * UV triangle vertex → canvas coordinate mapping (canvas y = (1 − UV_y) × 256):
 *   TRI_UV[0] (0.85, 0.80) → canvas (218,  51)  top-right  vertex A
 *   TRI_UV[1] (0.50, 0.12) → canvas (128, 225)  bottom-center vertex B
 *   TRI_UV[2] (0.15, 0.80) → canvas ( 38,  51)  top-left   vertex C
 * Centroid ≈ canvas (128, 109).
 *
 * Each number is placed 50 % of the way from the centroid toward its vertex
 * (pulled back from the tip for readability) and rotated so the TOP of the
 * digit points toward that vertex tip.
 *
 * Rotation formula: θ = atan2(dx, −dy) where (dx, dy) = vertex − centroid
 * in canvas space (y increases downward), yielding:
 *   vA: atan2(+90, +58) ≈ +57°   vB: atan2(0, −116) = 180°   vC: atan2(−90, +58) ≈ −57°
 */
function makeD4FaceTexture(
  topRightVal: number,
  bottomCenterVal: number,
  topLeftVal: number,
  fontFamily: string,
  fontColor: string,
  fontSize: number,
  bold: boolean,
  italic: boolean,
  dieColor: string,
  drawBackground: boolean,
): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx2d = canvas.getContext('2d')!;

  ctx2d.clearRect(0, 0, size, size);

  // UV triangle vertex positions in canvas space
  const vA: [number, number] = [218, 51];   // top-right  (TRI_UV[0])
  const vB: [number, number] = [128, 225];  // bottom-center (TRI_UV[1])
  const vC: [number, number] = [38,  51];   // top-left   (TRI_UV[2])
  const cx = (vA[0] + vB[0] + vC[0]) / 3;  // ≈ 128
  const cy = (vA[1] + vB[1] + vC[1]) / 3;  // ≈ 109

  // Background: fill only the triangular face area
  if (drawBackground) {
    const [r, g, b] = hexToRgb(dieColor.startsWith('#') ? dieColor : '#8b5cf6');
    const darkBg = `rgb(${Math.round(r * 0.15)}, ${Math.round(g * 0.12)}, ${Math.round(b * 0.18)})`;
    ctx2d.globalAlpha = 1.0;
    ctx2d.fillStyle = darkBg;
    ctx2d.beginPath();
    ctx2d.moveTo(vA[0], vA[1]);
    ctx2d.lineTo(vB[0], vB[1]);
    ctx2d.lineTo(vC[0], vC[1]);
    ctx2d.closePath();
    ctx2d.fill();
  }

  ctx2d.globalAlpha = 1.0;
  const weight = bold ? 'bold' : 'normal';
  const style = italic ? 'italic' : 'normal';
  // Larger font — D4 numbers must be readable from a top-down camera
  const px = Math.round(60 * fontSize);
  ctx2d.textAlign = 'center';
  ctx2d.textBaseline = 'middle';

  // For each vertex, compute the rotation angle so the digit's TOP points
  // toward the vertex tip.  In canvas space (y-down):
  //   text "up" after ctx.rotate(θ) = (sin θ, −cos θ)
  //   we want this = normalize(vertex − centroid)
  //   → θ = atan2(dx, −dy)   where (dx, dy) = vertex − centroid
  const angleFor = (v: [number, number]) =>
    Math.atan2(v[0] - cx, -(v[1] - cy));

  // Numbers are placed 50 % from centroid toward vertex — close enough to the
  // tip to look "at the corner" but far enough to avoid clipping.
  const FRAC = 0.50;
  const entries: [number, number, number, number][] = [
    [topRightVal,     cx + FRAC * (vA[0] - cx), cy + FRAC * (vA[1] - cy), angleFor(vA)],
    [bottomCenterVal, cx + FRAC * (vB[0] - cx), cy + FRAC * (vB[1] - cy), angleFor(vB)],
    [topLeftVal,      cx + FRAC * (vC[0] - cx), cy + FRAC * (vC[1] - cy), angleFor(vC)],
  ];

  for (const [val, x, y, angle] of entries) {
    ctx2d.save();
    ctx2d.translate(x, y);
    ctx2d.rotate(angle);
    ctx2d.font = `${style} ${weight} ${px}px ${fontFamily}`;
    // Thick outline for contrast against the die face colour
    ctx2d.lineWidth = Math.max(5, px / 8);
    ctx2d.lineJoin = 'round';
    ctx2d.strokeStyle = drawBackground
      ? `rgba(0,0,0,0.90)`
      : `rgba(0,0,0,0.70)`;
    ctx2d.strokeText(String(val), 0, 0);
    ctx2d.fillStyle = fontColor;
    ctx2d.fillText(String(val), 0, 0);
    ctx2d.restore();
  }

  return new THREE.CanvasTexture(canvas);
}

/** 3-D figurine imprisoned inside the die.
 *  Uses unlit MeshBasicMaterial so it is always 100 % opaque regardless of
 *  the die body's transparency — you only see it when the die is clear. */
function InteriorFigurine({ type }: { type: string }) {
  const mat = (color: string) => <meshBasicMaterial color={color} />;
  switch (type) {
    case 'skull':
      return (
        <group>
          <mesh><sphereGeometry args={[0.18, 8, 8]} />{mat('#f5f0dc')}</mesh>
          <mesh position={[0, -0.14, 0.04]}><sphereGeometry args={[0.1, 6, 6]} />{mat('#f5f0dc')}</mesh>
          <mesh position={[0.06, -0.08, 0.16]}><sphereGeometry args={[0.04, 5, 5]} />{mat('#1a1a1a')}</mesh>
          <mesh position={[-0.06, -0.08, 0.16]}><sphereGeometry args={[0.04, 5, 5]} />{mat('#1a1a1a')}</mesh>
        </group>
      );
    case 'unicorn':
      return (
        <group>
          <mesh><sphereGeometry args={[0.17, 8, 8]} />{mat('#ffffff')}</mesh>
          <mesh position={[0, 0.26, 0]}><coneGeometry args={[0.04, 0.22, 6]} />{mat('#e040fb')}</mesh>
        </group>
      );
    case 'star':
      return (
        <mesh rotation={[0, Math.PI / 8, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          {mat('#ffd700')}
        </mesh>
      );
    case 'gem':
      return (
        <mesh rotation={[0, 0.4, 0]}>
          <octahedronGeometry args={[0.21, 0]} />
          {mat('#00e5ff')}
        </mesh>
      );
    case 'flame':
      return (
        <group>
          <mesh rotation={[Math.PI, 0, 0]}><coneGeometry args={[0.1, 0.32, 8]} />{mat('#ff6400')}</mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.06, 0]}><coneGeometry args={[0.06, 0.2, 6]} />{mat('#ffea00')}</mesh>
        </group>
      );
    case 'dragon':
      return (
        <mesh rotation={[0.4, 0.5, 0.2]}>
          <icosahedronGeometry args={[0.18, 0]} />
          {mat('#00c853')}
        </mesh>
      );
    case 'moon':
      return (
        <group>
          <mesh><sphereGeometry args={[0.2, 8, 8]} />{mat('#c8c8ff')}</mesh>
          {/* crescent cutout: smaller dark sphere offset to carve the moon shape */}
          <mesh position={[0.12, 0.06, 0.1]}><sphereGeometry args={[0.15, 8, 8]} />{mat('#0d0d1a')}</mesh>
        </group>
      );
    case 'lightning':
      return (
        <group>
          <mesh rotation={[Math.PI, 0, 0.3]}><coneGeometry args={[0.08, 0.28, 4]} />{mat('#ffea00')}</mesh>
          <mesh position={[0.04, -0.14, 0]} rotation={[Math.PI, 0, -0.3]}><coneGeometry args={[0.06, 0.22, 4]} />{mat('#ffea00')}</mesh>
        </group>
      );
    case 'rose':
      return (
        <group>
          <mesh><sphereGeometry args={[0.16, 8, 8]} />{mat('#e91e63')}</mesh>
          <mesh position={[0, -0.2, 0]}><coneGeometry args={[0.05, 0.18, 6]} />{mat('#2e7d32')}</mesh>
        </group>
      );
    case 'eye':
      return (
        <group>
          <mesh><sphereGeometry args={[0.2, 8, 8]} />{mat('#e8f5e9')}</mesh>
          <mesh position={[0, 0, 0.17]}><sphereGeometry args={[0.1, 6, 6]} />{mat('#2e7d32')}</mesh>
          <mesh position={[0, 0, 0.23]}><sphereGeometry args={[0.06, 6, 6]} />{mat('#111111')}</mesh>
        </group>
      );
    default:
      return null;
  }
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
  // For D4: the result shown in the Html overlay once the die settles
  const [settledResult, setSettledResult] = useState<number | null>(null);

  // Snap-to-flat animation state
  const isSnappingRef = useRef(false);
  const snapProgressRef = useRef(0);
  const snapStartQuatRef = useRef<THREE.Quaternion | null>(null);
  const snapTargetQuatRef = useRef<THREE.Quaternion | null>(null);

  const { geometry, faceCount, faceNormals } = useMemo(() => getDieGeometry(dieType), [dieType]);

  const numberTextures = useMemo(() => {
    const drawBackground = config.opacity >= 1;
    if (dieType === 4) {
      // D4: each face shows 3 DIFFERENT numbers — one near each vertex corner.
      // The number near a vertex = the value of that vertex, not the face result.
      // This matches physical D4 dice: the result is read from whichever vertex
      // points up (all 3 side faces show the same number at that apex corner).
      return D4_FACE_VERTEX_VALUES.map(([topR, botC, topL]) =>
        makeD4FaceTexture(topR, botC, topL, config.fontFamily, config.fontColor, config.fontSize, config.bold, config.italic, config.color, drawBackground)
      );
    }
    return Array.from({ length: faceCount }, (_, i) =>
      makeNumberTexture(i + 1, config.fontFamily, config.fontColor, config.fontSize, config.bold, config.italic, config.color, drawBackground)
    );
  }, [dieType, faceCount, config.fontFamily, config.fontColor, config.fontSize, config.bold, config.italic, config.color, config.opacity]);


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
      setSettledResult(null);
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

        const rawQ = rb.rotation();
        const currentQuat = new THREE.Quaternion(rawQ.x, rawQ.y, rawQ.z, rawQ.w);

        let result: number;
        let targetQuat: THREE.Quaternion;

        if (dieType === 4) {
          // D4 rests on a face with a vertex pointing up.
          // Find the face whose normal is most downward — that is the floor face.
          const downDir = new THREE.Vector3(0, -1, 0);
          let bestDownDot = -Infinity, floorFaceIdx = 0;
          faceNormals.forEach((n, i) => {
            const dot = n.clone().applyQuaternion(currentQuat).dot(downDir);
            if (dot > bestDownDot) { bestDownDot = dot; floorFaceIdx = i; }
          });
          result = D4_OPPOSITE_VALUES[floorFaceIdx];

          // Snap: rotate so the floor face normal aligns exactly with world -Y,
          // which naturally puts the result vertex at the top (+Y).
          const floorNormalLocal = faceNormals[floorFaceIdx].clone();
          const worldFloorNormal = floorNormalLocal.applyQuaternion(currentQuat);
          const deltaQ = new THREE.Quaternion().setFromUnitVectors(worldFloorNormal, downDir);
          targetQuat = deltaQ.clone().multiply(currentQuat);
        } else {
          // All other dice: snap the most-upward face normal to world +Y.
          const faceIndex = getFaceUp(currentQuat, { geometry, faceCount, faceNormals });
          result = Math.max(1, Math.min(faceCount, faceIndex));

          const faceNormalLocal = faceNormals[faceIndex - 1].clone();
          const worldFaceNormal = faceNormalLocal.applyQuaternion(currentQuat);
          const worldUp = new THREE.Vector3(0, 1, 0);
          const deltaQ = new THREE.Quaternion().setFromUnitVectors(worldFaceNormal, worldUp);
          targetQuat = deltaQ.clone().multiply(currentQuat);
        }

        snapStartQuatRef.current = currentQuat.clone();
        snapTargetQuatRef.current = targetQuat;
        snapProgressRef.current = 0;
        isSnappingRef.current = true;

        onSettle?.(id, result);
        // D4 result overlay: reveal the number once we know what it is
        if (dieType === 4) setSettledResult(result);
      }
    } else {
      settleCountRef.current = 0;
    }
  });

  const faceMaterials = useMemo(() => {
    const translucent = config.opacity < 1;
    return numberTextures.map(tex => new THREE.MeshPhysicalMaterial({
      map: tex,
      // Alpha-cutout technique: pixels with alpha >= 0.5 render as fully solid
      // in the OPAQUE render pass (not the transparent/blend pass).  This means
      // number pixels (alpha=1) are 100 % solid — they can never be blended or
      // feathered by any transparency pipeline regardless of die opacity.
      // Background pixels (alpha=0 on translucent die, alpha=1 on opaque die)
      // are either kept (opaque) or discarded (translucent).
      alphaTest: 0.5,
      transparent: false,        // forces opaque render pass → no alpha blending
      opacity: 1.0,
      depthWrite: true,
      roughness: translucent ? 0.08 : 0.35,
      metalness: 0,
      clearcoat: translucent ? 0.5 : 0.2,
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
        {/* Inner body — only present for translucent dice.  Provides the coloured
            resin/glass fill that shows through the alpha-cutout face meshes where
            no number is drawn.  Uses the transparent render pass; face meshes
            (opaque pass, alphaTest) have already written depth for number pixels,
            so the body only shows through the transparent "holes". */}
        {config.opacity < 1 && (
          <mesh geometry={geometry}>
            <meshPhysicalMaterial
              color={config.color}
              transparent
              opacity={config.opacity}
              roughness={0.08}
              metalness={0}
              clearcoat={0.8}
              clearcoatRoughness={0.1}
              side={THREE.FrontSide}
              depthWrite={false}
              polygonOffset
              polygonOffsetFactor={2}
              polygonOffsetUnits={2}
            />
          </mesh>
        )}
        <mesh
          ref={meshRef}
          geometry={geometry}
          material={faceMaterials}
          castShadow
          receiveShadow
        />
        {config.interiorObject && (
          <InteriorFigurine type={config.interiorObject} />
        )}
        {/* D4 result overlay: one unambiguous number shown after the die settles.
            Physical D4 vertex-reading is confusing from a top-down camera because
            three 120°-rotated copies of the same digit look like different symbols.
            This Html badge bypasses the 3D texture entirely and shows the result
            in clear 2D screen space, anchored above the die's apex. */}
        {dieType === 4 && settledResult !== null && (
          <Html
            position={[0, 0, 0]}
            center
            style={{
              pointerEvents: 'none',
              userSelect: 'none',
              // Shift the badge UP in screen space (CSS Y decreases upward).
              // Using screen-space pixels here is intentional — the overhead camera
              // maps world-Y to depth (not screen-Y), so a world offset would just
              // cause parallax drift.  A CSS translateY pulls the badge cleanly
              // above the die apex regardless of where in the arena the die landed.
              transform: 'translateY(-90px)',
            }}
            zIndexRange={[100, 200]}
          >
            <div style={{
              background: 'rgba(0,0,0,0.85)',
              border: `2px solid ${config.fontColor}`,
              borderRadius: '50%',
              width: 42,
              height: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: config.fontFamily || 'serif',
              fontWeight: 'bold',
              fontSize: 24,
              color: config.fontColor || '#ffffff',
              lineHeight: 1,
              boxShadow: `0 0 10px ${config.fontColor}99`,
            }}>
              {settledResult}
            </div>
          </Html>
        )}
      </group>
    </RigidBody>
  );
}

export type { DieProps };

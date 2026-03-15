import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody } from '@react-three/rapier';
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

function makeNumberTexture(
  value: number,
  fontFamily: string,
  fontColor: string,
  fontSize: number,
  bold: boolean,
  italic: boolean,
  bgColor: string,
): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx2d = canvas.getContext('2d')!;
  ctx2d.fillStyle = bgColor;
  ctx2d.fillRect(0, 0, size, size);

  const weight = bold ? 'bold' : 'normal';
  const style = italic ? 'italic' : 'normal';
  const px = Math.round(90 * fontSize);
  ctx2d.font = `${style} ${weight} ${px}px ${fontFamily}`;
  ctx2d.fillStyle = fontColor;
  ctx2d.textAlign = 'center';
  ctx2d.textBaseline = 'middle';
  ctx2d.shadowColor = 'rgba(0,0,0,0.7)';
  ctx2d.shadowBlur = 8;
  ctx2d.fillText(String(value), size / 2, size / 2);

  if (value === 6 || value === 9) {
    const metrics = ctx2d.measureText(String(value));
    const w = metrics.width;
    ctx2d.shadowBlur = 0;
    ctx2d.strokeStyle = fontColor;
    ctx2d.lineWidth = Math.max(3, px / 16);
    ctx2d.beginPath();
    ctx2d.moveTo(size / 2 - w / 2, size / 2 + px * 0.62);
    ctx2d.lineTo(size / 2 + w / 2, size / 2 + px * 0.62);
    ctx2d.stroke();
  }

  return new THREE.CanvasTexture(canvas);
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

export function Die({ dieType, config, id, spawnSide, arenaX, arenaZ, onSettle, rolling }: DieProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const settleCountRef = useRef(0);
  const hasSettledRef = useRef(false);

  const { geometry, faceCount, faceNormals } = useMemo(() => getDieGeometry(dieType), [dieType]);

  const numberTextures = useMemo(() => {
    return Array.from({ length: faceCount }, (_, i) =>
      makeNumberTexture(i + 1, config.fontFamily, config.fontColor, config.fontSize, config.bold, config.italic, config.color)
    );
  }, [faceCount, config.fontFamily, config.fontColor, config.fontSize, config.bold, config.italic, config.color]);

  const interiorTexture = useMemo(() => {
    if (!config.interiorObject) return null;
    const emoji = INTERIOR_OBJECT_EMOJI[config.interiorObject];
    return emoji ? makeEmojiTexture(emoji) : null;
  }, [config.interiorObject]);

  const dieColor = useMemo(() => new THREE.Color(config.color), [config.color]);
  const dieScale = config.scale ?? 1;

  const spawnPos = useMemo((): [number, number, number] => {
    const rz = (Math.random() - 0.5) * arenaZ;
    const rx = (Math.random() - 0.5) * arenaX;
    const y = 5 + Math.random() * 2;
    switch (spawnSide) {
      case 'left':   return [-arenaX * 0.7, y, rz];
      case 'right':  return [arenaX * 0.7, y, rz];
      case 'top':    return [rx, y, -arenaZ * 0.7];
      case 'bottom': return [rx, y, arenaZ * 0.7];
    }
  }, [spawnSide, arenaX, arenaZ]);

  useEffect(() => {
    if (!rolling || !rigidBodyRef.current) return;
    hasSettledRef.current = false;
    settleCountRef.current = 0;

    const rb = rigidBodyRef.current;
    const vx = spawnSide === 'left' ? 3 + Math.random() * 4 : spawnSide === 'right' ? -(3 + Math.random() * 4) : (Math.random() - 0.5) * 5;
    const vz = spawnSide === 'top' ? 3 + Math.random() * 4 : spawnSide === 'bottom' ? -(3 + Math.random() * 4) : (Math.random() - 0.5) * 5;
    const vy = 2 + Math.random() * 2;

    rb.setLinvel({ x: vx, y: vy, z: vz }, true);
    rb.setAngvel({
      x: (Math.random() - 0.5) * 35,
      y: (Math.random() - 0.5) * 35,
      z: (Math.random() - 0.5) * 35,
    }, true);
  }, [rolling, spawnSide]);

  useFrame(() => {
    if (!rigidBodyRef.current || hasSettledRef.current || !rolling) return;

    const rb = rigidBodyRef.current;
    const linvel = rb.linvel();
    const angvel = rb.angvel();
    const speed = Math.sqrt(linvel.x ** 2 + linvel.y ** 2 + linvel.z ** 2);
    const spin = Math.sqrt(angvel.x ** 2 + angvel.y ** 2 + angvel.z ** 2);

    if (speed < SETTLE_SPEED_THRESHOLD && spin < SETTLE_SPEED_THRESHOLD) {
      settleCountRef.current += 1;
      if (settleCountRef.current >= SETTLE_FRAMES) {
        hasSettledRef.current = true;
        rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
        rb.sleep();
        const q = rb.rotation();
        const quaternion = new THREE.Quaternion(q.x, q.y, q.z, q.w);
        const faceIndex = getFaceUp(quaternion, { geometry, faceCount, faceNormals });
        const result = Math.max(1, Math.min(faceCount, faceIndex));
        onSettle?.(id, result);
      }
    } else {
      settleCountRef.current = 0;
    }
  });

  const faceMaterials = useMemo(() => {
    return numberTextures.map(tex => new THREE.MeshPhysicalMaterial({
      map: tex,
      color: dieColor,
      transparent: config.opacity < 1,
      opacity: config.opacity,
      roughness: 0.25,
      metalness: 0.4,
      envMapIntensity: 1.8,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      reflectivity: 0.8,
      side: THREE.DoubleSide,
    }));
  }, [numberTextures, dieColor, config.opacity]);

  return (
    <RigidBody
      key={`rb-${dieScale}`}
      ref={rigidBodyRef}
      position={spawnPos}
      restitution={0.45}
      friction={0.6}
      linearDamping={0.5}
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
        <pointLight color={dieColor} intensity={0.6} distance={1.5} decay={2} />
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

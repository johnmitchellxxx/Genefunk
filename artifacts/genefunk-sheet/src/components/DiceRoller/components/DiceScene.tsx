import { useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import type { DieType, DieConfig, RollResult } from '../types';
import { Die } from './Die';

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    const tiltAngle = (20 * Math.PI) / 180;
    const dist = 10;
    camera.position.set(0, dist * Math.cos(tiltAngle), dist * Math.sin(tiltAngle));
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

interface DiceSceneProps {
  pool: DieType[];
  config: DieConfig;
  rolling: boolean;
  settled: boolean;
  onAllSettled: (results: RollResult[]) => void;
  onCanvasClick?: () => void;
}

const SPAWN_SIDES = ['left', 'right', 'top', 'bottom'] as const;
type SpawnSide = typeof SPAWN_SIDES[number];

const ARENA_X = 8;
const ARENA_Z = 5;

export function DiceScene({ pool, config, rolling, settled, onAllSettled, onCanvasClick }: DiceSceneProps) {
  const settledResultsRef = useRef<Map<string, number>>(new Map());
  const expectedCountRef = useRef(0);
  const hasReportedRef = useRef(false);

  useEffect(() => {
    if (rolling) {
      settledResultsRef.current = new Map();
      expectedCountRef.current = pool.length;
      hasReportedRef.current = false;
    }
  }, [rolling, pool.length]);

  const handleSettle = useCallback((id: string, result: number) => {
    settledResultsRef.current.set(id, result);
    if (
      !hasReportedRef.current &&
      settledResultsRef.current.size >= expectedCountRef.current &&
      expectedCountRef.current > 0
    ) {
      hasReportedRef.current = true;
      const results: RollResult[] = Array.from(settledResultsRef.current.entries()).map(
        ([dieId, res]) => {
          const parts = dieId.split('-');
          const dt = parseInt(parts[2] ?? '6', 10) as DieType;
          return { dieType: dt, result: res };
        }
      );
      onAllSettled(results);
    }
  }, [onAllSettled]);

  const dieEntries = pool.map((dieType, i) => ({
    id: `die-${i}-${dieType}`,
    dieType,
    spawnSide: SPAWN_SIDES[i % SPAWN_SIDES.length] as SpawnSide,
  }));

  return (
    <Canvas
      shadows
      camera={{ fov: 55, near: 0.1, far: 200 }}
      onClick={settled ? onCanvasClick : undefined}
      style={{ position: 'absolute', inset: 0, pointerEvents: (rolling || settled) ? 'auto' : 'none', cursor: settled ? 'pointer' : 'default' }}
      gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
    >
      <CameraSetup />

      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 14, 8]}
        intensity={2.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-3, 8, -5]} intensity={0.8} />
      <pointLight position={[-4, 6, -4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[4, 4, 4]} intensity={0.6} color="#ffffff" />

      <Environment preset="city" />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.3} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>

      <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={24} blur={2} far={6} />

      <Physics gravity={[0, -15, 0]} timeStep="vary">
        <RigidBody type="fixed" friction={0.9} restitution={0.3}>
          <CuboidCollider args={[ARENA_X + 2, 4, ARENA_Z + 2]} position={[0, -4, 0]} />
        </RigidBody>
        <RigidBody type="fixed" restitution={0.4}>
          <CuboidCollider args={[0.5, 8, ARENA_Z + 2]} position={[-(ARENA_X + 0.5), 0, 0]} />
          <CuboidCollider args={[0.5, 8, ARENA_Z + 2]} position={[ARENA_X + 0.5, 0, 0]} />
          <CuboidCollider args={[ARENA_X + 2, 8, 0.5]} position={[0, 0, -(ARENA_Z + 0.5)]} />
          <CuboidCollider args={[ARENA_X + 2, 8, 0.5]} position={[0, 0, ARENA_Z + 0.5]} />
          <CuboidCollider args={[ARENA_X + 2, 0.5, ARENA_Z + 2]} position={[0, 8, 0]} />
        </RigidBody>

        {dieEntries.map(({ id, dieType, spawnSide }) => (
          <Die
            key={id}
            id={id}
            dieType={dieType}
            config={config}
            spawnSide={spawnSide}
            arenaX={ARENA_X}
            arenaZ={ARENA_Z}
            rolling={rolling}
            onSettle={handleSettle}
          />
        ))}
      </Physics>
    </Canvas>
  );
}

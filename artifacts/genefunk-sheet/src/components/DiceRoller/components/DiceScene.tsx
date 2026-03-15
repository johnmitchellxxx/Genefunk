import { useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import type { DieType, DieConfig, RollResult } from '../types';
import { Die } from './Die';

// Nearly overhead: ~8° from vertical — almost pure top-down, result face faces viewer
const CAMERA_Y = 16.0;
const CAMERA_Z = 2.5;

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, CAMERA_Y, CAMERA_Z);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    (camera as THREE.PerspectiveCamera).fov = 55;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
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
    <div
      style={{
        position: 'absolute',
        inset: 0,
        cursor: settled ? 'pointer' : 'default',
        pointerEvents: (rolling || settled) ? 'auto' : 'none',
      }}
      onClick={settled ? onCanvasClick : undefined}
    >
      <Canvas
        camera={{ fov: 55, near: 0.1, far: 200, position: [0, CAMERA_Y, CAMERA_Z] }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <CameraSetup />

        <ambientLight intensity={0.5} />
        {/* Primary light from almost directly above with slight front offset */}
        <directionalLight position={[2, 14, 4]} intensity={4.0} castShadow />
        {/* Fill from left */}
        <directionalLight position={[-8, 8, 2]} intensity={1.6} />
        {/* Fill from right */}
        <directionalLight position={[8, 8, 2]} intensity={1.2} />
        <pointLight position={[0, 6, 0]} intensity={1.0} color="#ffffff" />

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
    </div>
  );
}

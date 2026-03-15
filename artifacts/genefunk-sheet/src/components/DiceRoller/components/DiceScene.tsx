import { useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import type { DieType, DieConfig, RollResult } from '../types';
import { Die } from './Die';

// Dramatic angle: ~35° from vertical — shows real 3D depth while top face stays readable
const CAMERA_Y = 10.0;
const CAMERA_Z = 7.0;
const CAMERA_FOV = 65;

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, CAMERA_Y, CAMERA_Z);
    camera.up.set(0, 1, 0);
    camera.lookAt(0, 0, 0);
    (camera as THREE.PerspectiveCamera).fov = CAMERA_FOV;
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

const ARENA_X = 14;
const ARENA_Z = 9;

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
        camera={{ fov: CAMERA_FOV, near: 0.1, far: 200, position: [0, CAMERA_Y, CAMERA_Z] }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        shadows
      >
        <CameraSetup />

        <ambientLight intensity={0.5} />
        {/* Primary shadow-casting light — frustum covers full arena */}
        <directionalLight
          position={[3, 14, 6]}
          intensity={3.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={40}
          shadow-camera-left={-17}
          shadow-camera-right={17}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.002}
        />
        {/* Fill from left */}
        <directionalLight position={[-12, 8, 4]} intensity={1.4} />
        {/* Fill from right */}
        <directionalLight position={[12, 8, 4]} intensity={1.0} />
        {/* Back rim — lights far side of arena visible in 35° camera */}
        <directionalLight position={[0, 6, -12]} intensity={0.7} />
        <pointLight position={[0, 5, 0]} intensity={0.8} color="#ffffff" />

        {/* Invisible floor that only renders the shadow cast by dice */}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[(ARENA_X + 2) * 2, (ARENA_Z + 2) * 2]} />
          <shadowMaterial opacity={0.22} />
        </mesh>

        <Physics gravity={[0, -15, 0]} timeStep="vary">
          <RigidBody type="fixed" friction={0.9} restitution={0.3}>
            <CuboidCollider args={[ARENA_X + 2, 4, ARENA_Z + 2]} position={[0, -4, 0]} />
          </RigidBody>
          <RigidBody type="fixed" restitution={0.4}>
            <CuboidCollider args={[0.5, 12, ARENA_Z + 2]} position={[-(ARENA_X + 0.5), 0, 0]} />
            <CuboidCollider args={[0.5, 12, ARENA_Z + 2]} position={[ARENA_X + 0.5, 0, 0]} />
            <CuboidCollider args={[ARENA_X + 2, 12, 0.5]} position={[0, 0, -(ARENA_Z + 0.5)]} />
            <CuboidCollider args={[ARENA_X + 2, 12, 0.5]} position={[0, 0, ARENA_Z + 0.5]} />
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

import { useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import type { DieType, DieConfig, RollResult } from '../types';
import { Die } from './Die';

// Nearly-overhead camera — Y=16, Z=2 gives ~15° tilt from overhead.
const CAMERA_Y = 16.0;
const CAMERA_Z = 2.0;
const CAMERA_FOV = 55;

/**
 * Compute arena half-extents so the physics walls always align with the
 * edges of the visible viewport, regardless of screen size or orientation.
 *
 * Camera is fixed at (0, CAMERA_Y, CAMERA_Z) looking at origin, vFOV=55°.
 * Analytical frustum-ground intersection:
 *  - Z extent is constant (determined by vFOV + camera height) ≈ ±8.5 world units
 *  - X extent scales linearly with the viewport aspect ratio
 */
function computeArena(): { x: number; z: number } {
  const aspect = window.innerWidth / window.innerHeight;
  const vFovRad = (CAMERA_FOV * Math.PI) / 180;
  const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * aspect);
  // Ground half-extents: tan(halfFOV) × camera_height, with 15% margin for walls
  const halfZ = Math.tan(vFovRad / 2) * CAMERA_Y * 1.15;
  const halfX = Math.tan(hFovRad / 2) * CAMERA_Y * 1.15;
  return { x: Math.max(5, halfX), z: Math.max(8, halfZ) };
}

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
}

const SPAWN_SIDES = ['left', 'right', 'top', 'bottom'] as const;
type SpawnSide = typeof SPAWN_SIDES[number];

export function DiceScene({ pool, config, rolling, settled, onAllSettled }: DiceSceneProps) {
  // Compute once per mount (the component remounts per roll via key).
  // This ensures walls always match the actual visible viewport size.
  const { x: ARENA_X, z: ARENA_Z } = computeArena();
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
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ fov: CAMERA_FOV, near: 0.1, far: 200, position: [0, CAMERA_Y, CAMERA_Z] }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        shadows
      >
        <CameraSetup />

        <ambientLight intensity={0.5} />
        {/* Primary shadow-casting light */}
        <directionalLight
          position={[2, 18, 4]}
          intensity={3.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={30}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={13}
          shadow-camera-bottom={-13}
          shadow-bias={-0.002}
        />
        {/* Fill lights */}
        <directionalLight position={[-6, 10, 4]} intensity={1.2} />
        <directionalLight position={[6, 10, 4]} intensity={0.9} />
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

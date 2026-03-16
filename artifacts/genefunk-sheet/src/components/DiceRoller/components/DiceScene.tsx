import { useRef, useCallback, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import * as THREE from 'three';
import type { DieType, DieConfig, RollResult } from '../types';
import { Die } from './Die';

// True top-down camera: directly overhead, no tilt whatsoever.
// CAMERA_Z must be 0 — any offset creates a tilt.
// camera.up = (0,0,-1) because when looking straight down the world-Y
// "up" is degenerate; we use world -Z as the screen-up direction instead.
//
// FOV=25 + height=38 keeps the same ground coverage as FOV=50 + height=18
// (halfZ = tan(FOV/2) × height is equal in both cases) while reducing
// perspective warp at the edges to near-zero — objects at the corners no
// longer appear noticeably skewed or foreshortened.
const CAMERA_Y = 38.0;
const CAMERA_FOV = 25;

/**
 * Compute arena half-extents so physics walls sit just outside the visible
 * ground area.  For a perfectly overhead camera at height H, vFOV α:
 *   halfZ = tan(α/2) × H          (vertical, constant)
 *   halfX = tan(α/2) × H × aspect (horizontal, scales with viewport)
 * +15% margin so walls are never accidentally in view.
 */
function computeArena(): { x: number; z: number } {
  const aspect = window.innerWidth / window.innerHeight;
  const halfAngle = Math.tan((CAMERA_FOV * Math.PI) / 180 / 2);
  const halfZ = halfAngle * CAMERA_Y * 1.15;
  const halfX = halfZ * aspect;
  return { x: Math.max(5, halfX), z: Math.max(8, halfZ) };
}

function CameraSetup() {
  const { camera } = useThree();
  useEffect(() => {
    // Straight down: (0, CAMERA_Y, 0) → lookAt (0,0,0)
    // When looking along -Y, world "up" (0,1,0) is degenerate — use -Z instead
    camera.position.set(0, CAMERA_Y, 0);
    camera.up.set(0, 0, -1);
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
        camera={{ fov: CAMERA_FOV, near: 0.1, far: 200, position: [0, CAMERA_Y, 0] }}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        shadows
      >
        <CameraSetup />

        <ambientLight intensity={0.6} />
        {/* Primary shadow light — offset so dice faces get side-shading even
            from an overhead camera, keeping them readable */}
        <directionalLight
          position={[4, 20, 6]}
          intensity={3.0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={35}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-bias={-0.002}
        />
        {/* Fill lights from the sides so no face is completely black */}
        <directionalLight position={[-8, 10, -4]} intensity={1.2} />
        <directionalLight position={[8, 10, 4]} intensity={0.9} />
        <pointLight position={[0, 6, 0]} intensity={0.7} color="#ffffff" />

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

import * as THREE from 'three';
import type { DieType } from '../types';

export interface DieGeometryInfo {
  geometry: THREE.BufferGeometry;
  faceCount: number;
  faceNormals: THREE.Vector3[];
}

// D4 UV layout — derived by projecting each face's vertices onto its own plane
// and reading the 2D coordinates as seen from outside the face.
// For every face of a regular tetrahedron the three vertex positions project to:
//   vertex[0] → physical TOP-RIGHT  → UV (0.85, 0.80)
//   vertex[1] → physical BOTTOM-CENTER → UV (0.50, 0.12)
//   vertex[2] → physical TOP-LEFT   → UV (0.15, 0.80)
// Placing UVs here means a number drawn upright in the canvas texture will
// appear upright when the face is viewed straight-on from outside.
const TRI_UV: Array<[number, number]> = [
  [0.85, 0.80],   // vertex[0]: top-right
  [0.50, 0.12],   // vertex[1]: bottom-center
  [0.15, 0.80],   // vertex[2]: top-left
];

// THREE.TetrahedronGeometry(0.85) has these 4 unique vertices (unnormalized → scaled):
//   v0=(1,1,1)  v1=(-1,-1,1)  v2=(-1,1,-1)  v3=(1,-1,-1)   × (0.85/√3)
// Assigned die values: v0=1, v1=2, v2=3, v3=4
//
// After toNonIndexed (indices [2,1,0, 0,3,2, 1,3,0, 2,3,1]):
//   Face 0: [v2,v1,v0] → topR=3, botC=2, topL=1
//   Face 1: [v0,v3,v2] → topR=1, botC=4, topL=3
//   Face 2: [v1,v3,v0] → topR=2, botC=4, topL=1
//   Face 3: [v2,v3,v1] → topR=3, botC=4, topL=2
//
// Result when face k is on the floor = value of opposite vertex:
//   Face 0 opposite v3=4 → result 4
//   Face 1 opposite v1=2 → result 2
//   Face 2 opposite v2=3 → result 3
//   Face 3 opposite v0=1 → result 1

/** [topRightVal, bottomCenterVal, topLeftVal] for each D4 face (index 0-3), matching TRI_UV positions. */
export const D4_FACE_VERTEX_VALUES: readonly [number, number, number][] = [
  [3, 2, 1],
  [1, 4, 3],
  [2, 4, 1],
  [3, 4, 2],
];

/** Result value when face k is the floor face (most-downward normal). */
export const D4_OPPOSITE_VALUES: readonly number[] = [4, 2, 3, 1];


/**
 * Compute per-face outward normals directly from a non-indexed BufferGeometry
 * that has already had groups added by addFaceGroups.  Because the normals are
 * read from the same buffer that the material groups refer to, index N in the
 * returned array always corresponds to material group N — fixing the previous
 * mismatch where hardcoded theoretical normals were in a different order than
 * Three.js's buffer order.
 */
function computeFaceNormals(geo: THREE.BufferGeometry, trianglesPerFace: number): THREE.Vector3[] {
  const pos = geo.attributes.position;
  const totalVerts = pos.count;
  const faceCount = Math.round(totalVerts / 3 / trianglesPerFace);
  const normals: THREE.Vector3[] = [];
  for (let f = 0; f < faceCount; f++) {
    const base = f * trianglesPerFace * 3;
    const v0 = new THREE.Vector3(pos.getX(base),   pos.getY(base),   pos.getZ(base));
    const v1 = new THREE.Vector3(pos.getX(base+1), pos.getY(base+1), pos.getZ(base+1));
    const v2 = new THREE.Vector3(pos.getX(base+2), pos.getY(base+2), pos.getZ(base+2));
    const n = new THREE.Vector3()
      .crossVectors(v1.clone().sub(v0), v2.clone().sub(v0))
      .normalize();
    // Ensure outward direction: normal should point away from the origin / centroid
    const centroid = v0.clone().add(v1).add(v2).divideScalar(3);
    if (n.dot(centroid) < 0) n.negate();
    normals.push(n);
  }
  return normals;
}

/**
 * Project the given vertices onto their face plane and return UV coordinates.
 * axisV = faceNormal × axisU preserves CCW handedness so textures are never
 * mirrored on CCW-wound faces (which is what Three.js built-in geometries use).
 */
function projectFaceUVs(verts: THREE.Vector3[], scale = 0.40): [number, number][] {
  const centroid = new THREE.Vector3();
  verts.forEach(v => centroid.add(v));
  centroid.divideScalar(verts.length);

  const faceNormal = centroid.clone().normalize();

  // axisU: from centroid toward first vertex, projected onto face plane
  let axisU = verts[0].clone().sub(centroid);
  axisU.addScaledVector(faceNormal, -axisU.dot(faceNormal)).normalize();

  // axisV = faceNormal × axisU — right-handed triplet → CCW UV for CCW faces
  const axisV = new THREE.Vector3().crossVectors(faceNormal, axisU).normalize();

  const local = verts.map(v => {
    const d = v.clone().sub(centroid);
    return [d.dot(axisU), d.dot(axisV)] as [number, number];
  });

  const maxR = Math.max(...local.map(([u, v]) => Math.hypot(u, v)));
  const s = maxR > 0 ? scale / maxR : 1;
  return local.map(([u, v]) => [0.5 + u * s, 0.5 + v * s] as [number, number]);
}

/**
 * addFaceGroups — sets up material groups and UV coordinates.
 *
 * useProjection (default false):
 *   false → use hardcoded TRI_UV (only correct for D4 whose texture function
 *            draws numbers at the matching canvas positions).
 *   true  → per-face UV projection; produces non-mirrored textures for any
 *            CCW-wound geometry (IcosahedronGeometry, OctahedronGeometry, …).
 */
function addFaceGroups(
  geo: THREE.BufferGeometry,
  trianglesPerFace: number,
  useProjection = false,
): THREE.BufferGeometry {
  const nonIndexed = geo.toNonIndexed();
  const posAttr = nonIndexed.attributes.position;
  const posCount = posAttr.count;
  const faceCount = posCount / 3 / trianglesPerFace;
  const uvArray = new Float32Array(posCount * 2);

  for (let face = 0; face < faceCount; face++) {
    const faceVertStart = face * trianglesPerFace * 3;
    const totalFaceVerts = trianglesPerFace * 3;

    if (trianglesPerFace === 1 && !useProjection) {
      // TRI_UV path — only used for D4
      for (let v = 0; v < 3; v++) {
        uvArray[(faceVertStart + v) * 2 + 0] = TRI_UV[v][0];
        uvArray[(faceVertStart + v) * 2 + 1] = TRI_UV[v][1];
      }
    } else {
      // Per-face UV projection (trianglesPerFace===1 with useProjection, or ===3 for D12)
      const verts: THREE.Vector3[] = [];
      for (let i = 0; i < totalFaceVerts; i++) {
        const vi = faceVertStart + i;
        verts.push(new THREE.Vector3(posAttr.getX(vi), posAttr.getY(vi), posAttr.getZ(vi)));
      }
      // Scale: triangles sit inside a circle at ~0.577r from centre; use 0.40
      // Pentagons (D12) are larger relative to circumradius; keep 0.45
      const uvScale = trianglesPerFace === 1 ? 0.40 : 0.45;
      const uvCoords = projectFaceUVs(verts, uvScale);
      for (let i = 0; i < totalFaceVerts; i++) {
        uvArray[(faceVertStart + i) * 2 + 0] = uvCoords[i][0];
        uvArray[(faceVertStart + i) * 2 + 1] = uvCoords[i][1];
      }
    }

    nonIndexed.addGroup(faceVertStart, totalFaceVerts, face);
  }

  nonIndexed.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
  nonIndexed.computeVertexNormals();
  return nonIndexed;
}

function buildTetrahedron(): DieGeometryInfo {
  // D4: keep TRI_UV (makeD4FaceTexture draws numbers at the matching canvas positions)
  const geo = addFaceGroups(new THREE.TetrahedronGeometry(0.85), 1, false);
  const faceNormals = computeFaceNormals(geo, 1);
  return { geometry: geo, faceCount: 4, faceNormals };
}

function buildCube(): DieGeometryInfo {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const faceNormals = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ];
  return { geometry: geo, faceCount: 6, faceNormals };
}

function buildOctahedron(): DieGeometryInfo {
  // useProjection=true: OctahedronGeometry is CCW-wound; projection gives correct handedness.
  const geo = addFaceGroups(new THREE.OctahedronGeometry(1.1), 1, true);
  const faceNormals = computeFaceNormals(geo, 1);
  return { geometry: geo, faceCount: 8, faceNormals };
}

function buildD10(): DieGeometryInfo {
  // Pentagonal bipyramid-like D10.
  // Upper and lower equatorial rings are at ±yOff so the die is symmetric.
  // Winding order is chosen so each face's outward normal points away from origin
  // (CCW when viewed from outside) — this prevents face culling and ensures
  // projectFaceUVs produces non-mirrored textures.
  const r = 1.0;
  const h = 0.9;       // apex height
  const yOff = 0.15;   // equatorial ring offset from y=0

  const top = new THREE.Vector3(0,  h, 0);
  const bot = new THREE.Vector3(0, -h, 0);
  const eq: THREE.Vector3[] = [];    // upper ring  (y = +yOff)
  const eqOff: THREE.Vector3[] = []; // lower ring  (y = -yOff)

  for (let i = 0; i < 5; i++) {
    const a  = (i / 5) * Math.PI * 2;
    const ao = a + Math.PI / 5;            // offset by 36°
    eq.push(   new THREE.Vector3(Math.cos(a)  * r,  yOff, Math.sin(a)  * r));
    eqOff.push(new THREE.Vector3(Math.cos(ao) * r, -yOff, Math.sin(ao) * r));
  }

  const positions: number[] = [];
  const uvs: number[] = [];
  const geo = new THREE.BufferGeometry();

  // Top 5 faces: (top, eq[i+1], eq[i])
  // Cross-product check: n.y = r²·sin72° > 0 → outward (upward) ✓
  for (let i = 0; i < 5; i++) {
    const v0 = top, v1 = eq[(i + 1) % 5], v2 = eq[i];
    positions.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    const uvFace = projectFaceUVs([v0, v1, v2]);
    uvs.push(...uvFace[0], ...uvFace[1], ...uvFace[2]);
    geo.addGroup(i * 3, 3, i);
  }

  // Bottom 5 faces: (bot, eqOff[i], eqOff[i+1])
  // Cross-product check: n.y = r²·sin(-72°) < 0 → outward (downward) ✓
  for (let i = 0; i < 5; i++) {
    const fi = 5 + i;
    const v0 = bot, v1 = eqOff[i], v2 = eqOff[(i + 1) % 5];
    positions.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    const uvFace = projectFaceUVs([v0, v1, v2]);
    uvs.push(...uvFace[0], ...uvFace[1], ...uvFace[2]);
    geo.addGroup(fi * 3, 3, fi);
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv',       new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();

  const faceNormals = computeFaceNormals(geo, 1);
  return { geometry: geo, faceCount: 10, faceNormals };
}

function buildDodecahedron(): DieGeometryInfo {
  const geo = addFaceGroups(new THREE.DodecahedronGeometry(1.1), 3);
  const faceNormals = computeFaceNormals(geo, 3);
  return { geometry: geo, faceCount: 12, faceNormals };
}

function buildIcosahedron(): DieGeometryInfo {
  // useProjection=true: IcosahedronGeometry is CCW-wound; projection fixes mirroring.
  const geo = addFaceGroups(new THREE.IcosahedronGeometry(1.1), 1, true);
  const faceNormals = computeFaceNormals(geo, 1);
  return { geometry: geo, faceCount: 20, faceNormals };
}

const cache = new Map<DieType, DieGeometryInfo>();

export function getDieGeometry(dieType: DieType): DieGeometryInfo {
  if (cache.has(dieType)) return cache.get(dieType)!;
  let info: DieGeometryInfo;
  switch (dieType) {
    case 4:   info = buildTetrahedron(); break;
    case 6:   info = buildCube(); break;
    case 8:   info = buildOctahedron(); break;
    case 10:
    case 100: info = buildD10(); break;
    case 12:  info = buildDodecahedron(); break;
    case 20:  info = buildIcosahedron(); break;
    default:  info = buildCube(); break;
  }
  cache.set(dieType, info);
  return info;
}

export function getFaceUp(quaternion: THREE.Quaternion, info: DieGeometryInfo): number {
  const up = new THREE.Vector3(0, 1, 0);
  let bestDot = -Infinity;
  let bestIndex = 0;
  info.faceNormals.forEach((normal, i) => {
    const worldNormal = normal.clone().applyQuaternion(quaternion);
    const dot = worldNormal.dot(up);
    if (dot > bestDot) { bestDot = dot; bestIndex = i; }
  });
  return Math.min(bestIndex + 1, info.faceCount);
}

export const INTERIOR_OBJECT_EMOJI: Record<string, string> = {
  skull: '💀', unicorn: '🦄', star: '⭐', gem: '💎', flame: '🔥',
  dragon: '🐉', moon: '🌙', lightning: '⚡', rose: '🌹', eye: '👁️',
};

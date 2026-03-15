import * as THREE from 'three';
import type { DieType } from '../types';

export interface DieGeometryInfo {
  geometry: THREE.BufferGeometry;
  faceCount: number;
  faceNormals: THREE.Vector3[];
}

const TRI_UV: Array<[number, number]> = [
  [0.5, 0.95],
  [0.11, 0.275],
  [0.89, 0.275],
];

function pentagonUVs(): Array<[number, number]> {
  const r = 0.45;
  const uvs: Array<[number, number]> = [];
  for (let i = 0; i < 5; i++) {
    const angle = Math.PI / 2 + (i * 2 * Math.PI) / 5;
    uvs.push([0.5 + r * Math.cos(angle), 0.5 + r * Math.sin(angle)]);
  }
  return uvs;
}

function addFaceGroups(geo: THREE.BufferGeometry, trianglesPerFace: number): THREE.BufferGeometry {
  const nonIndexed = geo.toNonIndexed();
  const posCount = nonIndexed.attributes.position.count;
  const faceCount = posCount / 3 / trianglesPerFace;
  const uvArray = new Float32Array(posCount * 2);
  const pentUVs = pentagonUVs();

  for (let face = 0; face < faceCount; face++) {
    for (let tri = 0; tri < trianglesPerFace; tri++) {
      const vtxBase = (face * trianglesPerFace + tri) * 3;
      if (trianglesPerFace === 1) {
        for (let v = 0; v < 3; v++) {
          uvArray[(vtxBase + v) * 2 + 0] = TRI_UV[v][0];
          uvArray[(vtxBase + v) * 2 + 1] = TRI_UV[v][1];
        }
      } else if (trianglesPerFace === 3) {
        const fanUVs: Array<[number, number]>[] = [
          [pentUVs[0], pentUVs[1], pentUVs[2]],
          [pentUVs[0], pentUVs[2], pentUVs[3]],
          [pentUVs[0], pentUVs[3], pentUVs[4]],
        ];
        const triUVs = fanUVs[tri];
        for (let v = 0; v < 3; v++) {
          uvArray[(vtxBase + v) * 2 + 0] = triUVs[v][0];
          uvArray[(vtxBase + v) * 2 + 1] = triUVs[v][1];
        }
      }
    }
    nonIndexed.addGroup(face * trianglesPerFace * 3, trianglesPerFace * 3, face);
  }

  nonIndexed.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2));
  nonIndexed.computeVertexNormals();
  return nonIndexed;
}

function buildTetrahedron(): DieGeometryInfo {
  const geo = addFaceGroups(new THREE.TetrahedronGeometry(0.85), 1);
  const faceNormals = [
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1 / 3, 2 * Math.sqrt(2) / 3),
    new THREE.Vector3(-Math.sqrt(6) / 3, -1 / 3, -Math.sqrt(2) / 3),
    new THREE.Vector3(Math.sqrt(6) / 3, -1 / 3, -Math.sqrt(2) / 3),
  ];
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
  const geo = addFaceGroups(new THREE.OctahedronGeometry(1.1), 1);
  const s = 1 / Math.sqrt(3);
  const faceNormals = [
    new THREE.Vector3(s, s, s),
    new THREE.Vector3(-s, s, s),
    new THREE.Vector3(s, -s, s),
    new THREE.Vector3(-s, -s, s),
    new THREE.Vector3(s, s, -s),
    new THREE.Vector3(-s, s, -s),
    new THREE.Vector3(s, -s, -s),
    new THREE.Vector3(-s, -s, -s),
  ];
  return { geometry: geo, faceCount: 8, faceNormals };
}

function buildD10(): DieGeometryInfo {
  const r = 1.0;
  const h = 0.8;
  const top = new THREE.Vector3(0, h, 0);
  const bot = new THREE.Vector3(0, -h, 0);
  const eq: THREE.Vector3[] = [];
  const eqOff: THREE.Vector3[] = [];

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const ao = a + Math.PI / 5;
    eq.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    eqOff.push(new THREE.Vector3(Math.cos(ao) * r, 0.1, Math.sin(ao) * r));
  }

  const positions: number[] = [];
  const uvs: number[] = [];

  const geo = new THREE.BufferGeometry();

  for (let i = 0; i < 5; i++) {
    const v0 = top, v1 = eq[i], v2 = eq[(i + 1) % 5];
    positions.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    uvs.push(...TRI_UV[0], ...TRI_UV[1], ...TRI_UV[2]);
    geo.addGroup(i * 3, 3, i);
  }
  for (let i = 0; i < 5; i++) {
    const v0 = bot, v1 = eqOff[(i + 1) % 5], v2 = eqOff[i];
    const fi = 5 + i;
    positions.push(v0.x, v0.y, v0.z, v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
    uvs.push(...TRI_UV[0], ...TRI_UV[1], ...TRI_UV[2]);
    geo.addGroup(fi * 3, 3, fi);
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();

  const faceNormals: THREE.Vector3[] = [];
  for (let i = 0; i < 5; i++) {
    const a = ((i + 0.5) / 5) * Math.PI * 2;
    faceNormals.push(new THREE.Vector3(Math.cos(a), 0.5, Math.sin(a)).normalize());
  }
  for (let i = 0; i < 5; i++) {
    const a = ((i + 0.5) / 5) * Math.PI * 2 + Math.PI / 5;
    faceNormals.push(new THREE.Vector3(Math.cos(a), -0.5, Math.sin(a)).normalize());
  }
  return { geometry: geo, faceCount: 10, faceNormals };
}

function buildDodecahedron(): DieGeometryInfo {
  const geo = addFaceGroups(new THREE.DodecahedronGeometry(1.1), 3);
  const phi = (1 + Math.sqrt(5)) / 2;
  const faceNormals = [
    new THREE.Vector3(0, 1, phi), new THREE.Vector3(0, -1, phi),
    new THREE.Vector3(0, 1, -phi), new THREE.Vector3(0, -1, -phi),
    new THREE.Vector3(phi, 0, 1), new THREE.Vector3(phi, 0, -1),
    new THREE.Vector3(-phi, 0, 1), new THREE.Vector3(-phi, 0, -1),
    new THREE.Vector3(1, phi, 0), new THREE.Vector3(-1, phi, 0),
    new THREE.Vector3(1, -phi, 0), new THREE.Vector3(-1, -phi, 0),
  ].map(v => v.normalize());
  return { geometry: geo, faceCount: 12, faceNormals };
}

function buildIcosahedron(): DieGeometryInfo {
  const geo = addFaceGroups(new THREE.IcosahedronGeometry(1.1), 1);
  const phi = (1 + Math.sqrt(5)) / 2;
  const faceNormals: THREE.Vector3[] = [
    new THREE.Vector3(0, 1, phi), new THREE.Vector3(0, -1, phi),
    new THREE.Vector3(0, 1, -phi), new THREE.Vector3(0, -1, -phi),
    new THREE.Vector3(phi, 0, 1), new THREE.Vector3(phi, 0, -1),
    new THREE.Vector3(-phi, 0, 1), new THREE.Vector3(-phi, 0, -1),
    new THREE.Vector3(1, phi, 0), new THREE.Vector3(-1, phi, 0),
    new THREE.Vector3(1, -phi, 0), new THREE.Vector3(-1, -phi, 0),
    new THREE.Vector3(1, 1, 1), new THREE.Vector3(-1, 1, 1),
    new THREE.Vector3(1, -1, 1), new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(1, 1, -1), new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(1, -1, -1), new THREE.Vector3(-1, -1, -1),
  ].map(v => v.normalize());
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

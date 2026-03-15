import * as THREE from 'three';
import type { DieType } from '../types';

export interface DieGeometryInfo {
  geometry: THREE.BufferGeometry;
  faceCount: number;
  faceNormals: THREE.Vector3[];
}

function buildTetrahedron(): DieGeometryInfo {
  const geo = new THREE.TetrahedronGeometry(0.45);
  geo.computeVertexNormals();
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
  const geo = new THREE.OctahedronGeometry(0.7);
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
  const geo = new THREE.BufferGeometry();
  const r = 0.6;
  const h = 0.5;
  const vertices: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];

  const top = new THREE.Vector3(0, h, 0);
  const bot = new THREE.Vector3(0, -h, 0);
  const equatorial: THREE.Vector3[] = [];
  const equatorialOff: THREE.Vector3[] = [];

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const ao = a + Math.PI / 5;
    equatorial.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    equatorialOff.push(new THREE.Vector3(Math.cos(ao) * r, 0.1, Math.sin(ao) * r));
  }

  const pts = [top, bot, ...equatorial, ...equatorialOff];
  pts.forEach(p => { vertices.push(p.x, p.y, p.z); normals.push(p.x, p.y, p.z); });

  for (let i = 0; i < 5; i++) {
    indices.push(0, 2 + i, 2 + ((i + 1) % 5));
  }
  for (let i = 0; i < 5; i++) {
    indices.push(1, 7 + ((i + 1) % 5), 7 + i);
  }

  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
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
  const geo = new THREE.DodecahedronGeometry(0.7);
  const phi = (1 + Math.sqrt(5)) / 2;
  const faceNormals = [
    new THREE.Vector3(0, 1, phi),
    new THREE.Vector3(0, -1, phi),
    new THREE.Vector3(0, 1, -phi),
    new THREE.Vector3(0, -1, -phi),
    new THREE.Vector3(phi, 0, 1),
    new THREE.Vector3(phi, 0, -1),
    new THREE.Vector3(-phi, 0, 1),
    new THREE.Vector3(-phi, 0, -1),
    new THREE.Vector3(1, phi, 0),
    new THREE.Vector3(-1, phi, 0),
    new THREE.Vector3(1, -phi, 0),
    new THREE.Vector3(-1, -phi, 0),
  ].map(v => v.normalize());
  return { geometry: geo, faceCount: 12, faceNormals };
}

function buildIcosahedron(): DieGeometryInfo {
  const geo = new THREE.IcosahedronGeometry(0.7);
  const phi = (1 + Math.sqrt(5)) / 2;
  const faceNormals: THREE.Vector3[] = [
    new THREE.Vector3(0, 1, phi),
    new THREE.Vector3(0, -1, phi),
    new THREE.Vector3(0, 1, -phi),
    new THREE.Vector3(0, -1, -phi),
    new THREE.Vector3(phi, 0, 1),
    new THREE.Vector3(phi, 0, -1),
    new THREE.Vector3(-phi, 0, 1),
    new THREE.Vector3(-phi, 0, -1),
    new THREE.Vector3(1, phi, 0),
    new THREE.Vector3(-1, phi, 0),
    new THREE.Vector3(1, -phi, 0),
    new THREE.Vector3(-1, -phi, 0),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(-1, 1, 1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(1, 1, -1),
    new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(-1, -1, -1),
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
    case 10:  info = buildD10(); break;
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
    if (dot > bestDot) {
      bestDot = dot;
      bestIndex = i;
    }
  });
  const value = Math.floor((bestIndex / info.faceNormals.length) * info.faceCount) + 1;
  return Math.min(value, info.faceCount);
}

export const INTERIOR_OBJECT_EMOJI: Record<string, string> = {
  skull: '💀', unicorn: '🦄', star: '⭐', gem: '💎', flame: '🔥',
  dragon: '🐉', moon: '🌙', lightning: '⚡', rose: '🌹', eye: '👁️',
};

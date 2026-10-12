import * as THREE from 'three';

// ---------- Konstanta skala visual (skematis) ----------
export const SUN_RADIUS = 4;
export const EARTH_ORBIT = 24;
export const EARTH_RADIUS = 2.6;
export const MOON_ORBIT = 6.5;
export const MOON_RADIUS = 0.85;
export const AXIS_TILT = 23.5;

// ---------- Tekstur prosedural ----------
export function makeEarthTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, '#1e6fb8');
  g.addColorStop(0.5, '#2b8fd6');
  g.addColorStop(1, '#1e6fb8');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  ctx.fillStyle = '#3f9e4d';
  const blobs: [number, number, number, number][] = [
    [80, 70, 55, 35], [150, 100, 40, 50], [250, 60, 60, 30],
    [330, 110, 45, 40], [430, 80, 50, 35], [200, 170, 45, 25],
    [380, 180, 40, 22], [60, 160, 35, 20],
  ];
  for (const [x, y, rx, ry] of blobs) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#eaf4fb';
  ctx.fillRect(0, 0, 512, 18);
  ctx.fillRect(0, 238, 512, 18);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeMoonTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#9a9a9a';
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = 2 + Math.random() * 10;
    ctx.fillStyle = `rgba(70,70,70,${0.25 + Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(200,200,200,0.35)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function makeGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,230,140,1)');
  g.addColorStop(0.25, 'rgba(255,190,70,0.7)');
  g.addColorStop(0.6, 'rgba(255,150,40,0.25)');
  g.addColorStop(1, 'rgba(255,140,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

export function makeLabel(text: string, color = '#ffffff'): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.font = 'bold 30px Nunito, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillText(text, 128, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(7, 1.75, 1);
  return sprite;
}

export function makeOrbitRing(radius: number, color: number): THREE.LineLoop {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, -Math.sin(a) * radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.35,
  });
  return new THREE.LineLoop(geo, mat);
}

export function makeArrow(color: number): THREE.Mesh {
  const geo = new THREE.ConeGeometry(0.4, 1.2, 8);
  const mat = new THREE.MeshBasicMaterial({ color });
  return new THREE.Mesh(geo, mat);
}

export function makeHelperLine(color: number) {
  const group = new THREE.Group();
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]);
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
  });
  const line = new THREE.Line(geo, mat);
  group.add(line);
  const coneGeo = new THREE.ConeGeometry(0.35, 1.0, 8);
  const coneMat = new THREE.MeshBasicMaterial({ color });
  const cone = new THREE.Mesh(coneGeo, coneMat);
  group.add(cone);
  const update = (from: THREE.Vector3, to: THREE.Vector3) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, from.x, from.y, from.z);
    pos.setXYZ(1, to.x, to.y, to.z);
    pos.needsUpdate = true;
    geo.computeBoundingSphere();
    const dir = to.clone().sub(from).normalize();
    cone.position.copy(to).add(dir.clone().multiplyScalar(-0.5));
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  };
  return { group, update };
}

// Garis putus-putus (garis pandang)
export function makeDashedLine(color: number) {
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3(),
  ]);
  const mat = new THREE.LineDashedMaterial({
    color,
    dashSize: 0.8,
    gapSize: 0.5,
    transparent: true,
    opacity: 0.9,
  });
  const line = new THREE.Line(geo, mat);
  line.computeLineDistances();
  const update = (from: THREE.Vector3, to: THREE.Vector3) => {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    pos.setXYZ(0, from.x, from.y, from.z);
    pos.setXYZ(1, to.x, to.y, to.z);
    pos.needsUpdate = true;
    geo.computeBoundingSphere();
    line.computeLineDistances();
  };
  return { line, update };
}

// Busur sudut di Bumi (dari arah Matahari ke arah Bulan)
export function makeAngleArc(color: number) {
  const group = new THREE.Group();
  const mat = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
  });
  const geo = new THREE.BufferGeometry();
  const line = new THREE.Line(geo, mat);
  group.add(line);
  const update = (
    center: THREE.Vector3,
    dirA: THREE.Vector3,
    dirB: THREE.Vector3,
    radius: number
  ) => {
    const a = dirA.clone().setY(0).normalize();
    const b = dirB.clone().setY(0).normalize();
    const points: THREE.Vector3[] = [];
    const steps = 32;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const v = a.clone().lerp(b, t).normalize();
      points.push(
        new THREE.Vector3(
          center.x + v.x * radius,
          center.y,
          center.z + v.z * radius
        )
      );
    }
    geo.setFromPoints(points);
  };
  return { group, update };
}

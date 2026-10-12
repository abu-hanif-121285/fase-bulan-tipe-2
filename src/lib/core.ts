// ============================================================
// MISI TATA SURYA — inti astronomi, penyimpanan, dan audio
// ============================================================

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const SYNODIC_MONTH = 29.530588853; // ~29,5 hari (siklus fase)
export const SIDEREAL_MONTH = 27.321661; // ~27,3 hari (revolusi terhadap bintang)

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
export const degToRad = (d: number) => (d * Math.PI) / 180;
export const radToDeg = (r: number) => (r * 180) / Math.PI;

const sub = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
const norm = (a: Vec3): Vec3 => {
  const l = Math.hypot(a.x, a.y, a.z) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
};
const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;
const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

// ------------------------------------------------------------
// Data delapan fase Bulan
// ------------------------------------------------------------
export interface PhaseInfo {
  index: number;
  name: string;
  day: number;
  elongation: number; // sudut memanjang nominal (derajat)
  description: string;
}

export const PHASES: PhaseInfo[] = [
  { index: 0, name: 'Bulan Baru', day: 0, elongation: 0, description: 'Sisi Bulan yang terang umumnya menghadap menjauhi pengamat di Bumi sehingga Bulan tampak gelap atau sulit terlihat.' },
  { index: 1, name: 'Sabit Awal', day: 3.7, elongation: 45, description: 'Bagian terang yang terlihat berupa sabit tipis dan bertambah.' },
  { index: 2, name: 'Kuartal Pertama', day: 7.4, elongation: 90, description: 'Sekitar separuh cakram Bulan terlihat terang.' },
  { index: 3, name: 'Cembung Awal', day: 11.1, elongation: 135, description: 'Bagian terang yang terlihat lebih dari separuh dan terus bertambah.' },
  { index: 4, name: 'Purnama', day: 14.8, elongation: 180, description: 'Hampir seluruh cakram Bulan yang terlihat dari Bumi tampak terang.' },
  { index: 5, name: 'Cembung Akhir', day: 18.4, elongation: 225, description: 'Bagian terang lebih dari separuh, tetapi berkurang.' },
  { index: 6, name: 'Kuartal Akhir', day: 22.1, elongation: 270, description: 'Sekitar separuh cakram Bulan terlihat terang.' },
  { index: 7, name: 'Sabit Akhir', day: 25.8, elongation: 315, description: 'Bagian terang yang terlihat berupa sabit tipis dan terus berkurang.' },
];

// ------------------------------------------------------------
// Perhitungan fase dari posisi relatif Matahari–Bumi–Bulan
// ------------------------------------------------------------
export interface PhaseResult {
  elongationUnsigned: number; // 0–180
  elongationSigned: number; // 0–360 (searah gerak orbit)
  illumination: number; // 0–1
  waxing: boolean;
  phaseIndex: number;
  phaseName: string;
  day: number;
}

export function computePhase(
  sunPos: Vec3,
  earthPos: Vec3,
  moonPos: Vec3,
  orbitNormal: Vec3
): PhaseResult {
  const toSun = norm(sub(sunPos, earthPos));
  const toMoon = norm(sub(moonPos, earthPos));
  const cosE = clamp(dot(toSun, toMoon), -1, 1);
  const elongationUnsigned = radToDeg(Math.acos(cosE));

  const c = cross(toSun, toMoon);
  const sign = dot(c, orbitNormal) >= 0 ? 1 : -1;
  const elongationSigned = sign >= 0 ? elongationUnsigned : 360 - elongationUnsigned;

  const sunFromMoon = norm(sub(sunPos, moonPos));
  const earthFromMoon = norm(sub(earthPos, moonPos));
  const cosI = clamp(dot(sunFromMoon, earthFromMoon), -1, 1);
  const illumination = (1 + cosI) / 2;

  const waxing = elongationSigned <= 180;
  const phaseIndex = Math.round(elongationSigned / 45) % 8;
  const day = (elongationSigned / 360) * SYNODIC_MONTH;

  return {
    elongationUnsigned,
    elongationSigned,
    illumination,
    waxing,
    phaseIndex,
    phaseName: PHASES[phaseIndex].name,
    day,
  };
}

// ------------------------------------------------------------
// Menggambar cakram Bulan (tampak dari Bumi) pada canvas 2D
// ------------------------------------------------------------
export function drawPhaseDisk(
  canvas: HTMLCanvasElement,
  elongationUnsigned: number,
  waxing: boolean
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - 6;
  const E = degToRad(elongationUnsigned);
  const k = (1 - Math.cos(E)) / 2;
  const b = R * Math.abs(Math.cos(E));

  ctx.clearRect(0, 0, W, H);

  // bagian yang tidak disinari
  ctx.fillStyle = '#23233a';
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();

  // garis tepi cakram
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();

  if (k > 0.001) {
    const litRight = waxing;
    const crescent = k < 0.5;
    ctx.fillStyle = '#f2ecd8';
    ctx.beginPath();
    if (litRight) ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, false);
    else ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, true);
    const termRight = crescent ? litRight : !litRight;
    if (termRight)
      ctx.ellipse(cx, cy, Math.max(b, 0.01), R, 0, Math.PI / 2, -Math.PI / 2, true);
    else
      ctx.ellipse(cx, cy, Math.max(b, 0.01), R, 0, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
    ctx.fill();
  }
}

// ------------------------------------------------------------
// Konversi hari siklus <-> sudut orbit Bulan
// ------------------------------------------------------------
export function moonAngleFromDay(day: number): number {
  return (180 + (day / SYNODIC_MONTH) * 360) % 360;
}
export function dayFromMoonAngle(angle: number): number {
  return ((((angle - 180) % 360) + 360) % 360) / 360 * SYNODIC_MONTH;
}
export function formatDay(d: number): string {
  return d.toFixed(1).replace('.', ',');
}

// ------------------------------------------------------------
// Penyimpanan lokal (aman jika localStorage tidak tersedia)
// ------------------------------------------------------------
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* penyimpanan tidak tersedia */
    }
  },
};

// ------------------------------------------------------------
// Audio sederhana (WebAudio) dengan kontrol volume & mute
// ------------------------------------------------------------
let audioCtx: AudioContext | null = null;
let soundOn = true;
let volume = 0.5;

export function setSoundEnabled(on: boolean) {
  soundOn = on;
}
export function setVolumeLevel(v: number) {
  volume = clamp(v, 0, 1);
}
export function isSoundEnabled() {
  return soundOn;
}

function ensureCtx(): AudioContext | null {
  try {
    if (!audioCtx)
      audioCtx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

function beep(freq: number, dur: number, type: OscillatorType = 'sine', gainVal = 0.12) {
  if (!soundOn) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainVal * volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch {
    /* abaikan */
  }
}

export const sounds = {
  click: () => beep(620, 0.07, 'sine', 0.06),
  correct: () => {
    beep(523, 0.12, 'sine', 0.1);
    setTimeout(() => beep(784, 0.2, 'sine', 0.1), 110);
  },
  wrong: () => beep(170, 0.28, 'sawtooth', 0.06),
  phase: () => beep(440, 0.09, 'triangle', 0.05),
  success: () => {
    beep(523, 0.12, 'sine', 0.1);
    setTimeout(() => beep(659, 0.12, 'sine', 0.1), 120);
    setTimeout(() => beep(784, 0.22, 'sine', 0.1), 240);
  },
};

import { useEffect, useRef } from 'react';
import { drawPhaseDisk } from '../lib/core';

interface Props {
  elongationUnsigned: number; // 0–180
  waxing: boolean;
  size?: number;
  className?: string;
}

export default function MoonDisk({
  elongationUnsigned,
  waxing,
  size = 220,
  className = '',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    drawPhaseDisk(canvas, elongationUnsigned, waxing);
  }, [elongationUnsigned, waxing, size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Tampak Bulan dari Bumi"
    />
  );
}

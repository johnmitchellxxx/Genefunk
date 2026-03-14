import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { DieType } from '@/hooks/use-dice';

// ─── Die Shape SVGs ──────────────────────────────────────────────────────────

function D4Shape({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.44;
  const verts: [number, number][] = Array.from({ length: 3 }, (_, i) => {
    const a = (2 * Math.PI / 3) * i - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const outer = verts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';
  const innerR = r * 0.38;
  const innerVerts: [number, number][] = Array.from({ length: 3 }, (_, i) => {
    const a = (2 * Math.PI / 3) * i + Math.PI / 6;
    return [cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)];
  });
  const inner = innerVerts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={outer} stroke="currentColor" strokeWidth="2" />
      <path d={inner} stroke="currentColor" strokeWidth="1.5" opacity={0.6} />
      {verts.map((v, i) => (
        <line key={i} x1={cx} y1={cy} x2={v[0]} y2={v[1]} stroke="currentColor" strokeWidth="1" opacity={0.35} />
      ))}
    </svg>
  );
}

function D6Shape({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const s = size * 0.39;
  const corners: [number, number][] = [
    [cx - s, cy - s], [cx + s, cy - s],
    [cx + s, cy + s], [cx - s, cy + s],
  ];
  const outer = corners.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
  const inner: [number, number][] = [
    [cx, cy - s * 0.55], [cx + s * 0.55, cy],
    [cx, cy + s * 0.55], [cx - s * 0.55, cy],
  ];
  const innerPath = inner.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={outer} stroke="currentColor" strokeWidth="2" />
      <path d={innerPath} stroke="currentColor" strokeWidth="1.5" opacity={0.6} />
      {corners.map((c, i) => (
        <line key={i} x1={c[0]} y1={c[1]} x2={inner[i][0]} y2={inner[i][1]} stroke="currentColor" strokeWidth="1" opacity={0.35} />
      ))}
    </svg>
  );
}

function D8Shape({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.44;
  const verts: [number, number][] = [
    [cx, cy - r], [cx + r * 0.75, cy],
    [cx, cy + r], [cx - r * 0.75, cy],
  ];
  const outer = verts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
  const innerR = r * 0.42;
  const inner: [number, number][] = [
    [cx, cy - innerR], [cx + innerR * 0.75, cy],
    [cx, cy + innerR], [cx - innerR * 0.75, cy],
  ];
  const innerPath = inner.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={outer} stroke="currentColor" strokeWidth="2" />
      <path d={innerPath} stroke="currentColor" strokeWidth="1.5" opacity={0.6} />
      <line x1={verts[0][0]} y1={verts[0][1]} x2={verts[2][0]} y2={verts[2][1]} stroke="currentColor" strokeWidth="1" opacity={0.35} />
      <line x1={verts[1][0]} y1={verts[1][1]} x2={verts[3][0]} y2={verts[3][1]} stroke="currentColor" strokeWidth="1" opacity={0.35} />
    </svg>
  );
}

function D10Shape({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.44;
  // Kite: taller top, wider middle, shorter bottom
  const verts: [number, number][] = [
    [cx, cy - r * 0.9],
    [cx + r * 0.7, cy + r * 0.1],
    [cx, cy + r * 0.65],
    [cx - r * 0.7, cy + r * 0.1],
  ];
  const outer = verts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
  // Inner kite scaled
  const scale = 0.42;
  const inner: [number, number][] = verts.map(([x, y]) => [
    cx + (x - cx) * scale,
    cy + (y - cy) * scale,
  ]);
  const innerPath = inner.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={outer} stroke="currentColor" strokeWidth="2" />
      <path d={innerPath} stroke="currentColor" strokeWidth="1.5" opacity={0.6} />
      {verts.map((v, i) => (
        <line key={i} x1={v[0]} y1={v[1]} x2={inner[i][0]} y2={inner[i][1]} stroke="currentColor" strokeWidth="1" opacity={0.3} />
      ))}
    </svg>
  );
}

function D12Shape({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.44;
  const verts: [number, number][] = Array.from({ length: 5 }, (_, i) => {
    const a = (2 * Math.PI / 5) * i - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const outer = verts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';
  const innerR = r * 0.42;
  const inner: [number, number][] = Array.from({ length: 5 }, (_, i) => {
    const a = (2 * Math.PI / 5) * i - Math.PI / 2;
    return [cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)];
  });
  const innerPath = inner.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={outer} stroke="currentColor" strokeWidth="2" />
      <path d={innerPath} stroke="currentColor" strokeWidth="1.5" opacity={0.6} />
      {verts.map((v, i) => (
        <line key={i} x1={cx} y1={cy} x2={v[0]} y2={v[1]} stroke="currentColor" strokeWidth="1" opacity={0.3} />
      ))}
    </svg>
  );
}

function D20Shape({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.45;
  const outer: [number, number][] = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const outerPath = outer.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';
  const innerR = r * 0.45;
  const inner: [number, number][] = Array.from({ length: 3 }, (_, i) => {
    const a = (2 * Math.PI / 3) * i + Math.PI / 6;
    return [cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)];
  });
  const innerPath = inner.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + ' Z';
  const edgeLines = inner.map(ip => {
    const closest = outer.reduce((best, op) =>
      Math.hypot(op[0] - ip[0], op[1] - ip[1]) < Math.hypot(best[0] - ip[0], best[1] - ip[1]) ? op : best
    );
    return { x1: ip[0], y1: ip[1], x2: closest[0], y2: closest[1] };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={outerPath} stroke="currentColor" strokeWidth="2" />
      <path d={innerPath} stroke="currentColor" strokeWidth="1.5" opacity={0.6} />
      {edgeLines.map((l, i) => <line key={i} {...l} stroke="currentColor" strokeWidth="1" opacity={0.4} />)}
      {outer.map((p, i) => {
        const next = outer[(i + 1) % outer.length];
        const mx = (p[0] + next[0]) / 2, my = (p[1] + next[1]) / 2;
        const nearest = inner.reduce((best, ip) =>
          Math.hypot(ip[0] - mx, ip[1] - my) < Math.hypot(best[0] - mx, best[1] - my) ? ip : best
        );
        return <line key={`e${i}`} x1={mx} y1={my} x2={nearest[0]} y2={nearest[1]} stroke="currentColor" strokeWidth="1" opacity={0.3} />;
      })}
    </svg>
  );
}

function D100Shape({ size }: { size: number }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.44;
  const innerR = r * 0.55;
  const spokeCount = 8;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cy} r={r} stroke="currentColor" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={innerR} stroke="currentColor" strokeWidth="1.5" opacity={0.6} />
      {Array.from({ length: spokeCount }, (_, i) => {
        const a = (Math.PI / spokeCount) * i;
        return (
          <line key={i}
            x1={cx + innerR * Math.cos(a)} y1={cy + innerR * Math.sin(a)}
            x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
            stroke="currentColor" strokeWidth="1" opacity={0.35}
          />
        );
      })}
    </svg>
  );
}

function DieShape({ sides, size }: { sides: DieType; size: number }) {
  switch (sides) {
    case 4:   return <D4Shape size={size} />;
    case 6:   return <D6Shape size={size} />;
    case 8:   return <D8Shape size={size} />;
    case 10:  return <D10Shape size={size} />;
    case 12:  return <D12Shape size={size} />;
    case 20:  return <D20Shape size={size} />;
    case 100: return <D100Shape size={size} />;
  }
}

// ─── Spinning value inside the die during tumble ──────────────────────────────

function SpinningValue({ sides }: { sides: DieType }) {
  const [n, setN] = useState(1);
  useEffect(() => {
    const iv = setInterval(() => setN(Math.floor(Math.random() * sides) + 1), 55);
    return () => clearInterval(iv);
  }, [sides]);
  return <span className="font-mono font-black text-lg leading-none">{n}</span>;
}

// ─── Single animated die ──────────────────────────────────────────────────────

interface AnimatedDieProps {
  sides: DieType;
  value: number;
  phase: 'tumble' | 'result';
  index?: number;
}

export function AnimatedDie({ sides, value, phase, index = 0 }: AnimatedDieProps) {
  const isMax  = value === sides;
  const isOne  = value === 1;

  const colorClass = isMax ? 'text-secondary' : isOne ? 'text-destructive' : 'text-primary';
  const glowStyle  = isMax
    ? { filter: 'drop-shadow(0 0 18px hsl(320 100% 50% / 0.8)) drop-shadow(0 0 36px hsl(320 100% 50% / 0.4))' }
    : isOne
      ? { filter: 'drop-shadow(0 0 18px hsl(350 100% 55% / 0.8)) drop-shadow(0 0 36px hsl(350 100% 55% / 0.4))' }
      : { filter: 'drop-shadow(0 0 12px hsl(190 100% 50% / 0.65))' };

  // Vary entry direction by index so multiple dice don't all fly from the same spot
  const dirs = [
    { x: ['-45vw', '10vw', '-4vw', '2vw', '0vw'], y: ['10vh', '-8vh', '3vh', '-1vh', '0vh'] },
    { x: ['45vw', '-10vw', '4vw', '-2vw', '0vw'], y: ['-15vh', '10vh', '-4vh', '1vh', '0vh'] },
    { x: ['-30vw', '8vw', '-3vw', '1vw', '0vw'], y: ['30vh', '-12vh', '5vh', '-2vh', '0vh'] },
    { x: ['30vw', '-8vw', '3vw', '-1vw', '0vw'], y: ['20vh', '-8vh', '3vh', '-1vh', '0vh'] },
  ];
  const dir = dirs[index % dirs.length];

  return (
    <motion.div
      className={`relative ${colorClass}`}
      style={glowStyle}
      initial={{ x: dir.x[0], y: dir.y[0], rotate: 0, scale: 0.4, opacity: 0 }}
      animate={phase === 'tumble'
        ? {
            x: dir.x,
            y: dir.y,
            rotate: [0, 480, 720, 900, 1080],
            scale: [0.4, 1.2, 1, 1.05, 1],
            opacity: [0, 1, 1, 1, 1],
            transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 0.65, 0.85, 1] }
          }
        : {
            x: 0, y: 0,
            scale: [1, 1.06, 1],
            rotate: 1080,
            transition: { duration: 0.25, ease: 'easeOut' }
          }
      }
    >
      <div className="relative" style={{ width: 88, height: 88 }}>
        <DieShape sides={sides} size={88} />

        {/* Spinning number during tumble, final value on result */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ textShadow: '0 0 10px currentColor' }}>
          {phase === 'tumble'
            ? <SpinningValue sides={sides} />
            : (
              <motion.span
                className="font-mono font-black text-xl leading-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {value}
              </motion.span>
            )
          }
        </div>
      </div>

      {/* Burst on max roll */}
      {isMax && phase === 'result' && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [1, 2, 3], opacity: [0.6, 0.3, 0] }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ background: 'radial-gradient(circle, hsl(320 100% 50% / 0.4), transparent 70%)' }}
        />
      )}
    </motion.div>
  );
}

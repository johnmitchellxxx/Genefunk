import React from 'react';
import { motion } from 'framer-motion';

interface D20DieProps {
  value: number;
  isCritSuccess: boolean;
  isCritFail: boolean;
  phase: 'tumble' | 'settle' | 'result';
}

function D20Shape({ size = 80 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.45;

  const outerPoints: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    outerPoints.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  const outerPath = outerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';

  const innerR = r * 0.45;
  const innerPoints: [number, number][] = [];
  for (let i = 0; i < 3; i++) {
    const angle = (2 * Math.PI / 3) * i + Math.PI / 6;
    innerPoints.push([cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle)]);
  }
  const innerPath = innerPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + ' Z';

  const edgeLines = innerPoints.map((ip, i) => {
    const closest = outerPoints.reduce((best, op) => {
      const d1 = Math.hypot(op[0] - ip[0], op[1] - ip[1]);
      const d2 = Math.hypot(best[0] - ip[0], best[1] - ip[1]);
      return d1 < d2 ? op : best;
    });
    return { x1: ip[0], y1: ip[1], x2: closest[0], y2: closest[1] };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <path d={outerPath} stroke="currentColor" strokeWidth="2" fill="none" />
      <path d={innerPath} stroke="currentColor" strokeWidth="1.5" fill="none" opacity={0.6} />
      {edgeLines.map((line, i) => (
        <line key={i} {...line} stroke="currentColor" strokeWidth="1" opacity={0.4} />
      ))}
      {outerPoints.map((p, i) => {
        const next = outerPoints[(i + 1) % outerPoints.length];
        const midX = (p[0] + next[0]) / 2;
        const midY = (p[1] + next[1]) / 2;
        const nearest = innerPoints.reduce((best, ip) => {
          const d1 = Math.hypot(ip[0] - midX, ip[1] - midY);
          const d2 = Math.hypot(best[0] - midX, best[1] - midY);
          return d1 < d2 ? ip : best;
        });
        return (
          <line key={`e${i}`} x1={midX} y1={midY} x2={nearest[0]} y2={nearest[1]}
            stroke="currentColor" strokeWidth="1" opacity={0.3} />
        );
      })}
    </svg>
  );
}

export function D20Die({ value, isCritSuccess, isCritFail, phase }: D20DieProps) {
  const colorClass = isCritSuccess
    ? 'text-secondary'
    : isCritFail
      ? 'text-destructive'
      : 'text-primary';

  const glowStyle = isCritSuccess
    ? { filter: 'drop-shadow(0 0 20px hsl(320 100% 50% / 0.8)) drop-shadow(0 0 40px hsl(320 100% 50% / 0.4))' }
    : isCritFail
      ? { filter: 'drop-shadow(0 0 20px hsl(350 100% 55% / 0.8)) drop-shadow(0 0 40px hsl(350 100% 55% / 0.4))' }
      : { filter: 'drop-shadow(0 0 12px hsl(190 100% 50% / 0.6))' };

  const tumbleVariants = {
    tumble: {
      x: ['-50vw', '10vw', '-5vw', '3vw', '0vw'],
      y: ['20vh', '-10vh', '5vh', '-2vh', '0vh'],
      rotate: [0, 720, 1080, 1260, 1440],
      scale: [0.5, 1.2, 1, 1.05, 1],
      opacity: [0, 1, 1, 1, 1],
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        times: [0, 0.4, 0.65, 0.85, 1],
      }
    },
    settle: {
      scale: [1, 1.1, 1],
      rotate: 1440,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      }
    },
  };

  return (
    <motion.div
      className={`relative ${colorClass}`}
      style={glowStyle}
      variants={tumbleVariants}
      animate={phase === 'tumble' ? 'tumble' : 'settle'}
    >
      <div className="relative">
        <D20Shape size={90} />
        {phase === 'result' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <span className="font-mono font-bold text-2xl" style={{ textShadow: '0 0 10px currentColor' }}>
              {value}
            </span>
          </motion.div>
        )}
      </div>

      {isCritSuccess && phase === 'result' && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.8, 2.5],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsl(320 100% 50% / 0.4), transparent 70%)',
          }}
        />
      )}

      {isCritFail && phase === 'result' && (
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, hsl(350 100% 55% / 0.5), transparent 70%)',
          }}
        />
      )}
    </motion.div>
  );
}

'use client';

import { motion, type Variants } from 'framer-motion';
import type { Player } from '@/types/game.types';

interface AnimatedMarkProps {
  player: Player;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const drawVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

export function AnimatedMark({ player, size = 40, strokeWidth = 4, className }: AnimatedMarkProps) {
  const pad = strokeWidth;
  const inner = size - pad * 2;

  if (player === 'X') {
    return (
      <motion.svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
        initial="hidden"
        animate="visible"
        aria-label="X"
      >
        <motion.line
          x1={pad} y1={pad} x2={size - pad} y2={size - pad}
          stroke="var(--color-x)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          variants={drawVariants}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
        <motion.line
          x1={size - pad} y1={pad} x2={pad} y2={size - pad}
          stroke="var(--color-x)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          variants={drawVariants}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
        />
      </motion.svg>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = inner / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      initial="hidden"
      animate="visible"
      aria-label="O"
    >
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--color-o)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        variants={{
          hidden: { strokeDashoffset: circumference, opacity: 0 },
          visible: { strokeDashoffset: 0, opacity: 1 },
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.svg>
  );
}

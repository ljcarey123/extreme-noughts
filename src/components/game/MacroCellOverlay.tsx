'use client';

import { motion } from 'framer-motion';
import type { BoardOutcome } from '@/types/game.types';

interface MacroCellOverlayProps {
  outcome: Exclude<BoardOutcome, null>;
}

export function MacroCellOverlay({ outcome }: MacroCellOverlayProps) {
  const isDraw = outcome === 'draw';

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center rounded-lg z-10"
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Blurred background fill */}
      <div
        className={[
          'absolute inset-0 rounded-lg opacity-80',
          isDraw
            ? 'bg-neutral-700'
            : outcome === 'X'
              ? 'bg-[var(--color-x)]/30'
              : 'bg-[var(--color-o)]/30',
        ].join(' ')}
      />

      {/* Big mark */}
      <motion.span
        className="relative text-5xl font-black select-none"
        style={{
          color: isDraw ? '#888' : outcome === 'X' ? 'var(--color-x)' : 'var(--color-o)',
          textShadow: isDraw
            ? 'none'
            : `0 0 24px ${outcome === 'X' ? 'var(--color-x)' : 'var(--color-o)'}`,
        }}
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
      >
        {isDraw ? '=' : outcome}
      </motion.span>
    </motion.div>
  );
}

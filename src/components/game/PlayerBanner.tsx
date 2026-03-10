'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { Player, BoardOutcome } from '@/types/game.types';

interface PlayerBannerProps {
  currentPlayer: Player;
  macroOutcome: BoardOutcome;
}

export function PlayerBanner({ currentPlayer, macroOutcome }: PlayerBannerProps) {
  if (macroOutcome !== null) return null;

  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <span className="text-white/50 text-sm font-medium uppercase tracking-widest">Turn</span>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPlayer}
          className="flex items-center gap-2 px-4 py-2 rounded-full border"
          style={{
            borderColor: currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)',
            boxShadow: `0 0 16px ${currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)'}40`,
          }}
          initial={{ opacity: 0, y: -12, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <motion.span
            className="text-2xl font-black"
            style={{
              color: currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)',
              textShadow: `0 0 12px ${currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)'}`,
            }}
            initial={{ rotate: -30 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            {currentPlayer}
          </motion.span>
          <span className="text-white/70 text-sm font-medium">to play</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';

interface GameControlsProps {
  onReset: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function GameControls({ onReset, onUndo, canUndo }: GameControlsProps) {
  return (
    <motion.div
      className="flex gap-3 mt-3 justify-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <motion.button
        className={[
          'px-4 py-2 rounded-lg text-sm font-medium border transition-opacity',
          'border-white/20 text-white/60 hover:text-white hover:border-white/40',
          canUndo ? 'opacity-100 cursor-pointer' : 'opacity-30 cursor-not-allowed',
        ].join(' ')}
        onClick={onUndo}
        disabled={!canUndo}
        whileHover={canUndo ? { scale: 1.04 } : {}}
        whileTap={canUndo ? { scale: 0.96 } : {}}
        aria-label="Undo last move"
      >
        ↩ Undo
      </motion.button>

      <motion.button
        className="px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white/60 hover:text-white hover:border-white/40 cursor-pointer"
        onClick={onReset}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="New game"
      >
        ↺ New Game
      </motion.button>
    </motion.div>
  );
}

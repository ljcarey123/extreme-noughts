'use client';

import { motion } from 'framer-motion';
import { ModalOverlay } from '@/components/ui/ModalOverlay';
import type { BoardOutcome } from '@/types/game.types';

interface WinnerModalProps {
  outcome: Exclude<BoardOutcome, null>;
  onReset: () => void;
}

const confettiColors = [
  'var(--color-x)',
  'var(--color-o)',
  '#fff',
  '#fbbf24',
  '#34d399',
];

function ConfettiPiece({ i }: { i: number }) {
  const color = confettiColors[i % confettiColors.length];
  const left = `${(i * 13.7 + 5) % 90}%`;
  const delay = (i * 0.07) % 1;
  const size = 6 + (i % 5) * 2;

  return (
    <motion.div
      className="absolute top-0 rounded-sm pointer-events-none"
      style={{ left, width: size, height: size, backgroundColor: color }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: ['0%', '120vh'],
        opacity: [1, 1, 0],
        rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
      }}
      transition={{
        duration: 2.5 + (i % 5) * 0.3,
        delay,
        ease: 'linear',
      }}
    />
  );
}

export function WinnerModal({ outcome, onReset }: WinnerModalProps) {
  const isDraw = outcome === 'draw';

  return (
    <ModalOverlay>
      {/* Confetti */}
      {!isDraw && (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
          {Array.from({ length: 30 }, (_, i) => (
            <ConfettiPiece key={i} i={i} />
          ))}
        </div>
      )}

      <motion.div
        className="relative bg-neutral-900 border border-white/20 rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4"
        initial={{ y: 80, opacity: 0, scale: 0.85 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.85 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <motion.div
          className="text-8xl font-black mb-4"
          style={{
            color: isDraw ? '#888' : outcome === 'X' ? 'var(--color-x)' : 'var(--color-o)',
            textShadow: isDraw
              ? 'none'
              : `0 0 40px ${outcome === 'X' ? 'var(--color-x)' : 'var(--color-o)'}`,
          }}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.15 }}
        >
          {isDraw ? '🤝' : outcome}
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {isDraw ? "It's a Draw!" : `Player ${outcome} Wins!`}
        </motion.h2>

        <motion.p
          className="text-white/50 text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {isDraw ? 'A perfectly balanced game.' : 'Congratulations, champion!'}
        </motion.p>

        <motion.button
          className="w-full py-3 rounded-xl font-bold text-white text-sm uppercase tracking-wider"
          style={{
            background: isDraw
              ? 'linear-gradient(135deg, #444, #222)'
              : outcome === 'X'
                ? 'linear-gradient(135deg, var(--color-x), #9333ea)'
                : 'linear-gradient(135deg, var(--color-o), #0ea5e9)',
            boxShadow: isDraw
              ? 'none'
              : `0 4px 20px ${outcome === 'X' ? 'var(--color-x)' : 'var(--color-o)'}60`,
          }}
          onClick={onReset}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Play Again
        </motion.button>
      </motion.div>
    </ModalOverlay>
  );
}

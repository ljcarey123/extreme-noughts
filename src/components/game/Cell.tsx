'use client';

import { motion } from 'framer-motion';
import { AnimatedMark } from '@/components/ui/AnimatedMark';
import type { CellValue, BoardIndex } from '@/types/game.types';

interface CellProps {
  value: CellValue;
  index: BoardIndex;
  isPlayable: boolean;
  onClick: (index: BoardIndex) => void;
}

export function Cell({ value, index, isPlayable, onClick }: CellProps) {
  const isEmpty = value === null;
  const canClick = isEmpty && isPlayable;

  return (
    <motion.button
      className={[
        'relative flex items-center justify-center rounded-md',
        'aspect-square w-full',
        'border border-white/10',
        canClick
          ? 'cursor-pointer hover:bg-white/10 active:bg-white/20'
          : 'cursor-default',
        !isEmpty ? 'bg-white/5' : '',
      ].join(' ')}
      onClick={() => canClick && onClick(index)}
      disabled={!canClick}
      whileHover={canClick ? { scale: 1.05, backgroundColor: 'rgba(255,255,255,0.12)' } : {}}
      whileTap={canClick ? { scale: 0.95 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      aria-label={value ? `${value} played` : `Empty cell ${index}`}
    >
      {value && (
        <AnimatedMark
          player={value}
          size={32}
          strokeWidth={3.5}
          className="pointer-events-none"
        />
      )}
    </motion.button>
  );
}

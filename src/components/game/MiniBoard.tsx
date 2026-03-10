'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Cell } from './Cell';
import { MacroCellOverlay } from './MacroCellOverlay';
import type { BoardIndex, MiniBoardState, Player } from '@/types/game.types';

interface MiniBoardProps {
  boardIndex: BoardIndex;
  state: MiniBoardState;
  isActive: boolean;
  isFocused: boolean;
  currentPlayer: Player;
  onCellClick: (macroCellIndex: BoardIndex, miniCellIndex: BoardIndex) => void;
  onBoardClick: (boardIndex: BoardIndex) => void;
}

export const MiniBoard = memo(function MiniBoard({
  boardIndex,
  state,
  isActive,
  isFocused,
  currentPlayer,
  onCellClick,
  onBoardClick,
}: MiniBoardProps) {
  const isComplete = state.outcome !== null;
  const isPlayable = isActive && !isComplete;

  const handleBoardClick = () => {
    if (!isFocused) {
      onBoardClick(boardIndex);
    }
  };

  return (
    <motion.div
      layoutId={`mini-board-${boardIndex}`}
      className={[
        'relative rounded-lg p-1.5 cursor-pointer select-none',
        'border-2 transition-colors',
        isActive && !isComplete
          ? 'border-[var(--color-active)] shadow-[0_0_12px_var(--color-active)]'
          : 'border-white/10',
        isComplete ? 'opacity-70' : '',
        !isActive && !isComplete ? 'opacity-50' : '',
      ].join(' ')}
      onClick={handleBoardClick}
      animate={
        isActive && !isComplete
          ? { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
          : { scale: 1 }
      }
      aria-label={`Mini board ${boardIndex + 1}${isComplete ? `, won by ${state.outcome}` : isActive ? ', active' : ''}`}
    >
      {/* 3×3 grid */}
      <div className="grid grid-cols-3 gap-1">
        {state.cells.map((cellValue, cellIndex) => (
          <Cell
            key={cellIndex}
            value={cellValue}
            index={cellIndex as BoardIndex}
            isPlayable={isPlayable}
            onClick={(idx) => onCellClick(boardIndex, idx)}
          />
        ))}
      </div>

      {/* Won/drawn overlay */}
      {isComplete && <MacroCellOverlay outcome={state.outcome!} />}

      {/* Hover hint when not focused */}
      {!isFocused && !isComplete && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-white/0 pointer-events-none"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
        />
      )}

      {/* Current player colour hint in active board */}
      {isActive && !isComplete && (
        <div
          className="absolute -top-0.5 -left-0.5 w-3 h-3 rounded-full"
          style={{
            backgroundColor: currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)',
            boxShadow: `0 0 8px ${currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)'}`,
          }}
        />
      )}
    </motion.div>
  );
});

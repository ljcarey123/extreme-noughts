'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useSyncExternalStore } from 'react';
import { MiniBoard } from './MiniBoard';
import { ModalOverlay } from '@/components/ui/ModalOverlay';
import type { BoardIndex, MacroBoard as MacroBoardType, Player } from '@/types/game.types';

// SSR-safe mounted check — avoids setState-in-effect anti-pattern
function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

interface MacroBoardProps {
  macroBoard: MacroBoardType;
  activeBoard: BoardIndex | null;
  currentPlayer: Player;
  focusedBoard: BoardIndex | -1;
  onCellClick: (macroCellIndex: BoardIndex, miniCellIndex: BoardIndex) => void;
  onBoardFocus: (boardIndex: BoardIndex) => void;
  onBoardUnfocus: () => void;
}

function ZoomedBoard({
  boardIndex,
  macroBoard,
  activeBoard,
  onCellClick,
  onClose,
}: {
  boardIndex: BoardIndex;
  macroBoard: MacroBoardType;
  activeBoard: BoardIndex | null;
  onCellClick: (macroCellIndex: BoardIndex, miniCellIndex: BoardIndex) => void;
  onClose: () => void;
}) {
  const mounted = useIsMounted();
  if (!mounted) return null;

  const state = macroBoard[boardIndex];
  const isActive = activeBoard === null || activeBoard === boardIndex;

  return createPortal(
    <AnimatePresence>
      <ModalOverlay onClick={onClose}>
        <motion.div
          layoutId={`mini-board-${boardIndex}`}
          className="relative rounded-2xl p-4 bg-neutral-900 border border-white/20 shadow-2xl"
          style={{ width: 'min(80vw, 400px)', aspectRatio: '1' }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        >
          {/* Close hint */}
          <motion.p
            className="absolute -top-9 left-0 right-0 text-center text-white/50 text-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Click outside to close
          </motion.p>

          {/* Board number badge */}
          <motion.div
            className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-xs text-white/60"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            {boardIndex + 1}
          </motion.div>

          <div className="grid grid-cols-3 gap-2 h-full">
            {state.cells.map((cellValue, cellIndex) => (
              <motion.button
                key={cellIndex}
                className={[
                  'relative flex items-center justify-center rounded-xl',
                  'border border-white/10 aspect-square',
                  isActive && !state.outcome && cellValue === null
                    ? 'cursor-pointer hover:bg-white/10'
                    : 'cursor-default',
                  cellValue ? 'bg-white/5' : '',
                ].join(' ')}
                onClick={() => {
                  if (isActive && !state.outcome && cellValue === null) {
                    onCellClick(boardIndex, cellIndex as BoardIndex);
                  }
                }}
                whileHover={
                  isActive && !state.outcome && cellValue === null
                    ? { scale: 1.06, backgroundColor: 'rgba(255,255,255,0.1)' }
                    : {}
                }
                whileTap={
                  isActive && !state.outcome && cellValue === null ? { scale: 0.94 } : {}
                }
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: cellIndex * 0.03 } }}
              >
                {cellValue && (
                  <span
                    className="text-3xl font-black"
                    style={{
                      color: cellValue === 'X' ? 'var(--color-x)' : 'var(--color-o)',
                      textShadow: `0 0 16px ${cellValue === 'X' ? 'var(--color-x)' : 'var(--color-o)'}`,
                    }}
                  >
                    {cellValue}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </ModalOverlay>
    </AnimatePresence>,
    document.body,
  );
}

export function MacroBoard({
  macroBoard,
  activeBoard,
  currentPlayer,
  focusedBoard,
  onCellClick,
  onBoardFocus,
  onBoardUnfocus,
}: MacroBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[min(32rem,calc(100vh-15rem))] mx-auto" role="grid" aria-label="Extreme Noughts and Crosses">
      {macroBoard.map((miniBoard, index) => {
        const boardIndex = index as BoardIndex;
        const isFocused = focusedBoard === boardIndex;

        return (
          <MiniBoard
            key={boardIndex}
            boardIndex={boardIndex}
            state={miniBoard}
            isActive={activeBoard === null || activeBoard === boardIndex}
            isFocused={isFocused}
            currentPlayer={currentPlayer}
            onCellClick={onCellClick}
            onBoardClick={onBoardFocus}
          />
        );
      })}

      {/* Zoomed board portal */}
      {focusedBoard !== -1 && (
        <ZoomedBoard
          boardIndex={focusedBoard}
          macroBoard={macroBoard}
          activeBoard={activeBoard}
          onCellClick={onCellClick}
          onClose={onBoardUnfocus}
        />
      )}
    </div>
  );
}

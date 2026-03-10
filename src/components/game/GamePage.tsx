'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MacroBoard } from './MacroBoard';
import { PlayerBanner } from './PlayerBanner';
import { WinnerModal } from './WinnerModal';
import { GameControls } from './GameControls';
import { useGameState, useAnimationState } from '@/hooks/game.hooks';
import type { BoardIndex } from '@/types/game.types';

export function GamePage() {
  const { state, playCell, resetGame, undoMove, canUndo } = useGameState();
  const { animState, focusBoard, unfocusBoard } = useAnimationState();

  const handleCellClick = (macroCellIndex: BoardIndex, miniCellIndex: BoardIndex) => {
    playCell(macroCellIndex, miniCellIndex);
    // Auto-close zoom after playing
    unfocusBoard();
  };

  const handleBoardFocus = (boardIndex: BoardIndex) => {
    if (animState.focusedBoard === boardIndex) {
      unfocusBoard();
    } else {
      focusBoard(boardIndex);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-neutral-950">
      {/* Title */}
      <motion.h1
        className="text-3xl font-black tracking-tight text-white mb-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span style={{ color: 'var(--color-x)' }}>Extreme</span>{' '}
        <span className="text-white">Noughts</span>{' '}
        <span className="text-white/40">&</span>{' '}
        <span style={{ color: 'var(--color-o)' }}>Crosses</span>
      </motion.h1>

      <motion.p
        className="text-white/30 text-xs uppercase tracking-widest mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Ultimate Tic-Tac-Toe
      </motion.p>

      {/* Current player indicator */}
      <PlayerBanner
        currentPlayer={state.currentPlayer}
        macroOutcome={state.macroOutcome}
      />

      {/* Active board hint */}
      <AnimatePresence>
        {state.activeBoard !== null && state.macroOutcome === null && (
          <motion.p
            key={state.activeBoard}
            className="text-white/40 text-xs mb-4 text-center"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
          >
            Play in board {state.activeBoard + 1} — or click any board to zoom in
          </motion.p>
        )}
        {state.activeBoard === null && state.macroOutcome === null && (
          <motion.p
            className="text-white/40 text-xs mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Free choice — click any open board
          </motion.p>
        )}
      </AnimatePresence>

      {/* Main board */}
      <MacroBoard
        macroBoard={state.macroBoard}
        activeBoard={state.activeBoard}
        currentPlayer={state.currentPlayer}
        focusedBoard={animState.focusedBoard}
        onCellClick={handleCellClick}
        onBoardFocus={handleBoardFocus}
        onBoardUnfocus={unfocusBoard}
      />

      {/* Controls */}
      <GameControls onReset={resetGame} onUndo={undoMove} canUndo={canUndo} />

      {/* Winner modal */}
      <AnimatePresence>
        {state.macroOutcome !== null && (
          <WinnerModal outcome={state.macroOutcome} onReset={resetGame} />
        )}
      </AnimatePresence>
    </div>
  );
}

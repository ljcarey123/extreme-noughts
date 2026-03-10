'use client';

import { useSyncExternalStore, useCallback, useState } from 'react';
import { GameEngine } from '@/lib/GameEngine';
import type { BoardIndex, AnimationState, GameState } from '@/types/game.types';

// ─── Game State Hook ──────────────────────────────────────────────────────────

export interface UseGameStateReturn {
  state: GameState;
  playCell: (macroCellIndex: BoardIndex, miniCellIndex: BoardIndex) => void;
  resetGame: () => void;
  undoMove: () => void;
  canUndo: boolean;
}

export function useGameState(): UseGameStateReturn {
  const engine = GameEngine.getInstance();

  const state = useSyncExternalStore(
    (listener) => engine.subscribe(listener),
    () => engine.getState(),
    () => engine.getState(),
  );

  const playCell = useCallback(
    (macroCellIndex: BoardIndex, miniCellIndex: BoardIndex) => {
      engine.playCell(macroCellIndex, miniCellIndex);
    },
    [engine],
  );

  const resetGame = useCallback(() => {
    engine.resetGame();
  }, [engine]);

  const undoMove = useCallback(() => {
    engine.undoMove();
  }, [engine]);

  return {
    state,
    playCell,
    resetGame,
    undoMove,
    canUndo: engine.canUndo(),
  };
}

// ─── Animation State Hook ─────────────────────────────────────────────────────

export interface UseAnimationStateReturn {
  animState: AnimationState;
  focusBoard: (index: BoardIndex) => void;
  unfocusBoard: () => void;
}

export function useAnimationState(): UseAnimationStateReturn {
  const [animState, setAnimState] = useState<AnimationState>({
    focusedBoard: -1,
    isAnimating: false,
  });

  const focusBoard = useCallback((index: BoardIndex) => {
    setAnimState({ focusedBoard: index, isAnimating: true });
    // Clear animating flag after transition completes
    setTimeout(() => setAnimState((prev) => ({ ...prev, isAnimating: false })), 400);
  }, []);

  const unfocusBoard = useCallback(() => {
    setAnimState({ focusedBoard: -1, isAnimating: true });
    setTimeout(() => setAnimState((prev) => ({ ...prev, isAnimating: false })), 400);
  }, []);

  return { animState, focusBoard, unfocusBoard };
}

import type { GameState, BoardIndex, Player, Move } from '@/types/game.types';
import { INITIAL_MACRO_BOARD } from './constants';
import {
  isMoveLegal,
  applyMoveToBoard,
  computeMacroOutcome,
  deriveNextActiveBoard,
} from './game.utils';

function createInitialState(): GameState {
  return {
    macroBoard: INITIAL_MACRO_BOARD.map((mini) => ({
      cells: [...mini.cells],
      outcome: null,
    })) as GameState['macroBoard'],
    currentPlayer: 'X',
    activeBoard: null,
    macroOutcome: null,
    moveHistory: [],
  };
}

/**
 * GameEngine — singleton that owns all game state and business logic.
 * React components subscribe via useSyncExternalStore.
 */
export class GameEngine {
  private static _instance: GameEngine | null = null;

  private _state: GameState = createInitialState();
  private _listeners = new Set<() => void>();

  private constructor() {}

  static getInstance(): GameEngine {
    if (!GameEngine._instance) {
      GameEngine._instance = new GameEngine();
    }
    return GameEngine._instance;
  }

  /** For testing only — resets the singleton */
  static resetInstance(): void {
    GameEngine._instance = null;
  }

  // ─── State Access ─────────────────────────────────────────────────────────

  getState(): GameState {
    return this._state;
  }

  // ─── Subscription (useSyncExternalStore) ──────────────────────────────────

  subscribe(listener: () => void): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  private _notify(): void {
    this._listeners.forEach((fn) => fn());
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  playCell(macroCellIndex: BoardIndex, miniCellIndex: BoardIndex): void {
    const { macroBoard, currentPlayer, activeBoard, macroOutcome, moveHistory } = this._state;

    // Ignore if game is already over
    if (macroOutcome !== null) return;

    if (!isMoveLegal(macroCellIndex, miniCellIndex, macroBoard, activeBoard)) return;

    const nextMacroBoard = applyMoveToBoard(macroBoard, macroCellIndex, miniCellIndex, currentPlayer);
    const nextMacroOutcome = computeMacroOutcome(nextMacroBoard);
    const nextActiveBoard = nextMacroOutcome !== null
      ? null
      : deriveNextActiveBoard(miniCellIndex, nextMacroBoard);
    const nextPlayer: Player = currentPlayer === 'X' ? 'O' : 'X';

    const move: Move = {
      player: currentPlayer,
      macroCellIndex,
      miniCellIndex,
      timestamp: Date.now(),
    };

    this._state = {
      macroBoard: nextMacroBoard,
      currentPlayer: nextPlayer,
      activeBoard: nextActiveBoard,
      macroOutcome: nextMacroOutcome,
      moveHistory: [...moveHistory, move],
    };

    this._notify();
  }

  undoMove(): void {
    const { moveHistory } = this._state;
    if (moveHistory.length === 0) return;

    // Replay from scratch up to moveHistory.length - 1
    const previousMoves = moveHistory.slice(0, -1);
    let state = createInitialState();

    for (const move of previousMoves) {
      const nextMacroBoard = applyMoveToBoard(
        state.macroBoard,
        move.macroCellIndex,
        move.miniCellIndex,
        move.player,
      );
      const nextMacroOutcome = computeMacroOutcome(nextMacroBoard);
      const nextActiveBoard = nextMacroOutcome !== null
        ? null
        : deriveNextActiveBoard(move.miniCellIndex, nextMacroBoard);
      const nextPlayer: Player = move.player === 'X' ? 'O' : 'X';

      state = {
        macroBoard: nextMacroBoard,
        currentPlayer: nextPlayer,
        activeBoard: nextActiveBoard,
        macroOutcome: nextMacroOutcome,
        moveHistory: [...state.moveHistory, move],
      };
    }

    this._state = state;
    this._notify();
  }

  resetGame(): void {
    this._state = createInitialState();
    this._notify();
  }

  // ─── Queries ──────────────────────────────────────────────────────────────

  canUndo(): boolean {
    return this._state.moveHistory.length > 0;
  }
}

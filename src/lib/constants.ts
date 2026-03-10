import type { BoardIndex, MiniCells, MiniBoardState, MacroBoard } from '@/types/game.types';

export const BOARD_SIZE = 3;
export const CELL_COUNT = 9;

export const WIN_LINES: readonly [BoardIndex, BoardIndex, BoardIndex][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const EMPTY_CELLS: MiniCells = [
  null, null, null,
  null, null, null,
  null, null, null,
];

export const EMPTY_MINI_BOARD: MiniBoardState = {
  cells: [...EMPTY_CELLS] as MiniCells,
  outcome: null,
};

export const INITIAL_MACRO_BOARD: MacroBoard = Array.from({ length: 9 }, () => ({
  cells: [...EMPTY_CELLS] as MiniCells,
  outcome: null,
})) as MacroBoard;

export const PLAYER_COLORS = {
  X: 'var(--color-x)',
  O: 'var(--color-o)',
} as const;

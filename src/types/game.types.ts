export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type BoardOutcome = Player | 'draw' | null;

/** 0–8 index into a 3×3 grid */
export type BoardIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type MiniCells = [
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
  CellValue, CellValue, CellValue,
];

export interface MiniBoardState {
  cells: MiniCells;
  outcome: BoardOutcome;
}

export type MacroBoard = [
  MiniBoardState, MiniBoardState, MiniBoardState,
  MiniBoardState, MiniBoardState, MiniBoardState,
  MiniBoardState, MiniBoardState, MiniBoardState,
];

export interface Move {
  player: Player;
  macroCellIndex: BoardIndex;
  miniCellIndex: BoardIndex;
  timestamp: number;
}

export interface GameState {
  macroBoard: MacroBoard;
  currentPlayer: Player;
  /** Which mini board the next move must be in. null = free choice */
  activeBoard: BoardIndex | null;
  macroOutcome: BoardOutcome;
  moveHistory: Move[];
}

export interface WinLine {
  line: [BoardIndex, BoardIndex, BoardIndex];
  winner: Player;
}

export interface AnimationState {
  focusedBoard: BoardIndex | -1;
  isAnimating: boolean;
}

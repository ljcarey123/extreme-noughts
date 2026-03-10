import type {
  CellValue,
  Player,
  BoardOutcome,
  BoardIndex,
  MiniCells,
  MacroBoard,
  WinLine,
} from '@/types/game.types';
import { WIN_LINES } from './constants';

export function checkWinner(cells: CellValue[]): Player | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a] as Player;
    }
  }
  return null;
}

export function checkDraw(cells: CellValue[]): boolean {
  return cells.every((cell) => cell !== null) && checkWinner(cells) === null;
}

export function computeBoardOutcome(cells: CellValue[]): BoardOutcome {
  return checkWinner(cells) ?? (checkDraw(cells) ? 'draw' : null);
}

export function findWinLine(cells: CellValue[]): WinLine | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return { line: line as [BoardIndex, BoardIndex, BoardIndex], winner: cells[a] as Player };
    }
  }
  return null;
}

export function deriveNextActiveBoard(
  miniCellIndex: BoardIndex,
  macroBoard: MacroBoard,
): BoardIndex | null {
  const targetBoard = macroBoard[miniCellIndex];
  if (targetBoard.outcome !== null) {
    // Target board is already complete — free choice among open boards
    return null;
  }
  return miniCellIndex;
}

export function isMoveLegal(
  macroCellIndex: BoardIndex,
  miniCellIndex: BoardIndex,
  macroBoard: MacroBoard,
  activeBoard: BoardIndex | null,
): boolean {
  // Must play in the active board (or any board if activeBoard is null)
  if (activeBoard !== null && macroCellIndex !== activeBoard) return false;

  const miniBoard = macroBoard[macroCellIndex];

  // Mini board must not be complete
  if (miniBoard.outcome !== null) return false;

  // Cell must be empty
  if (miniBoard.cells[miniCellIndex] !== null) return false;

  return true;
}

export function cloneMacroBoard(macroBoard: MacroBoard): MacroBoard {
  return macroBoard.map((mini) => ({
    outcome: mini.outcome,
    cells: [...mini.cells] as MiniCells,
  })) as MacroBoard;
}

export function applyMoveToBoard(
  macroBoard: MacroBoard,
  macroCellIndex: BoardIndex,
  miniCellIndex: BoardIndex,
  player: Player,
): MacroBoard {
  const next = cloneMacroBoard(macroBoard);
  next[macroCellIndex].cells[miniCellIndex] = player;
  next[macroCellIndex].outcome = computeBoardOutcome(next[macroCellIndex].cells);
  return next;
}

/** Derive macro outcome from mini board outcomes */
export function computeMacroOutcome(macroBoard: MacroBoard): BoardOutcome {
  const outcomes: CellValue[] = macroBoard.map((mini) =>
    mini.outcome === 'draw' ? null : mini.outcome,
  );
  return checkWinner(outcomes) ?? (macroBoard.every((mini) => mini.outcome !== null) ? 'draw' : null);
}

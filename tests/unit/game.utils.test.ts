import { describe, it, expect } from 'vitest';
import {
  checkWinner,
  checkDraw,
  computeBoardOutcome,
  findWinLine,
  deriveNextActiveBoard,
  isMoveLegal,
  applyMoveToBoard,
  computeMacroOutcome,
} from '@/lib/game.utils';
import { INITIAL_MACRO_BOARD } from '@/lib/constants';
import type { CellValue, MacroBoard, MiniCells } from '@/types/game.types';

// ─── Helpers ───────────────────────────────────────────────────────────────

function makeCells(values: (CellValue)[]): CellValue[] {
  return values;
}

function emptyMacroBoard(): MacroBoard {
  return INITIAL_MACRO_BOARD.map((mini) => ({
    cells: [...mini.cells] as MiniCells,
    outcome: null,
  })) as MacroBoard;
}

// ─── checkWinner ───────────────────────────────────────────────────────────

describe('checkWinner', () => {
  it('detects row win for X', () => {
    const cells = makeCells(['X', 'X', 'X', null, null, null, null, null, null]);
    expect(checkWinner(cells)).toBe('X');
  });

  it('detects row win for O', () => {
    const cells = makeCells([null, null, null, 'O', 'O', 'O', null, null, null]);
    expect(checkWinner(cells)).toBe('O');
  });

  it('detects column win', () => {
    const cells = makeCells(['X', null, null, 'X', null, null, 'X', null, null]);
    expect(checkWinner(cells)).toBe('X');
  });

  it('detects diagonal win top-left to bottom-right', () => {
    const cells = makeCells(['O', null, null, null, 'O', null, null, null, 'O']);
    expect(checkWinner(cells)).toBe('O');
  });

  it('detects diagonal win top-right to bottom-left', () => {
    const cells = makeCells([null, null, 'X', null, 'X', null, 'X', null, null]);
    expect(checkWinner(cells)).toBe('X');
  });

  it('returns null for empty board', () => {
    const cells = makeCells([null, null, null, null, null, null, null, null, null]);
    expect(checkWinner(cells)).toBeNull();
  });

  it('returns null for partial board with no winner', () => {
    const cells = makeCells(['X', 'O', 'X', null, null, null, null, null, null]);
    expect(checkWinner(cells)).toBeNull();
  });

  it('detects last row win', () => {
    const cells = makeCells([null, null, null, null, null, null, 'X', 'X', 'X']);
    expect(checkWinner(cells)).toBe('X');
  });
});

// ─── checkDraw ─────────────────────────────────────────────────────────────

describe('checkDraw', () => {
  it('returns true for a full board with no winner', () => {
    // X O X / O X O / O X O  — no winner, all filled
    const cells = makeCells(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']);
    expect(checkDraw(cells)).toBe(true);
  });

  it('returns false when board has a winner', () => {
    const cells = makeCells(['X', 'X', 'X', 'O', 'O', null, null, null, null]);
    expect(checkDraw(cells)).toBe(false);
  });

  it('returns false when board is not full', () => {
    const cells = makeCells(['X', 'O', null, null, null, null, null, null, null]);
    expect(checkDraw(cells)).toBe(false);
  });
});

// ─── computeBoardOutcome ───────────────────────────────────────────────────

describe('computeBoardOutcome', () => {
  it('returns winner when there is one', () => {
    const cells = makeCells(['X', 'X', 'X', null, null, null, null, null, null]);
    expect(computeBoardOutcome(cells)).toBe('X');
  });

  it('returns draw when board is full with no winner', () => {
    const cells = makeCells(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O']);
    expect(computeBoardOutcome(cells)).toBe('draw');
  });

  it('returns null when game is still in progress', () => {
    const cells = makeCells(['X', null, null, null, null, null, null, null, null]);
    expect(computeBoardOutcome(cells)).toBeNull();
  });
});

// ─── findWinLine ───────────────────────────────────────────────────────────

describe('findWinLine', () => {
  it('returns the winning line and player', () => {
    const cells = makeCells(['X', 'X', 'X', null, null, null, null, null, null]);
    const result = findWinLine(cells);
    expect(result).toEqual({ line: [0, 1, 2], winner: 'X' });
  });

  it('returns null when no winner', () => {
    const cells = makeCells([null, null, null, null, null, null, null, null, null]);
    expect(findWinLine(cells)).toBeNull();
  });
});

// ─── deriveNextActiveBoard ─────────────────────────────────────────────────

describe('deriveNextActiveBoard', () => {
  it('returns miniCellIndex when that board is still open', () => {
    const macroBoard = emptyMacroBoard();
    expect(deriveNextActiveBoard(4, macroBoard)).toBe(4);
  });

  it('returns null when target board is already won', () => {
    const macroBoard = emptyMacroBoard();
    macroBoard[4].outcome = 'X';
    expect(deriveNextActiveBoard(4, macroBoard)).toBeNull();
  });

  it('returns null when target board is drawn', () => {
    const macroBoard = emptyMacroBoard();
    macroBoard[3].outcome = 'draw';
    expect(deriveNextActiveBoard(3, macroBoard)).toBeNull();
  });
});

// ─── isMoveLegal ───────────────────────────────────────────────────────────

describe('isMoveLegal', () => {
  it('allows a move in an open cell on the active board', () => {
    const macroBoard = emptyMacroBoard();
    expect(isMoveLegal(0, 0, macroBoard, 0)).toBe(true);
  });

  it('allows a move on any board when activeBoard is null', () => {
    const macroBoard = emptyMacroBoard();
    expect(isMoveLegal(5, 3, macroBoard, null)).toBe(true);
  });

  it('rejects move on wrong board when activeBoard is set', () => {
    const macroBoard = emptyMacroBoard();
    expect(isMoveLegal(2, 0, macroBoard, 1)).toBe(false);
  });

  it('rejects move on already-won mini board', () => {
    const macroBoard = emptyMacroBoard();
    macroBoard[0].outcome = 'X';
    expect(isMoveLegal(0, 0, macroBoard, null)).toBe(false);
  });

  it('rejects move on an occupied cell', () => {
    const macroBoard = emptyMacroBoard();
    macroBoard[0].cells[4] = 'O';
    expect(isMoveLegal(0, 4, macroBoard, null)).toBe(false);
  });
});

// ─── applyMoveToBoard ──────────────────────────────────────────────────────

describe('applyMoveToBoard', () => {
  it('places the player mark in the correct cell', () => {
    const macroBoard = emptyMacroBoard();
    const next = applyMoveToBoard(macroBoard, 0, 4, 'X');
    expect(next[0].cells[4]).toBe('X');
  });

  it('does not mutate the original board', () => {
    const macroBoard = emptyMacroBoard();
    applyMoveToBoard(macroBoard, 0, 4, 'X');
    expect(macroBoard[0].cells[4]).toBeNull();
  });

  it('sets mini board outcome when a win is achieved', () => {
    const macroBoard = emptyMacroBoard();
    macroBoard[0].cells[0] = 'X';
    macroBoard[0].cells[1] = 'X';
    const next = applyMoveToBoard(macroBoard, 0, 2, 'X');
    expect(next[0].outcome).toBe('X');
  });

  it('leaves outcome null when no win yet', () => {
    const macroBoard = emptyMacroBoard();
    const next = applyMoveToBoard(macroBoard, 0, 0, 'X');
    expect(next[0].outcome).toBeNull();
  });
});

// ─── computeMacroOutcome ───────────────────────────────────────────────────

describe('computeMacroOutcome', () => {
  it('returns null when no mini boards are won', () => {
    expect(computeMacroOutcome(emptyMacroBoard())).toBeNull();
  });

  it('returns the winner when three mini boards in a row are won', () => {
    const macroBoard = emptyMacroBoard();
    // Win top row of macro board (boards 0,1,2) for X
    macroBoard[0].outcome = 'X';
    macroBoard[1].outcome = 'X';
    macroBoard[2].outcome = 'X';
    expect(computeMacroOutcome(macroBoard)).toBe('X');
  });

  it('returns draw when all boards are complete with no macro winner', () => {
    const macroBoard = emptyMacroBoard();
    // Alternating outcomes that produce no three-in-a-row
    const outcomes: Array<'X' | 'O' | 'draw'> = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    outcomes.forEach((o, i) => { macroBoard[i].outcome = o; });
    expect(computeMacroOutcome(macroBoard)).toBe('draw');
  });
});

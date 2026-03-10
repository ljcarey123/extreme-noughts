import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '@/lib/GameEngine';

beforeEach(() => {
  GameEngine.resetInstance();
});

describe('GameEngine singleton', () => {
  it('returns the same instance on repeated calls', () => {
    const a = GameEngine.getInstance();
    const b = GameEngine.getInstance();
    expect(a).toBe(b);
  });

  it('starts with a clean initial state', () => {
    const state = GameEngine.getInstance().getState();
    expect(state.currentPlayer).toBe('X');
    expect(state.activeBoard).toBeNull();
    expect(state.macroOutcome).toBeNull();
    expect(state.moveHistory).toHaveLength(0);
    state.macroBoard.forEach((mini) => {
      expect(mini.outcome).toBeNull();
      mini.cells.forEach((cell) => expect(cell).toBeNull());
    });
  });
});

describe('GameEngine.playCell', () => {
  it('places X on the first move', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 4);
    expect(engine.getState().macroBoard[0].cells[4]).toBe('X');
  });

  it('switches player after a move', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 4);
    expect(engine.getState().currentPlayer).toBe('O');
  });

  it('sets activeBoard based on mini cell index', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 3);
    expect(engine.getState().activeBoard).toBe(3);
  });

  it('sets activeBoard to null when target board is already complete', () => {
    const engine = GameEngine.getInstance();
    // Force board 4 to be won
    const state = engine.getState();
    state.macroBoard[4].outcome = 'O'; // mutate for test setup

    // Play in board 0, cell 4 → next board would be 4 (already won) → free
    engine.playCell(0, 4);
    expect(engine.getState().activeBoard).toBeNull();
  });

  it('ignores illegal moves (wrong active board)', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 3); // sets activeBoard to 3
    const stateBefore = engine.getState();
    engine.playCell(5, 0); // wrong board — should be ignored
    expect(engine.getState()).toBe(stateBefore);
  });

  it('ignores moves on occupied cells', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 4); // X plays
    engine.playCell(4, 4); // O plays (activeBoard is 4)
    const stateBefore = engine.getState();
    engine.playCell(4, 4); // try to overwrite — illegal
    expect(engine.getState()).toBe(stateBefore);
  });

  it('records moves in history', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 4);
    engine.playCell(4, 2);
    expect(engine.getState().moveHistory).toHaveLength(2);
    expect(engine.getState().moveHistory[0]).toMatchObject({
      player: 'X',
      macroCellIndex: 0,
      miniCellIndex: 4,
    });
  });

  it('notifies subscribers on state change', () => {
    const engine = GameEngine.getInstance();
    let callCount = 0;
    const unsub = engine.subscribe(() => callCount++);
    engine.playCell(0, 0);
    expect(callCount).toBe(1);
    unsub();
  });

  it('stops notifying after unsubscribe', () => {
    const engine = GameEngine.getInstance();
    let callCount = 0;
    const unsub = engine.subscribe(() => callCount++);
    unsub();
    engine.playCell(0, 0);
    expect(callCount).toBe(0);
  });
});

describe('GameEngine.resetGame', () => {
  it('resets state to initial', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 4);
    engine.playCell(4, 2);
    engine.resetGame();
    const state = engine.getState();
    expect(state.currentPlayer).toBe('X');
    expect(state.moveHistory).toHaveLength(0);
    expect(state.activeBoard).toBeNull();
  });
});

describe('GameEngine.undoMove', () => {
  it('does nothing when history is empty', () => {
    const engine = GameEngine.getInstance();
    const before = engine.getState();
    engine.undoMove();
    expect(engine.getState().moveHistory).toHaveLength(0);
    expect(engine.getState().currentPlayer).toBe(before.currentPlayer);
  });

  it('reverses the last move', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 4); // X plays
    engine.undoMove();
    expect(engine.getState().macroBoard[0].cells[4]).toBeNull();
    expect(engine.getState().currentPlayer).toBe('X');
    expect(engine.getState().moveHistory).toHaveLength(0);
  });

  it('restores activeBoard to correct value after undo', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 3); // X plays, activeBoard → 3
    engine.playCell(3, 7); // O plays, activeBoard → 7
    engine.undoMove();
    // After undo, should be back to X's turn with activeBoard → 3
    expect(engine.getState().activeBoard).toBe(3);
    expect(engine.getState().currentPlayer).toBe('O');
  });

  it('canUndo returns false when no history', () => {
    expect(GameEngine.getInstance().canUndo()).toBe(false);
  });

  it('canUndo returns true after a move', () => {
    const engine = GameEngine.getInstance();
    engine.playCell(0, 0);
    expect(engine.canUndo()).toBe(true);
  });
});

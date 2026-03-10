import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MiniBoard } from '@/components/game/MiniBoard';
import type { MiniBoardState, BoardIndex } from '@/types/game.types';
import { EMPTY_CELLS } from '@/lib/constants';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick, ...rest }: React.ComponentProps<'div'>) => (
      <div className={className} onClick={onClick} {...rest}>{children}</div>
    ),
    button: ({ children, onClick, disabled, ...rest }: React.ComponentProps<'button'>) => (
      <button onClick={onClick} disabled={disabled} {...rest}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/ui/AnimatedMark', () => ({
  AnimatedMark: ({ player }: { player: string }) => <span data-testid="mark">{player}</span>,
}));

vi.mock('@/components/game/MacroCellOverlay', () => ({
  MacroCellOverlay: ({ outcome }: { outcome: string }) => (
    <div data-testid="overlay">{outcome}</div>
  ),
}));

const emptyState: MiniBoardState = {
  cells: [...EMPTY_CELLS],
  outcome: null,
};

const props = {
  boardIndex: 0 as BoardIndex,
  currentPlayer: 'X' as const,
  onCellClick: vi.fn(),
  onBoardClick: vi.fn(),
};

describe('MiniBoard', () => {
  it('renders 9 cells', () => {
    render(<MiniBoard {...props} state={emptyState} isActive isFocused={false} />);
    expect(screen.getAllByRole('button')).toHaveLength(9);
  });

  it('does not render overlay when outcome is null', () => {
    render(<MiniBoard {...props} state={emptyState} isActive isFocused={false} />);
    expect(screen.queryByTestId('overlay')).toBeNull();
  });

  it('renders overlay when board is won', () => {
    const wonState: MiniBoardState = { cells: [...EMPTY_CELLS], outcome: 'X' };
    render(<MiniBoard {...props} state={wonState} isActive={false} isFocused={false} />);
    expect(screen.getByTestId('overlay')).toBeTruthy();
    expect(screen.getByTestId('overlay').textContent).toBe('X');
  });

  it('renders overlay for a draw', () => {
    const drawState: MiniBoardState = { cells: [...EMPTY_CELLS], outcome: 'draw' };
    render(<MiniBoard {...props} state={drawState} isActive={false} isFocused={false} />);
    expect(screen.getByTestId('overlay').textContent).toBe('draw');
  });

  it('calls onBoardClick when board is clicked while not focused', () => {
    const onBoardClick = vi.fn();
    render(
      <MiniBoard
        {...props}
        onBoardClick={onBoardClick}
        state={emptyState}
        isActive
        isFocused={false}
      />,
    );
    // Click the board wrapper (first div with aria-label)
    screen.getByLabelText(/Mini board 1/i).click();
    expect(onBoardClick).toHaveBeenCalledWith(0);
  });
});

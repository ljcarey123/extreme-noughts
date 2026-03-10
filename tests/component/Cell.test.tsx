import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Cell } from '@/components/game/Cell';
import type { BoardIndex } from '@/types/game.types';

// Framer Motion makes no sense in jsdom — mock it
vi.mock('framer-motion', () => ({
  motion: {
    button: ({ children, onClick, disabled, ...rest }: React.ComponentProps<'button'>) => (
      <button onClick={onClick} disabled={disabled} {...rest}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// AnimatedMark also uses framer-motion — keep it simple
vi.mock('@/components/ui/AnimatedMark', () => ({
  AnimatedMark: ({ player }: { player: string }) => <span data-testid="mark">{player}</span>,
}));

describe('Cell', () => {
  const noop = vi.fn();

  it('renders an empty cell with no mark', () => {
    render(<Cell value={null} index={0 as BoardIndex} isPlayable onClick={noop} />);
    expect(screen.queryByTestId('mark')).toBeNull();
  });

  it('renders an X mark when value is X', () => {
    render(<Cell value="X" index={0 as BoardIndex} isPlayable={false} onClick={noop} />);
    expect(screen.getByTestId('mark').textContent).toBe('X');
  });

  it('renders an O mark when value is O', () => {
    render(<Cell value="O" index={0 as BoardIndex} isPlayable={false} onClick={noop} />);
    expect(screen.getByTestId('mark').textContent).toBe('O');
  });

  it('calls onClick with the correct index when clicked and playable', () => {
    const handleClick = vi.fn();
    render(<Cell value={null} index={5 as BoardIndex} isPlayable onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledWith(5);
  });

  it('does not call onClick when cell is not playable', () => {
    const handleClick = vi.fn();
    render(<Cell value={null} index={0 as BoardIndex} isPlayable={false} onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when cell is already filled', () => {
    const handleClick = vi.fn();
    render(<Cell value="X" index={0 as BoardIndex} isPlayable onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

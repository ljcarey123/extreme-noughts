import { test, expect } from '@playwright/test';

test.describe('Game flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the game board with 9 mini boards', async ({ page }) => {
    const board = page.getByRole('grid', { name: /Extreme Noughts and Crosses/i });
    await expect(board).toBeVisible();

    // 9 mini board regions
    const miniBoards = board.locator('[aria-label^="Mini board"]');
    await expect(miniBoards).toHaveCount(9);
  });

  test('shows X to play on start', async ({ page }) => {
    await expect(page.getByText(/X/i).first()).toBeVisible();
    await expect(page.getByText(/to play/i)).toBeVisible();
  });

  test('player can click a mini board to zoom it', async ({ page }) => {
    await page.getByRole('grid').locator('[aria-label^="Mini board 1"]').click();
    // Zoomed board appears — it renders cells as buttons in a portal
    const closeHint = page.getByText(/Click outside to close/i);
    await expect(closeHint).toBeVisible();
  });

  test('clicking outside closes the zoomed board', async ({ page }) => {
    await page.getByRole('grid').locator('[aria-label^="Mini board 1"]').click();
    await expect(page.getByText(/Click outside to close/i)).toBeVisible();

    // Click the backdrop (outside the modal content)
    await page.mouse.click(10, 10);
    await expect(page.getByText(/Click outside to close/i)).not.toBeVisible();
  });

  test('a move switches the active player', async ({ page }) => {
    // Click a cell directly (board 5, cell index visible as button)
    const board1 = page.getByRole('grid').locator('[aria-label^="Mini board 1"]');
    await board1.click(); // zoom in

    // Click first empty cell in the zoomed overlay
    const firstCell = page.locator('[aria-label^="Mini board"]').last().locator('button').first();
    await firstCell.click();

    // Should now show O's turn
    await expect(page.getByText(/O/i).first()).toBeVisible();
  });

  test('new game button resets the board', async ({ page }) => {
    // Make a move via zoom
    const board1 = page.getByRole('grid').locator('[aria-label^="Mini board 1"]');
    await board1.click();
    const firstCell = page.locator('button', { hasText: '' }).nth(0);
    await firstCell.click();

    await page.getByRole('button', { name: /New Game/i }).click();

    // Should be back to X's turn
    await expect(page.getByText(/to play/i)).toBeVisible();
  });

  test('undo button is disabled at game start', async ({ page }) => {
    const undoBtn = page.getByRole('button', { name: /Undo/i });
    await expect(undoBtn).toBeDisabled();
  });
});

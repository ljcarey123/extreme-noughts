# Extreme Noughts & Crosses

Ultimate Tic-Tac-Toe for two players on the same device. A 3×3 grid of mini tic-tac-toe boards — win three mini boards in a row to win the game.

## Rules

- The board is a 3×3 grid of 9 mini tic-tac-toe boards (81 cells total)
- Your move sends your opponent to the mini board matching the cell you played in
- If that board is already won or drawn, your opponent can play anywhere
- Win three mini boards in a row (horizontally, vertically, or diagonally) to win

## Development

```bash
npm run dev        # start dev server at localhost:3000
npm run build      # typecheck + lint + production build
npm test           # unit and component tests (vitest)
npm run test:e2e   # end-to-end tests (playwright)
```

## Stack

- Next.js 15 · TypeScript · Tailwind CSS · Framer Motion
- Vitest + React Testing Library · Playwright

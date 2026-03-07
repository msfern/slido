---
name: Senior FE Review Plan
overview: Comprehensive code review of the slido puzzle app identifying issues that would hurt a Senior Frontend Engineer take-home assessment, prioritized by severity.
todos:
  - id: fix-lint
    content: "Fix all 12 lint errors: rename files to kebab-case, run formatter on Board.css, index.html, hooks.json"
    status: pending
  - id: fix-reset-bug
    content: Fix resetGame to call shuffleBoard so 'New Game' doesn't produce a solved board
    status: pending
  - id: refactor-reducer
    content: Replace 3x useState in usePuzzle with useReducer to fix stale closure, make memo effective, and co-locate transitions
    status: pending
  - id: style-ui
    content: Restyle tiles, board, empty slot, layout, win state message, and remove Vite boilerplate CSS
    status: pending
  - id: accessibility
    content: Add aria-labels on tiles, aria-live on move counter and win announcement, keyboard arrow-key navigation
    status: pending
  - id: component-tests
    content: Add RTL component tests for Board, Tile, and win state rendering
    status: pending
  - id: cleanup
    content: Remove unused types or wire them in, extract BoardProps interface, configure vitest environment globally, null-check root element
    status: pending
  - id: error-boundary
    content: Add a top-level ErrorBoundary component with fallback UI
    status: pending
  - id: polish
    content: Add CSS slide transitions, timer hook, grid size selector, and sync README with actual state
    status: pending
isProject: false
---

# Senior Frontend Take-Home Assessment Review

## Verdict: Not Ready to Submit

The game logic foundation is solid (pure utils, simulation shuffle, immutable updates), and the README thought-process section is excellent. However, the project has several issues that range from "instant red flag" to "missed opportunity," and would not pass a senior-level bar in its current state. Below is everything, ranked by severity.

---

## 1. Showstoppers (Fix Before Submitting)

### 1a. Linter is broken -- 12 errors on `pnpm lint`

A failing lint check is an immediate credibility hit. There are two categories:

- **File naming convention (8 errors)**: Biome (via ultracite) enforces kebab-case filenames. All component/hook/util files use camelCase/PascalCase (`Tile.tsx`, `usePuzzle.ts`, `puzzleUtils.ts`).
- **Formatting (4 errors)**: `Board.css` uses 4-space indent + missing semicolon, `index.html` has self-closing void elements, `.cursor/hooks.json` missing trailing newline.

**Fix:** Rename all files to kebab-case and run `pnpm lint:fix`. This is a 10-minute fix that removes a huge red flag.

### 1b. `resetGame` produces a solved board

In [usePuzzle.ts](src/hooks/usePuzzle.ts), `resetGame` calls `createBoard(gridSize)` but never calls `shuffleBoard`. Clicking "New Game" gives the player an already-solved puzzle. This is a functional bug that any reviewer who plays the game will hit immediately.

```typescript
// Current (broken)
const resetGame = useCallback(() => {
  setTiles(createBoard(gridSize));
  ...
}, [gridSize]);

// Fix
const resetGame = useCallback(() => {
  setTiles(shuffleBoard(createBoard(gridSize), gridSize));
  ...
}, [gridSize]);
```

### 1c. UI is raw / debug-quality

Tiles render `{tile.value ?? "empty"} (i: {index})` -- literal debug output with array indices visible. The empty tile says "empty" in plain text. `Board.css` has exactly 3 lines. `App.css` is 90% Vite template boilerplate (`.logo`, `.logo-spin`, `.read-the-docs`) that is completely unused.

For a senior FE role, the reviewer expects a polished, intentional UI. This doesn't need to be award-winning design, but it needs to look like a finished product: styled tiles with numbers, a visually distinct empty slot, hover/active states, and a coherent color palette.

### 1d. `handleMove` has a stale-closure problem that nullifies `memo`

In [usePuzzle.ts](src/hooks/usePuzzle.ts):

```typescript
const handleMove = useCallback(
  (clickedTileIndex: number) => {
    const emptyTileIndex = getEmptyTileIndex(tiles); // reads `tiles` from closure
    if (canMoveTile(clickedTileIndex, emptyTileIndex, gridSize)) {
      setTiles((prevTiles) => {
        const updatedTiles = moveTile(prevTiles, clickedTileIndex, emptyTileIndex);
        // ^ uses emptyTileIndex from outer closure, not from prevTiles
        ...
      });
    }
  },
  [gridSize, isSolved, tiles] // <-- `tiles` in deps
);
```

Because `tiles` is in the dependency array, `handleMove` gets a **new identity on every single move**. This means `memo(Tile)` is completely useless -- every tile re-renders on every click anyway.

**Fix:** Move `getEmptyTileIndex` and `canMoveTile` inside the `setTiles` updater function so the callback only depends on `[gridSize, isSolved]`. Better yet, consider `useReducer` (see section 3).

---

## 2. Major Issues (Expected at Senior Level)

### 2a. Zero accessibility

- Tiles are `<button>` elements (good), but have **no `aria-label`**. A screen reader would announce "1 button" or "empty button" with no game context.
- No `aria-live` region for the move counter or win announcement. Sighted users see confetti; blind users get nothing.
- No keyboard navigation beyond default tab order. Arrow keys are the natural interaction for a sliding puzzle.
- No skip-to-content, no landmark roles beyond `<main>` and `<footer>`.

WCAG 2.1 compliance is table-stakes for a senior FE role. Add at minimum: `aria-label` on tiles (e.g., "Tile 5, row 2 column 2"), `role="status"` on moves counter, and an `aria-live="assertive"` win announcement.

### 2b. No win state in the UI

`isSolved` triggers confetti in `App.tsx` but there is zero visual feedback: no "You won!" message, no display of final move count, no prompt to play again. The confetti fires once and then the board just sits there looking identical to before. This is a UX gap that would be noticed in seconds.

### 2c. Hardcoded 3-column grid in CSS

`Board.css` has `grid-template-columns: repeat(3, 1fr)`. If you ever wire up the `GridSize` type (3 | 4 | 5), the layout breaks. This should be an inline style or CSS custom property driven by `gridSize`.

### 2d. No component-level tests

Tests exist for `puzzleUtils` (24 tests) and `usePuzzle` hook (9 tests) -- that's great for logic coverage. But there are **zero component tests** using React Testing Library. A reviewer expects at least:

- `Board` renders the correct number of tiles
- Clicking a tile calls `handleMove` with the right index
- The empty tile is visually distinct / disabled
- Win state renders a congratulations message

### 2e. No error boundary

No `ErrorBoundary` component anywhere. If the confetti library or a future feature throws, the entire app white-screens. A simple catch-all boundary with a "Something went wrong" fallback is minimal effort and shows defensive thinking.

---

## 3. Architectural Improvements (Differentiators)

### 3a. Replace multiple `useState` with `useReducer`

`usePuzzle` manages three tightly coupled state values (`tiles`, `moves`, `isSolved`) with three separate `useState` calls, and `setIsSolved(true)` is called *inside* the `setTiles` updater -- a side effect within a state transition. This is a code smell.

A `useReducer` with a `GameAction` discriminated union (`MOVE | RESET`) would:

- Co-locate all state transitions in a pure, testable reducer
- Eliminate the stale-closure problem entirely (dispatch is stable)
- Make the `memo` on `Tile` actually work (dispatch identity never changes)
- Show the reviewer you understand when to reach beyond `useState`

```typescript
type GameAction =
  | { type: "MOVE"; clickedIndex: number }
  | { type: "RESET" };
```

### 3b. Add CSS transitions for tile sliding

Tiles currently teleport. A `transition: transform 150ms ease` on tiles with `transform: translate(...)` based on their position would make the puzzle feel physical and polished. This is a high-impact, low-effort UX win.

### 3c. Add a timer

`GameStats.seconds` is already typed. A `useTimer` hook (start on first move, pause on win, reset on new game) would round out the game experience and show the reviewer another custom hook.

### 3d. Grid size selector

`GridSize = 3 | 4 | 5` is defined but unused. Wiring up a selector in `Controls` and making the CSS grid dynamic would demonstrate that the architecture actually supports the feature the types promise.

### 3e. localStorage best score

`PuzzleState.bestScore` is typed. A small `useLocalStorage` hook or even raw `localStorage.getItem/setItem` would complete the feature and show data persistence awareness.

---

## 4. Code Quality Nits


| Issue                                                     | Location               | Fix                                                                             |
| --------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------- |
| Vite boilerplate CSS (`.logo`, `.card`, `.read-the-docs`) | `App.css`, `index.css` | Delete unused rules                                                             |
| `document.getElementById("root") as HTMLElement`          | `main.tsx`             | Null-check with thrown error instead of type assertion                          |
| `// @vitest-environment jsdom` pragma per test file       | `usePuzzle.test.ts`    | Configure globally in `vite.config.ts` under `test.environment`                 |
| Unused types (`GameStatus`, `PuzzleState`)                | `types/index.ts`       | Either wire them into the app or remove them; dead types signal unfinished work |
| `canvas-confetti` is a runtime dep                        | `package.json`         | Fine, but consider lazy-loading it since it's only triggered on win             |
| No `<meta name="description">`                            | `index.html`           | Add for completeness                                                            |
| The `Board` component takes inline object props           | `Board.tsx`            | Extract a named `BoardProps` interface                                          |


---

## 5. README Feedback

The README is actually one of the strongest parts of the submission. The thought-process section is candid and shows architectural reasoning. A few suggestions:

- **Fix the typo**: "cusotm" -> "custom" in the opening line.
- **Remove the "To-dos" section** or rename it to "Future Improvements". Listing unfinished features as open checkboxes signals incomplete work.
- **Remove stale content**: The README says `shuffleBoard` is a stub, but it's actually implemented. Keep the README in sync with reality.
- The mermaid diagram and component table are great -- keep those.

---

## Priority Implementation Order

If time is limited, this is the order that maximizes impact:

1. Fix lint errors (rename files to kebab-case, run formatter)
2. Fix `resetGame` bug (call `shuffleBoard`)
3. Fix stale closure / refactor to `useReducer`
4. Style the UI (tiles, empty slot, layout, colors, win state)
5. Add accessibility (aria-labels, aria-live, keyboard nav)
6. Add component tests
7. Clean up dead CSS and unused types
8. Add error boundary
9. Add timer, grid size selector, animations (bonus polish)


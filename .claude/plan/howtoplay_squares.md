# How To Play Squares — Implementation Plan

## Context

The app already has a "How To Play Props" page (`/props`) with a step-by-step guide and inline visual mockups. The footer has a "Squares" link under "How To Play" that currently points to `#`. This plan creates a matching `/squares-howto` page for the Squares game and links it from the footer.

## Files to Create

- `app/squares-howto/page.tsx` — New How To Play Squares page

## Files to Modify

- `components/footer.tsx` — Update Squares link from `#` to `/squares-howto`
- `app/globals.css` — Add any squares-specific mockup CSS classes not already covered by the existing `htp-*` classes

## Page Structure

Follows the exact same layout pattern as `app/props/page.tsx`:
- Back button
- Title: "How To Play Squares"
- Subtitle (short tagline)
- Step cards with numbered circles, each with a title, description, and where relevant, a visual mockup
- CTA button at the bottom: "Go To Squares" linking to `/squares`

---

## Steps & Mockups

### Step 1 — Add Players
- **Title:** "Add Players"
- **Description:** Tap the gear icon in the top-right corner to open the Admin panel. Switch to Squares, then add everyone who wants to play. You can also import players directly from Props.
- **Mockup:** None (same pattern as Props step 1 — text only with inline gear icon)

### Step 2 — Pick Your Name
- **Title:** "Pick Your Name"
- **Description:** Open the Squares page and find your name. Tap it to start claiming squares.
- **Mockup: Player Cards Grid** — A 2x2 grid of player cards, each showing:
  - A colored circle/swatch with the player's initial (e.g., blue "M", green "S", orange "J", purple "E")
  - Player name below
  - Status badge: one "Full", one "3 / 14", two "Not Started"
  - One card highlighted (like the Props version's `htp-mock-friend-you` style)

### Step 3 — Claim Your Squares
- **Title:** "Claim Your Squares"
- **Description:** Tap empty squares on the 10x10 grid to claim them. Your squares light up in your color. You can also hit Random to auto-fill.
- **Mockup: Mini Grid** — A small simplified grid (e.g., 4x4 or 5x5) showing:
  - A few cells filled with different player colors and initials
  - Some cells empty/gray (unclaimed)
  - One cell highlighted to show a "just claimed" state
  - A progress indicator showing "8 / 14" to illustrate the claiming progress
  - Uses inline colored divs to represent squares

### Step 4 — Lock the Board
- **Title:** "Lock the Board"
- **Description:** Once all 100 squares are claimed, a banner appears on the Squares page to lock the board. You can also lock from the Admin panel. No more changes after that!
- **Mockup: Lock Banner** — Reuse the same `LockMockup` pattern from Props but with squares-appropriate text:
  - Lock icon + "All squares claimed! Ready to lock?" + "Lock Board" button

### Step 5 — Numbers Get Randomized
- **Title:** "Numbers Get Randomized"
- **Description:** After locking, the Admin randomizes the row and column numbers (0-9). These numbers determine which square wins at each quarter based on the last digit of each team's score.
- **Mockup: Numbers Grid** — A small grid header showing:
  - Column header row with randomized numbers: e.g., 3, 7, 1, 9, 0, 5, 2, 8, 4, 6
  - Row header column with different randomized numbers: e.g., 8, 2, 5, 1, 9, 3, 0, 6, 4, 7
  - A few colored squares in the grid body to show it's a real board
  - Team labels on the axes (e.g., "SEAHAWKS →" across top, "PATRIOTS ↓" on left side)

### Step 6 — Watch & Win
- **Title:** "Watch & Win"
- **Description:** At the end of each quarter, check the last digit of each team's score. Find where the row and column meet on the grid — that square wins! Winners are recorded for Q1, Q2, Q3, and Final.
- **Mockup: Winners Table** — A small table showing:
  - Column headers: Quarter, SEA, NE, Winner
  - Example rows:
    - Q1 | 7 | 3 | Mike
    - Q2 | 14 | 10 | Sarah
    - Q3 | 21 | 17 | Jake
    - Final | — | — | —
  - Last digits highlighted or annotated to show the connection to the grid numbers

---

## Reusable Components & Classes

### From existing Props how-to-play (reuse directly):
- `htp-section`, `htp-title`, `htp-subtitle` — Page container and header
- `htp-steps`, `htp-step`, `htp-step-number`, `htp-step-content`, `htp-step-title`, `htp-step-desc` — Step card layout
- `htp-mockup`, `htp-mockup-label` — Mockup container and label
- `htp-mock-lock-banner`, `htp-mock-lock-icon`, `htp-mock-lock-text`, `htp-mock-lock-btn` — Lock banner mockup
- `htp-cta` — CTA button container
- `htp-gear-icon` — Inline gear icon styling
- `cta-button` — Button styling
- `admin-back` — Back button styling

### From existing Props mockups (reuse with modifications):
- `htp-mock-friend-card`, `htp-mock-friend-name`, `htp-mock-badge-*` — Player card mockup (add color swatch)
- `htp-mock-friends-grid` — 2x2 grid layout for player cards

### New CSS classes needed:
- `htp-mock-swatch` — Small colored circle with initial (for player cards in step 2)
- `htp-mock-grid` — Simplified 4x4 or 5x5 mini grid container
- `htp-mock-grid-row` — Grid row
- `htp-mock-grid-cell` — Individual cell (colored or empty)
- `htp-mock-grid-cell-empty` — Unclaimed cell styling
- `htp-mock-grid-header` — Number header cell
- `htp-mock-grid-label` — Team name label on axes
- `htp-mock-winners-table` — Winners table container
- `htp-mock-winners-header` — Table header row
- `htp-mock-winners-row` — Table data row
- `htp-mock-digit-highlight` — Highlighted last digit in scores
- Light mode variants for all new classes

---

## Footer Update

In `components/footer.tsx`, change:
```
<a href="#" className="footer-link">Squares</a>
```
to:
```
<a href="/squares-howto" className="footer-link">Squares</a>
```

---

## Verification

1. Run `npm run build` — confirm no errors, `/squares-howto` appears in route list
2. Navigate to `/squares-howto` — confirm all 6 steps render with mockups
3. Verify back button works
4. Verify "Go To Squares" CTA navigates to `/squares`
5. Verify footer "Squares" link navigates to `/squares-howto`
6. Check dark mode — all mockups render correctly
7. Check light mode — all light mode overrides work
8. Check mobile — responsive styles apply, grid mockup scales down

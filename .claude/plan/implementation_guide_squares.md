# Football Squares — Add-On Module Implementation Guide

Step-by-step instructions for adding the Football Squares mode to the existing Super Bowl Prop Picker app. This is a **new module** — do not replace or rewrite any existing Props functionality.

---

## What's Changing in the Existing App

Before building Squares, you need to make two structural changes to the existing app:

1. **Add a top-level navbar** with links to: **Picks** / **Leaderboard** / **Squares** / **Admin**
2. **Split the Admin page into two sections**: Props Admin and Squares Admin (tabs, accordion, or side-by-side nav — as long as they're clearly separated)

These changes should be made first, with the Squares links/sections stubbed out, before building any Squares functionality.

---

## New Routes

| Route                       | Purpose                                 |
| --------------------------- | --------------------------------------- |
| `/squares`                  | Main Squares board — player-facing grid |
| `/squares/claim/[playerId]` | Claiming flow for a specific player     |

Squares admin lives inside the existing `/admin` page under a "Squares" section.

---

## New Folder Structure

Add these alongside the existing files — do not move or rename existing files.

```
src/
  app/
    squares/
      page.tsx                    # Public Squares board view
      claim/[playerId]/page.tsx   # Claiming flow for a player
  components/
    squares/
      SquaresGrid.tsx             # The 10×10 grid component
      SquareCell.tsx              # Individual square cell
      PlayerSelector.tsx          # Player selection for claiming
      WinnersDisplay.tsx          # Winners section display
      SquaresLeaderboard.tsx      # Squares winners summary
  lib/
    squaresStore.ts               # All Squares localStorage logic (separate from store.ts)
    squaresTypes.ts               # Squares-specific TypeScript interfaces
    squaresColors.ts              # Color palette and assignment logic
```

---

## Phase 0: Types and Data Model

### Step 0.1 — Define Squares types (`lib/squaresTypes.ts`)

Create the following interfaces:

**SquaresPlayer** — id (UUID string), name (string), color (hex string like "#E63946")

**Square** — row (0–9), col (0–9), ownerId (player id string or null if unclaimed)

**WinnerRecord** — checkpoint ("Q1" / "Q2" / "Q3" / "Final"), patriotsScore (number), seahawksScore (number), patriotsDigit (last digit of Patriots score), seahawksDigit (last digit of Seahawks score), winningPlayerId (string or null), winningPlayerName (string or null), timestamp (ISO string), payoutAmount (number or null)

- `winningPlayerId` and `winningPlayerName` are **nullable** to handle the edge case where the winning square is unclaimed. This should never happen if the 100/100 rule is enforced before randomization, but the type must support it for graceful handling.
- `payoutAmount` is included now but will always be `null` in v1. This makes the data structure ready for v2 payout tracking without a future migration.

**SquaresState** — players (SquaresPlayer array), board (100 Square entries), locked (boolean), orientation ("patriots-cols" or "patriots-rows"), colNumbers (array of 0–9 or null if not randomized), rowNumbers (array of 0–9 or null if not randomized), winners (WinnerRecord array), extraSquaresAssigned (boolean), extraPlayerIds (array of player IDs granted +1 allowance)

### Step 0.2 — Define the color palette (`lib/squaresColors.ts`)

Create a palette of 20+ visually distinct colors. These should be high-contrast and readable on a grid (avoid white, very light colors, or near-black).

Write a function that returns the first palette color not currently in use by any player. If all 20 are taken, generate a random hex color.

### Step 0.3 — Initialize the board

Write a helper that generates 100 squares (rows 0–9 × cols 0–9), all with ownerId set to null.

> **Checkpoint:** Types compile. Board initializer returns 100 squares. Color assignment picks unused colors correctly.

---

## Phase 1: Squares Store (`lib/squaresStore.ts`)

This is completely separate from the Props `store.ts`. Uses its own localStorage key `"sbSquares"`.

### Step 1.1 — getSquaresState / saveSquaresState

Same pattern as Props store. Reads from localStorage key `"sbSquares"`. If nothing exists, returns a default state with an empty player list, empty board, locked = false, orientation = "patriots-cols", null numbers, empty winners, extraSquaresAssigned = false.

### Step 1.2 — Initialize players from Props friends

Write a function that reads the current Props friends list, copies each friend as a new SquaresPlayer with a new UUID, the same name, and an auto-assigned color. Saves to Squares state. This should only run on first initialization — if Squares players already exist, do nothing.

After this, the Squares player list is fully independent. Changing Props friends does not affect Squares players.

### Step 1.3 — Player management functions

| Function            | Behavior                                                                 |
| ------------------- | ------------------------------------------------------------------------ |
| Add player          | Creates a new player with UUID, auto-assigned color. No duplicate names. |
| Rename player       | Updates name.                                                            |
| Remove player       | Removes player AND clears all their squares on the board.                |
| Update player color | Sets a new hex color for the player.                                     |

### Step 1.4 — Allocation computation

These are computed on the fly (not stored):

| Function                 | Behavior                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Get base limit           | Returns floor(100 / playerCount).                                                              |
| Get remainder            | Returns 100 - (baseLimit × playerCount).                                                       |
| Get player limit         | Returns baseLimit normally. Returns baseLimit + 1 if the player is in the extraPlayerIds list. |
| Get player claimed count | Counts squares on the board owned by this player.                                              |
| Can player claim         | Returns true if claimed count < player limit and board is not locked.                          |

### Step 1.5 — Claiming functions

| Function            | Behavior                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Claim square        | Sets the square's owner to the given player. Validates: square is unclaimed, player hasn't hit their limit, board isn't locked. |
| Unclaim square      | Sets the square's owner to null. Validates: square is owned by this specific player, board isn't locked.                        |
| Get square          | Returns the square at a given row/col.                                                                                          |
| Get unclaimed count | Returns count of squares with no owner.                                                                                         |
| Get total claimed   | Returns 100 minus unclaimed count.                                                                                              |

### Step 1.6 — Extra squares assignment

| Function               | Behavior                                                                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Assign extra squares   | Computes the remainder. Randomly selects that many player IDs. Adds them to extraPlayerIds. Sets extraSquaresAssigned = true. Does **not** place any squares — it only grants the selected players a +1 allowance. |
| Is base round complete | Returns true if every player has claimed at least baseLimit squares.                                                                                                                                               |
| Can assign extras      | Returns true if base round is complete AND unclaimed squares exist AND extras haven't been assigned yet.                                                                                                           |

### Step 1.7 — Admin place extra square

| Function               | Behavior                                                                                                                                                                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Admin place for player | Takes a player ID, row, and col. Claims that square for the given player. Validates: square is unclaimed, player is in the extraPlayerIds list, player hasn't already used their extra allowance. This is admin-only — it bypasses the normal claiming flow. |

This is how extra squares are physically placed on the board. The admin selects an extra-eligible player, then taps an unclaimed square to assign it to them. The player does not place it themselves.

### Step 1.8 — Auto-fill

| Function         | Behavior                                                                                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto-fill player | Gets all unclaimed squares. Shuffles them randomly. Claims squares for the given player until they hit their limit. Respects lock state, claim uniqueness, and base/extra limits. |

### Step 1.9 — Lock board

| Function     | Behavior                                                                   |
| ------------ | -------------------------------------------------------------------------- |
| Lock board   | Sets locked = true.                                                        |
| Unlock board | Sets locked = false. The UI must require confirmation before calling this. |

### Step 1.10 — Number randomization

| Function          | Behavior                                                                                                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Randomize numbers | Generates two random permutations of [0,1,2,...,9] using Fisher-Yates shuffle. Stores as colNumbers and rowNumbers. Only allowed when locked = true and total claimed = 100. |
| Can randomize     | Returns true if board is locked and all 100 squares are claimed.                                                                                                             |

### Step 1.11 — Winner computation

| Function       | Behavior                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Compute winner | Takes checkpoint, Patriots score, and Seahawks score. Computes last digit of each score. Looks up the row index where the row number matches one digit, and the column index where the column number matches the other digit (respecting current orientation). Finds the square at that intersection. Returns the winning player info. **If the winning square is unclaimed (ownerId is null), return a result indicating "Unclaimed" rather than a player — do not crash or skip.** |
| Record winner  | Calls compute winner. If the winning square has an owner, creates a WinnerRecord and appends to the winners array. Prevents duplicate entries for the same checkpoint. **If the winning square is unclaimed, do not record the winner — return an error/status so the UI can handle it.**                                                                                                                                                                                            |
| Clear winner   | Removes the winner record for a given checkpoint.                                                                                                                                                                                                                                                                                                                                                                                                                                    |

**Orientation logic:** When orientation is "patriots-cols", the Patriots score's last digit maps to columns and the Seahawks digit maps to rows. When "patriots-rows", it's flipped. The flip only affects display and winner computation — it never changes the stored board data.

**Unclaimed square handling:** Although this should never happen if the 100/100 rule is enforced before randomization, the winner computation must handle it gracefully. If the winning square is unclaimed, the UI should display "Unclaimed — cannot record winner" and the Record button should be disabled for that checkpoint. See Step 5.11 for the UI side.

### Step 1.12 — Admin square clearing

| Function             | Behavior                                        |
| -------------------- | ----------------------------------------------- |
| Admin clear square   | Sets ownerId to null regardless of who owns it. |
| Admin clear multiple | Clears multiple squares at once.                |

### Step 1.13 — Backup/Restore integration

Modify the existing Props backup/restore to include Squares data:

- Export produces an object with both `props` (existing AppState) and `squares` (SquaresState).
- Import checks for both keys. If the backup has a `props` key, restore Props state. If it has a `squares` key, restore Squares state. If it's an old-format backup with no `squares` key, restore Props only and leave Squares untouched.

**Important:** Do not break existing Props backup files. Handle missing `squares` gracefully.

### Step 1.14 — Flip orientation

| Function         | Behavior                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| Flip orientation | Toggles between "patriots-cols" and "patriots-rows". Does not change any board data, numbers, or winners. |

> **Checkpoint:** All store functions work from the browser console. You can add players, claim squares, check limits, assign extras, have admin place extra squares, lock the board, randomize numbers, compute winners (including the unclaimed edge case), and backup/restore with Squares data included.

---

## Phase 2: Navbar Update

### Step 2.1 — Add a shared navbar component

Create a Navbar component that renders across all pages. Four links:

| Label       | Route                                                            |
| ----------- | ---------------------------------------------------------------- |
| Picks       | /picks (or wherever the friend selection / picks page lives now) |
| Leaderboard | /leaderboard                                                     |
| Squares     | /squares                                                         |
| Admin       | /admin                                                           |

Match the existing app design. Highlight the active route. Make tap targets large enough for iPad use.

### Step 2.2 — Add the navbar to the root layout

Import and render the Navbar in the root layout so it appears on every page.

### Step 2.3 — Split the Admin page

Add a top-level toggle or tab pair to the Admin page: **Props** / **Squares**. The existing Props admin tabs (Friends, Props, Scoring, Settings) go under the Props section. The Squares admin controls (built in Phase 5) go under the Squares section.

> **Checkpoint:** Navbar appears on all pages. All existing Props pages still work. Clicking "Squares" goes to a stub page. Admin page has Props/Squares sections (Squares section is empty for now).

---

## Phase 3: Squares Board — Public View

**File:** `app/squares/page.tsx`

This is what everyone at the party sees — the 10×10 grid.

### Step 3.1 — Grid layout (SquaresGrid component)

Build a 10×10 CSS grid. It needs:

- **Column headers** (top): Team logo + name for one team. Below that, 10 cells showing the randomized digits (or "?" if not yet randomized).
- **Row headers** (left): Team logo + name for the other team. To the right, 10 cells showing the randomized digits (or "?" if not yet randomized).
- **100 square cells** in the body.

Which team is on which axis depends on orientation:

- "patriots-cols" → Patriots logo + digits across the top, Seahawks logo + digits down the left.
- "patriots-rows" → Flipped.

Use the logo images at `/images/patriots.png` and `/images/seahawks.png`.

### Step 3.2 — Individual square cells (SquareCell component)

Each cell renders:

- **Unclaimed:** Empty or a subtle placeholder (e.g., light gray background).
- **Claimed:** Shows the player's first initial (first character of their name) on a background of that player's assigned color. Text should be white or dark depending on the background for contrast — write a simple contrast utility that returns "white" or "black" based on the hex color's luminance.

On tap, show the player's full name. Use a small popover or tooltip (preferred for iPad). Alternatively, toggle the cell to briefly show the full name, then revert.

### Step 3.3 — Winner highlights

If winners have been recorded, highlight the winning squares:

- For each recorded checkpoint, find the winning square and add a visual indicator (border, glow, trophy icon, or badge showing "Q1", "Q2", etc.).
- Highlight the corresponding row and column header digits.
- If you can add a subtle animation (pulse, glow), great — but a static highlight is fine for v1.

### Step 3.4 — Board info bar

Above or below the grid, show:

- Claimed count: "67 / 100 squares claimed"
- Lock status: "Board is locked" or "Board is open"
- A link/button to go to the claiming flow (if board is not locked): "Claim Squares →"

### Step 3.5 — Winners display (WinnersDisplay component)

Below the grid, show a summary of recorded winners:

| Checkpoint | Score                     | Winner |
| ---------- | ------------------------- | ------ |
| Q1         | Patriots 10 – Seahawks 7  | Mike   |
| Q2         | Patriots 17 – Seahawks 14 | Giovi  |
| Q3         | —                         | —      |
| Final      | —                         | —      |

Always show all four rows. Unrecorded checkpoints show dashes.

> **Checkpoint:** The 10×10 grid renders. Unclaimed squares are empty. If you manually claim squares via console, they show initials with colors. Logos display on the correct axes. Tapping a claimed square shows the full name.

---

## Phase 4: Claiming Flow

### Step 4.1 — Player selection screen

On `/squares`, add a "Claim Squares" button (hidden when board is locked). This leads to a player selection step — similar to the Props friend selection screen.

Show all Squares players in a grid. Each card shows:

- Player name
- Their color (as a colored dot or border)
- Squares claimed: "7 / 10" (claimed / limit)
- Status: "Full" if at their limit

Tapping a player navigates to `/squares/claim/[playerId]`.

### Step 4.2 — Claiming screen

This page shows:

- Header: "Claiming for: Mike" with their color indicator.
- Info bar: "Claimed: 7 / 10" (updates live).
- The full 10×10 grid, but now interactive:

**Tap behavior:**

| Square state                   | Action on tap                                                     |
| ------------------------------ | ----------------------------------------------------------------- |
| Unclaimed + player under limit | Claim it for this player.                                         |
| Unclaimed + player at limit    | Show a message: "You've reached your limit." Do nothing.          |
| Owned by this player           | Unclaim it (give it back).                                        |
| Owned by another player        | Do nothing. Optionally show who owns it.                          |
| Board is locked                | All taps disabled (should not reach this page, but guard anyway). |

Claims save instantly (same pattern as Props picks — no submit button).

### Step 4.3 — Visual feedback during claiming

- Squares owned by the current player: Highlighted with their color + a checkmark or stronger border.
- Squares owned by others: Show initial + their color, but muted/dimmed to indicate "not yours."
- Unclaimed squares: Clearly tappable (e.g., white/light with a "+" icon or subtle border).
- When a square is claimed, give instant visual feedback (color fills in immediately).

### Step 4.4 — Back button

A clear "Done" or "Back" button that returns to `/squares`. No need for a confirmation — picks save live.

> **Checkpoint:** You can select a player, tap squares to claim them, see the count update, see the grid fill with colors. Tapping your own square unclaims it. You can't exceed the limit. Going back to the board view shows all claims correctly.

---

## Phase 5: Squares Admin Controls

These live inside the Admin page under the **Squares** section. Organize as sub-tabs or collapsible sections:

### Section A: Players

#### Step 5.1 — Player list with colors

Show all Squares players. Each row shows:

- A color swatch (small square/circle of their color)
- Name
- Squares claimed count
- **Rename** button → dialog
- **Change Color** button → color picker input (HTML color input, pre-filled with current color). On change, call the update player color function. All squares owned by that player update immediately.
- **Remove** button → confirmation dialog. Warns: "This will remove [Name] and clear all their squares."

#### Step 5.2 — Add player

Text input + "Add" button. Auto-assigns a color from the palette. No duplicate names.

#### Step 5.3 — Initialize from Props

A one-time button: **"Import Players from Props"**. Calls the init-from-Props function. Only shown if the Squares player list is empty. After running, the button disappears or is disabled.

### Section B: Board Management

#### Step 5.4 — Board overview

Show:

- Total claimed: "78 / 100"
- Base limit: "10 per player" (computed from player count)
- Remainder: "0 extra squares" (if evenly divisible) or "5 extra squares to assign"
- Lock status

#### Step 5.5 — Assign Extra Squares

Visible only when the base round is complete, unclaimed squares exist, and extras haven't been assigned yet.

On click:

1. Show a dialog explaining: "[X] players will be randomly selected to receive 1 extra square each. You will then place their extra squares manually on the board."
2. On confirm, run the assign extras function (this randomly picks which players get the +1 allowance).
3. After assignment, show which players were selected (highlight them in the player list with a "+1" badge).

#### Step 5.6 — Admin Place Extra Squares

After extras have been assigned, the admin needs to physically place the extra squares on the board. This is a dedicated admin flow:

1. Show a list of extra-eligible players who haven't had their extra square placed yet. Each shows their name, color, and a "Place Square" button.
2. When the admin taps "Place Square" for a player, show the 10×10 grid with only unclaimed squares tappable.
3. When the admin taps an unclaimed square, it is claimed for that player via the admin-place function. Show confirmation: "Assign this square to [Name]?"
4. After placement, that player is marked as complete in the extras list.
5. Repeat until all extra squares have been placed.

The key point: **players do not place their own extra squares.** The admin selects which unclaimed square goes to which extra-eligible player.

#### Step 5.7 — Auto-Fill for Player

A button per player (or a dropdown): "Auto-Fill [Name]".

1. Confirmation dialog: "This will randomly fill [Name]'s remaining [X] squares. Continue?"
2. On confirm, call the auto-fill function.

#### Step 5.8 — Lock / Unlock Board

- **Lock Board** button → confirmation: "Locking prevents all players from claiming or unclaiming. Lock the board?"
- When locked, show an **Unlock Board** button → confirmation: "Unlocking will allow players to modify claims again. Are you sure?"

#### Step 5.9 — Admin clear squares

Two options:

- **Clear Single Square:** Admin taps a square on a mini-grid view → confirmation → clears it.
- **Clear All Squares for Player:** A button per player → confirmation: "Clear all of [Name]'s squares?" → sets all their squares to unclaimed.

Both require confirmation dialogs.

### Section C: Numbers

#### Step 5.10 — Randomize Numbers

- **Randomize Numbers** button. Disabled unless the board is locked and all 100 squares are claimed.
- If disabled, show why: "Board must be locked with all 100 squares claimed."
- On click, confirmation: "This will randomly assign digits 0–9 to rows and columns. Continue?"
- After randomization, display the assigned numbers.

#### Step 5.11 — Re-randomize

- After numbers are assigned, show a **Re-randomize** button.
- Confirmation: "This will reassign all row and column numbers. Any recorded winners will be cleared. Continue?"
- On confirm: re-randomize numbers AND clear all winner records (since they'd be invalid with new numbers).

### Section D: Scoring / Winners

#### Step 5.12 — Score entry

Show four rows, one per checkpoint (Q1, Q2, Q3, Final). Each row has:

- Checkpoint label
- Patriots score input (number)
- Seahawks score input (number)
- A **Compute Winner** button
- If numbers aren't randomized yet, all inputs are disabled with a message: "Randomize numbers before scoring."

On "Compute Winner":

1. Call the compute winner function.
2. **If the winning square has an owner:** Show the result: "Winner: Mike (Patriots 7, Seahawks 1 → Square [7,1])". Ask for confirmation: "Record Mike as the Q1 winner?" On confirm, record the winner.
3. **If the winning square is unclaimed:** Show a warning: "The winning square [7,1] is unclaimed. Cannot record a winner for this checkpoint." The Record button is disabled. This should not happen if the 100/100 fill rule was enforced, but it must be handled gracefully rather than crashing or silently skipping.

#### Step 5.13 — Winners list

Show all recorded winners with an option to **Clear** any individual winner (with confirmation).

### Section E: Settings & Export

#### Step 5.14 — Flip orientation

A toggle/button: "Flip Grid Orientation". Swaps Patriots and Seahawks axes. Updates the display everywhere instantly. If winners have been recorded, show a warning that flipping doesn't retroactively change past winners.

#### Step 5.15 — Squares exports

Add export buttons:

**Board CSV:**

- 10×10 grid with player names in each cell
- Row and column numbers included if assigned
- Empty string for unclaimed squares

**Winners CSV:**

- Columns: Checkpoint, Patriots Score, Seahawks Score, Patriots Digit, Seahawks Digit, Winner Name, Timestamp, Payout
- The Payout column will be empty for v1 but is included now so the format is ready for v2 payout tracking
- One row per recorded winner

> **Checkpoint:** Full admin flow works. You can manage players, claim squares, assign and place extras via admin, auto-fill, lock the board, randomize numbers, score checkpoints (including the unclaimed square edge case), record winners, and see everything reflected on the public board view.

---

## Phase 6: Backup/Restore Integration

### Step 6.1 — Update export

Modify the existing backup export to produce an object with both `props` (existing AppState) and `squares` (SquaresState).

### Step 6.2 — Update import

Modify the backup import to:

1. Parse the JSON.
2. If it has a `props` key, restore Props state.
3. If it has a `squares` key, restore Squares state.
4. If it's an old-format backup with no `squares` key, restore Props only and leave Squares untouched.

### Step 6.3 — Update the Admin Settings UI

The backup/restore buttons in Admin Settings should now export/import the combined file. Make sure the confirmation dialog says: "This will overwrite all Props AND Squares data. Continue?"

> **Checkpoint:** Backup a fully populated app (props + squares). Clear localStorage. Restore. Everything comes back — both Props and Squares data. Also test restoring an old Props-only backup — Squares data should be unaffected.

---

## Phase 7: Polish

### Step 7.1 — Preserve existing styles

Do not change any existing Props styling. The Squares module should match the existing app's visual language.

### Step 7.2 — iPad grid sizing

The 10×10 grid is the hardest layout to get right on iPad. Target:

- Each cell: at least 44×44px for tap targets (ideally 50–60px).
- The full grid (with headers) should fit on an iPad screen without horizontal scrolling.
- At 60px per cell: 60 × 12 (10 cells + label + number) = 720px — fits iPad portrait.
- Test on both iPad portrait and landscape.

### Step 7.3 — Color contrast

Use the contrast utility to ensure initials are readable on every player's color. Test with all palette colors.

### Step 7.4 — Loading states

When reading from localStorage on page load, show a brief loading state rather than a flash of empty content. This matters especially for the grid.

### Step 7.5 — Error handling

- If a player is deleted while someone is on their claiming page, redirect to /squares with a message.
- If localStorage is corrupted, fall back to default Squares state (don't crash).
- Wrap Squares pages in an error boundary.

---

## Recommended Build Order (Summary)

| Order | What                                                                     | Est. Time |
| ----- | ------------------------------------------------------------------------ | --------- |
| 1     | Phase 0: Types, color palette, board initialization                      | 1–2 hours |
| 2     | Phase 1: squaresStore — all store functions                              | 4–6 hours |
| 3     | Phase 2: Navbar + Admin split (Props / Squares)                          | 2–3 hours |
| 4     | Phase 3: Public board view (grid + headers + logos)                      | 4–5 hours |
| 5     | Phase 4: Claiming flow (player select + tap-to-claim)                    | 3–4 hours |
| 6     | Phase 5A–B: Squares Admin — Players + Board management + Extra placement | 4–5 hours |
| 7     | Phase 5C–D: Squares Admin — Numbers + Scoring/Winners                    | 3–4 hours |
| 8     | Phase 5E: Settings, orientation flip, exports                            | 1–2 hours |
| 9     | Phase 6: Backup/Restore integration                                      | 1–2 hours |
| 10    | Phase 7: Polish, iPad testing, error handling                            | 2–3 hours |

**Total estimate: ~26–36 hours** for a junior dev.

---

## Key Rules to Remember

1. **Don't touch Props code.** Squares is an add-on module. Shared infrastructure only (localStorage pattern, backup/restore, navbar).
2. **Squares players are separate from Props friends.** Initialized from Props once, then independent.
3. **Board data never changes on orientation flip.** Only the display and winner computation interpret orientation.
4. **Numbers are permutations, not random draws.** Each digit 0–9 appears exactly once per axis.
5. **Extras are placed by the admin, not the player.** The assign step picks who gets an extra. The admin then manually places each extra square on the board.
6. **Claims save instantly.** Same pattern as Props picks — no submit button.
7. **Lock must come before number randomization.** Numbers can only be assigned to a locked, fully-claimed board.
8. **Winner computation needs numbers.** Block scoring UI if numbers aren't randomized.
9. **Handle unclaimed winning squares gracefully.** If the winning square has no owner, show "Unclaimed — cannot record winner" and block the Record button. Do not crash or silently skip.
10. **Backup format is backwards-compatible.** Old Props-only backups must still restore correctly.
11. **Keep styles consistent.** Match the existing app's visual language. Don't redesign.
12. **Exports include payout column.** The Winners CSV includes a Payout column (empty for v1) so the format is ready for future use.

run complete run commit-message.md command from the .claude/commands folder

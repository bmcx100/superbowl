import type {
  SquaresState,
  SquaresPlayer,
  Square,
  WinnerRecord,
} from "./squaresTypes"
import { getNextColor } from "./squaresColors"
import { getState } from "./store"

const STORAGE_KEY = "sbSquares"

// Step 0.3 — Board initializer
function createEmptyBoard(): Square[] {
  const board: Square[] = []
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      board.push({ row, col, ownerId: null })
    }
  }
  return board
}

function defaultSquaresState(): SquaresState {
  return {
    players: [],
    board: createEmptyBoard(),
    locked: false,
    orientation: "patriots-cols",
    colNumbers: null,
    rowNumbers: null,
    winners: [],
    extraSquaresAssigned: false,
    extraPlayerIds: [],
  }
}

// Step 1.1
export function getSquaresState(): SquaresState {
  if (typeof window === "undefined") return defaultSquaresState()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const state = defaultSquaresState()
      const propsState = getState()
      const players: SquaresPlayer[] = []
      for (const friend of propsState.friends) {
        players.push({
          id: crypto.randomUUID(),
          name: friend.name,
          color: getNextColor(players),
        })
      }
      state.players = players
      saveSquaresState(state)
      return state
    }
    return JSON.parse(raw) as SquaresState
  } catch {
    return defaultSquaresState()
  }
}

export function saveSquaresState(state: SquaresState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// Step 1.2 — Initialize players from Props friends
export function initPlayersFromProps(): void {
  const state = getSquaresState()
  if (state.players.length > 0) return
  const propsState = getState()
  const players: SquaresPlayer[] = []
  for (const friend of propsState.friends) {
    const player: SquaresPlayer = {
      id: crypto.randomUUID(),
      name: friend.name,
      color: getNextColor(players),
    }
    players.push(player)
  }
  state.players = players
  saveSquaresState(state)
}

// Step 1.3 — Player management
export function addSquaresPlayer(name: string): void {
  const state = getSquaresState()
  const trimmed = name.trim()
  if (!trimmed) return
  if (state.players.some((p) => p.name === trimmed)) return
  state.players.push({
    id: crypto.randomUUID(),
    name: trimmed,
    color: getNextColor(state.players),
  })
  saveSquaresState(state)
}

export function renameSquaresPlayer(playerId: string, newName: string): void {
  const state = getSquaresState()
  const trimmed = newName.trim()
  if (!trimmed) return
  if (state.players.some((p) => p.name === trimmed && p.id !== playerId)) return
  const player = state.players.find((p) => p.id === playerId)
  if (player) {
    player.name = trimmed
    saveSquaresState(state)
  }
}

export function removeSquaresPlayer(playerId: string): void {
  const state = getSquaresState()
  state.players = state.players.filter((p) => p.id !== playerId)
  for (const sq of state.board) {
    if (sq.ownerId === playerId) sq.ownerId = null
  }
  state.extraPlayerIds = state.extraPlayerIds.filter((id) => id !== playerId)
  saveSquaresState(state)
}

export function updatePlayerColor(playerId: string, color: string): void {
  const state = getSquaresState()
  const player = state.players.find((p) => p.id === playerId)
  if (player) {
    player.color = color
    saveSquaresState(state)
  }
}

export function updatePlayerInitials(playerId: string, initials: string): void {
  const state = getSquaresState()
  const player = state.players.find((p) => p.id === playerId)
  if (player) {
    player.initials = initials.slice(0, 3).toUpperCase()
    saveSquaresState(state)
  }
}

// Step 1.4 — Allocation computation
export function getBaseLimit(playerCount: number): number {
  if (playerCount === 0) return 0
  return Math.floor(100 / playerCount)
}

export function getRemainder(playerCount: number): number {
  if (playerCount === 0) return 0
  return 100 - getBaseLimit(playerCount) * playerCount
}

export function getPlayerLimit(state: SquaresState, playerId: string): number {
  const base = getBaseLimit(state.players.length)
  if (state.extraPlayerIds.includes(playerId)) return base + 1
  return base
}

export function getPlayerClaimedCount(state: SquaresState, playerId: string): number {
  return state.board.filter((sq) => sq.ownerId === playerId).length
}

export function canPlayerClaim(state: SquaresState, playerId: string): boolean {
  if (state.locked) return false
  return getPlayerClaimedCount(state, playerId) < getPlayerLimit(state, playerId)
}

// Step 1.5 — Claiming functions
export function claimSquare(playerId: string, row: number, col: number): void {
  const state = getSquaresState()
  if (state.locked) return
  const sq = state.board.find((s) => s.row === row && s.col === col)
  if (!sq || sq.ownerId !== null) return
  if (!canPlayerClaim(state, playerId)) return
  sq.ownerId = playerId
  saveSquaresState(state)
}

export function unclaimSquare(playerId: string, row: number, col: number): void {
  const state = getSquaresState()
  if (state.locked) return
  const sq = state.board.find((s) => s.row === row && s.col === col)
  if (!sq || sq.ownerId !== playerId) return
  sq.ownerId = null
  saveSquaresState(state)
}

export function getSquare(state: SquaresState, row: number, col: number): Square | undefined {
  return state.board.find((s) => s.row === row && s.col === col)
}

export function getUnclaimedCount(state: SquaresState): number {
  return state.board.filter((sq) => sq.ownerId === null).length
}

export function getTotalClaimed(state: SquaresState): number {
  return 100 - getUnclaimedCount(state)
}

// Step 1.6 — Extra squares assignment
export function isBaseRoundComplete(state: SquaresState): boolean {
  const base = getBaseLimit(state.players.length)
  return state.players.every(
    (p) => getPlayerClaimedCount(state, p.id) >= base
  )
}

export function canAssignExtras(state: SquaresState): boolean {
  return (
    isBaseRoundComplete(state) &&
    getUnclaimedCount(state) > 0 &&
    !state.extraSquaresAssigned
  )
}

export function assignExtraSquares(): string[] {
  const state = getSquaresState()
  if (!canAssignExtras(state)) return []
  const remainder = getRemainder(state.players.length)
  const shuffled = [...state.players].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, remainder).map((p) => p.id)
  state.extraPlayerIds = selected
  state.extraSquaresAssigned = true
  saveSquaresState(state)
  return selected
}

// Step 1.7 — Admin place extra square
export function adminPlaceForPlayer(playerId: string, row: number, col: number): boolean {
  const state = getSquaresState()
  const sq = state.board.find((s) => s.row === row && s.col === col)
  if (!sq || sq.ownerId !== null) return false
  if (!state.extraPlayerIds.includes(playerId)) return false
  const base = getBaseLimit(state.players.length)
  const claimed = getPlayerClaimedCount(state, playerId)
  if (claimed >= base + 1) return false
  sq.ownerId = playerId
  saveSquaresState(state)
  return true
}

// Step 1.8 — Auto-fill
export function autoFillPlayer(playerId: string): void {
  const state = getSquaresState()
  if (state.locked) return
  const limit = getPlayerLimit(state, playerId)
  let claimed = getPlayerClaimedCount(state, playerId)
  if (claimed >= limit) return
  const unclaimed = state.board.filter((sq) => sq.ownerId === null)
  // Fisher-Yates shuffle
  for (let i = unclaimed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = unclaimed[i]
    unclaimed[i] = unclaimed[j]
    unclaimed[j] = temp
  }
  for (const sq of unclaimed) {
    if (claimed >= limit) break
    sq.ownerId = playerId
    claimed++
  }
  saveSquaresState(state)
}

export function randomizeRemaining(): void {
  const state = getSquaresState()
  if (state.locked) return
  const remainder = getRemainder(state.players.length)
  const shuffled = [...state.players].sort(() => Math.random() - 0.5)
  const selected = shuffled.slice(0, remainder).map((p) => p.id)
  state.extraPlayerIds = selected
  state.extraSquaresAssigned = true
  const unclaimed = state.board.filter((sq) => sq.ownerId === null)
  for (let i = unclaimed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = unclaimed[i]
    unclaimed[i] = unclaimed[j]
    unclaimed[j] = temp
  }
  let idx = 0
  for (const pid of selected) {
    const limit = getPlayerLimit(state, pid)
    let claimed = getPlayerClaimedCount(state, pid)
    while (claimed < limit && idx < unclaimed.length) {
      unclaimed[idx].ownerId = pid
      claimed++
      idx++
    }
  }
  saveSquaresState(state)
}

// Step 1.9 — Lock board
export function lockBoard(): void {
  const state = getSquaresState()
  state.locked = true
  state.colNumbers = fisherYatesShuffle()
  state.rowNumbers = fisherYatesShuffle()
  saveSquaresState(state)
}

export function unlockBoard(): void {
  const state = getSquaresState()
  state.locked = false
  saveSquaresState(state)
}

// Step 1.10 — Number randomization
function fisherYatesShuffle(): number[] {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

export function canRandomize(state: SquaresState): boolean {
  return state.locked && getTotalClaimed(state) === 100
}

export function randomizeNumbers(): void {
  const state = getSquaresState()
  if (!canRandomize(state)) return
  state.colNumbers = fisherYatesShuffle()
  state.rowNumbers = fisherYatesShuffle()
  saveSquaresState(state)
}

// Step 1.11 — Winner computation
export interface ComputeWinnerResult {
  checkpoint: "Q1" | "Q2" | "Q3" | "Final"
  patriotsScore: number
  seahawksScore: number
  patriotsDigit: number
  seahawksDigit: number
  row: number
  col: number
  playerId: string | null
  playerName: string | null
  unclaimed: boolean
}

export function computeWinner(
  checkpoint: "Q1" | "Q2" | "Q3" | "Final",
  patriotsScore: number,
  seahawksScore: number
): ComputeWinnerResult | null {
  const state = getSquaresState()
  if (!state.colNumbers || !state.rowNumbers) return null

  const patriotsDigit = patriotsScore % 10
  const seahawksDigit = seahawksScore % 10

  // Patriots last digit → row, Seahawks last digit → column
  const rowIndex = state.rowNumbers.indexOf(patriotsDigit)
  const colIndex = state.colNumbers.indexOf(seahawksDigit)

  const sq = getSquare(state, rowIndex, colIndex)
  if (!sq) return null

  const player = sq.ownerId
    ? state.players.find((p) => p.id === sq.ownerId) ?? null
    : null

  return {
    checkpoint,
    patriotsScore,
    seahawksScore,
    patriotsDigit,
    seahawksDigit,
    row: rowIndex,
    col: colIndex,
    playerId: sq.ownerId,
    playerName: player ? player.name : null,
    unclaimed: sq.ownerId === null,
  }
}

export function recordWinner(
  checkpoint: "Q1" | "Q2" | "Q3" | "Final",
  patriotsScore: number,
  seahawksScore: number
): { success: boolean; unclaimed?: boolean } {
  const result = computeWinner(checkpoint, patriotsScore, seahawksScore)
  if (!result) return { success: false }
  if (result.unclaimed) return { success: false, unclaimed: true }

  const state = getSquaresState()
  if (state.winners.some((w) => w.checkpoint === checkpoint)) {
    return { success: false }
  }

  const record: WinnerRecord = {
    checkpoint: result.checkpoint,
    patriotsScore: result.patriotsScore,
    seahawksScore: result.seahawksScore,
    patriotsDigit: result.patriotsDigit,
    seahawksDigit: result.seahawksDigit,
    winningPlayerId: result.playerId,
    winningPlayerName: result.playerName,
    timestamp: new Date().toISOString(),
    payoutAmount: null,
  }

  state.winners.push(record)
  saveSquaresState(state)
  return { success: true }
}

export function clearWinner(checkpoint: "Q1" | "Q2" | "Q3" | "Final"): void {
  const state = getSquaresState()
  state.winners = state.winners.filter((w) => w.checkpoint !== checkpoint)
  saveSquaresState(state)
}

// Step 1.12 — Admin square clearing
export function adminClearSquare(row: number, col: number): void {
  const state = getSquaresState()
  const sq = state.board.find((s) => s.row === row && s.col === col)
  if (sq) {
    sq.ownerId = null
    saveSquaresState(state)
  }
}

export function adminClearMultiple(squares: { row: number; col: number }[]): void {
  const state = getSquaresState()
  for (const { row, col } of squares) {
    const sq = state.board.find((s) => s.row === row && s.col === col)
    if (sq) sq.ownerId = null
  }
  saveSquaresState(state)
}

// Step 1.13 — Backup/Restore integration
export function exportSquaresBackup(): string {
  const propsState = getState()
  const squaresState = getSquaresState()
  return JSON.stringify({ props: propsState, squares: squaresState }, null, 2)
}

export function importSquaresBackup(json: string): void {
  const data = JSON.parse(json)
  if (data.props) {
    localStorage.setItem("sbProps", JSON.stringify(data.props))
  }
  if (data.squares) {
    saveSquaresState(data.squares)
  }
}

// Step 1.14 — Flip orientation
export function flipOrientation(): void {
  const state = getSquaresState()
  state.orientation =
    state.orientation === "patriots-cols" ? "patriots-rows" : "patriots-cols"
  saveSquaresState(state)
}

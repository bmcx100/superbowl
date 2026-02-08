export interface SquaresPlayer {
  id: string
  name: string
  color: string
}

export interface Square {
  row: number
  col: number
  ownerId: string | null
}

export interface WinnerRecord {
  checkpoint: "Q1" | "Q2" | "Q3" | "Final"
  patriotsScore: number
  seahawksScore: number
  patriotsDigit: number
  seahawksDigit: number
  winningPlayerId: string | null
  winningPlayerName: string | null
  timestamp: string
  payoutAmount: number | null
}

export interface SquaresState {
  players: SquaresPlayer[]
  board: Square[]
  locked: boolean
  orientation: "patriots-cols" | "patriots-rows"
  colNumbers: number[] | null
  rowNumbers: number[] | null
  winners: WinnerRecord[]
  extraSquaresAssigned: boolean
  extraPlayerIds: string[]
}

import type { SquaresPlayer } from "./squaresTypes"

const PALETTE = [
  "#E63946",
  "#1D3557",
  "#2A9D8F",
  "#E9C46A",
  "#F4A261",
  "#264653",
  "#6A0572",
  "#AB83A1",
  "#D62828",
  "#457B9D",
  "#F77F00",
  "#FCBF49",
  "#3A86A7",
  "#8338EC",
  "#FF006E",
  "#06D6A0",
  "#118AB2",
  "#EF476F",
  "#073B4C",
  "#7209B7",
  "#B5179E",
  "#4CC9F0",
]

export function getContrastColor(hex: string): "white" | "black" {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? "black" : "white"
}

export function getNextColor(players: SquaresPlayer[]): string {
  const usedColors = new Set(players.map((p) => p.color))
  for (const color of PALETTE) {
    if (!usedColors.has(color)) return color
  }
  const r = Math.floor(Math.random() * 200) + 30
  const g = Math.floor(Math.random() * 200) + 30
  const b = Math.floor(Math.random() * 200) + 30
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

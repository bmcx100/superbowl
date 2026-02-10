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

export function getUniqueLabels(players: SquaresPlayer[]): Map<string, string> {
  const labels = new Map<string, string>()

  // First pass: use custom initials or first letter
  const pending = new Map<string, string[]>()
  for (const p of players) {
    if (p.initials) {
      labels.set(p.id, p.initials)
    } else {
      const letter = p.name.charAt(0).toUpperCase()
      if (!pending.has(letter)) pending.set(letter, [])
      pending.get(letter)!.push(p.id)
    }
  }

  // Second pass: resolve collisions
  for (const [, ids] of pending) {
    if (ids.length === 1) {
      const p = players.find((pl) => pl.id === ids[0])!
      labels.set(p.id, p.name.charAt(0).toUpperCase())
    } else {
      // Try 2 letters, then 3
      const twoLetters = ids.map((id) => {
        const p = players.find((pl) => pl.id === id)!
        return { id, label: p.name.slice(0, 2).toUpperCase() }
      })
      const twoUnique = new Set(twoLetters.map((t) => t.label)).size === twoLetters.length
      if (twoUnique) {
        for (const t of twoLetters) labels.set(t.id, t.label)
      } else {
        for (const id of ids) {
          const p = players.find((pl) => pl.id === id)!
          labels.set(p.id, p.name.slice(0, 3).toUpperCase())
        }
      }
    }
  }

  return labels
}

export function getPlayerLabel(players: SquaresPlayer[], playerId: string): string {
  const labels = getUniqueLabels(players)
  return labels.get(playerId) ?? "?"
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

"use client"

import { getContrastColor } from "@/lib/squaresColors"
import type { SquaresPlayer } from "@/lib/squaresTypes"

interface SquareCellProps {
  owner: SquaresPlayer | null
  winnerLabel?: string | null
  onClick?: () => void
  interactive?: boolean
  highlighted?: boolean
}

export function SquareCell({ owner, winnerLabel, onClick, interactive, highlighted }: SquareCellProps) {
  if (!owner) {
    return (
      <div
        className={`sq-cell sq-cell-empty ${interactive ? "sq-cell-interactive" : ""}`}
        onClick={onClick}
      />
    )
  }

  const isActive = highlighted === true
  const bgColor = isActive ? owner.color : "#d1d5db"
  const textColor = isActive ? getContrastColor(owner.color) : "#555"
  const initial = owner.name.charAt(0).toUpperCase()

  return (
    <div
      className={`sq-cell sq-cell-claimed ${winnerLabel ? "sq-cell-winner" : ""} ${isActive ? "sq-cell-active" : ""}`}
      style={{ backgroundColor: bgColor, color: textColor }}
      onClick={onClick}
    >
      {isActive ? (
        <span className="sq-cell-fullname">{owner.name}</span>
      ) : (
        <span className="sq-cell-initial">{initial}</span>
      )}
      {winnerLabel && <span className="sq-cell-winner-badge">{winnerLabel}</span>}
    </div>
  )
}

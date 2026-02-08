"use client"

import { useState } from "react"
import { getContrastColor } from "@/lib/squaresColors"
import type { SquaresPlayer } from "@/lib/squaresTypes"

interface SquareCellProps {
  owner: SquaresPlayer | null
  winnerLabel?: string | null
  onClick?: () => void
  interactive?: boolean
}

export function SquareCell({ owner, winnerLabel, onClick, interactive }: SquareCellProps) {
  const [showName, setShowName] = useState(false)

  if (!owner) {
    return (
      <div
        className={`sq-cell sq-cell-empty ${interactive ? "sq-cell-interactive" : ""}`}
        onClick={onClick}
      />
    )
  }

  const textColor = getContrastColor(owner.color)
  const initial = owner.name.charAt(0).toUpperCase()

  return (
    <div
      className={`sq-cell sq-cell-claimed ${winnerLabel ? "sq-cell-winner" : ""}`}
      style={{ backgroundColor: owner.color, color: textColor }}
      onClick={() => {
        if (onClick) onClick()
        else setShowName((prev) => !prev)
      }}
    >
      {showName ? (
        <span className="sq-cell-fullname">{owner.name}</span>
      ) : (
        <span className="sq-cell-initial">{initial}</span>
      )}
      {winnerLabel && <span className="sq-cell-winner-badge">{winnerLabel}</span>}
    </div>
  )
}

"use client"

import { useState } from "react"
import Image from "next/image"
import { SquareCell } from "./SquareCell"
import type { SquaresState, SquaresPlayer } from "@/lib/squaresTypes"

interface SquaresGridProps {
  state: SquaresState
  onCellClick?: (row: number, col: number) => void
  onEmptyCellClick?: () => void
  interactive?: boolean
  claimingPlayerId?: string
}

export function SquaresGrid({ state, onCellClick, onEmptyCellClick, interactive, claimingPlayerId }: SquaresGridProps) {
  const { board, players, colNumbers, rowNumbers, orientation, winners } = state
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

  const colTeam = orientation === "patriots-cols" ? "patriots" : "seahawks"
  const rowTeam = orientation === "patriots-cols" ? "seahawks" : "patriots"
  const colLabel = orientation === "patriots-cols" ? "PATRIOTS" : "SEAHAWKS"
  const rowLabel = orientation === "patriots-cols" ? "SEAHAWKS" : "PATRIOTS"
  const colLogo = `/images/${colTeam}_logo.png`
  const rowLogo = `/images/${rowTeam}_logo.png`

  const playerMap = new Map<string, SquaresPlayer>()
  for (const p of players) playerMap.set(p.id, p)

  // Build winner map: row-col key -> checkpoint label
  const winnerMap = new Map<string, string>()
  for (const w of winners) {
    if (!colNumbers || !rowNumbers) continue
    let winCol: number
    let winRow: number
    if (orientation === "patriots-cols") {
      winCol = colNumbers.indexOf(w.patriotsDigit)
      winRow = rowNumbers.indexOf(w.seahawksDigit)
    } else {
      winCol = colNumbers.indexOf(w.seahawksDigit)
      winRow = rowNumbers.indexOf(w.patriotsDigit)
    }
    winnerMap.set(`${winRow}-${winCol}`, w.checkpoint)
  }

  const handleCellClick = (row: number, col: number, owner: SquaresPlayer | null) => {
    if (onCellClick) {
      onCellClick(row, col)
      return
    }
    if (!owner) {
      if (onEmptyCellClick) onEmptyCellClick()
      return
    }
    setSelectedPlayerId((prev) => prev === owner.id ? null : owner.id)
  }

  return (
    <div className="sq-grid-wrapper">
      {/* Column team header */}
      <div className="sq-col-header">
        {/* <div className="sq-corner" /> */}
        <div className="sq-col-banner">
          <Image src="/images/seahawks_banner.jpg" alt={colLabel} width={606} height={60} className="sq-banner-img" />
        </div>
      </div>

      <div className="sq-grid-body">
        {/* Row team header */}
        <div className="sq-row-header">
          <div className="sq-row-banner">
            <Image src="/images/patriots_banner.jpg" alt={rowLabel} width={60} height={606} className="sq-banner-img-vertical" />
          </div>
        </div>

        <div className="sq-grid-inner">
          {/* Column numbers row */}
          <div className="sq-numbers-row">
            <div className="sq-number-corner" />
            {Array.from({ length: 10 }).map((_, c) => (
              <div key={c} className="sq-number-cell">
                {colNumbers ? colNumbers[c] : "?"}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {Array.from({ length: 10 }).map((_, r) => (
            <div key={r} className="sq-row">
              <div className="sq-number-cell">
                {rowNumbers ? rowNumbers[r] : "?"}
              </div>
              {Array.from({ length: 10 }).map((_, c) => {
                const sq = board.find((s) => s.row === r && s.col === c)
                const owner = sq?.ownerId ? playerMap.get(sq.ownerId) ?? null : null
                const winLabel = winnerMap.get(`${r}-${c}`) ?? null
                const isHighlighted = owner !== null && (owner.id === selectedPlayerId || owner.id === claimingPlayerId)
                return (
                  <SquareCell
                    key={`${r}-${c}`}
                    owner={owner}
                    winnerLabel={winLabel}
                    interactive={interactive || !!onEmptyCellClick}
                    highlighted={isHighlighted}
                    onClick={() => handleCellClick(r, c, owner)}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

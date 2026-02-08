"use client"

import Image from "next/image"
import { SquareCell } from "./SquareCell"
import type { SquaresState, SquaresPlayer } from "@/lib/squaresTypes"

interface SquaresGridProps {
  state: SquaresState
  onCellClick?: (row: number, col: number) => void
  interactive?: boolean
}

export function SquaresGrid({ state, onCellClick, interactive }: SquaresGridProps) {
  const { board, players, colNumbers, rowNumbers, orientation, winners } = state

  const colTeam = orientation === "patriots-cols" ? "patriots" : "seahawks"
  const rowTeam = orientation === "patriots-cols" ? "seahawks" : "patriots"
  const colLabel = orientation === "patriots-cols" ? "PATRIOTS" : "SEAHAWKS"
  const rowLabel = orientation === "patriots-cols" ? "SEAHAWKS" : "PATRIOTS"
  const colLogo = `/images/${colTeam}.png`
  const rowLogo = `/images/${rowTeam}.png`

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

  return (
    <div className="sq-grid-wrapper">
      {/* Column team header */}
      <div className="sq-col-header">
        <div className="sq-corner" />
        <div className="sq-team-label">
          <Image src={colLogo} alt={colLabel} width={32} height={32} className="sq-team-logo" />
          <span>{colLabel}</span>
        </div>
      </div>

      <div className="sq-grid-body">
        {/* Row team header */}
        <div className="sq-row-header">
          <div className="sq-team-label sq-team-label-vertical">
            <Image src={rowLogo} alt={rowLabel} width={32} height={32} className="sq-team-logo" />
            <span>{rowLabel}</span>
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
                return (
                  <SquareCell
                    key={`${r}-${c}`}
                    owner={owner}
                    winnerLabel={winLabel}
                    interactive={interactive}
                    onClick={onCellClick ? () => onCellClick(r, c) : undefined}
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

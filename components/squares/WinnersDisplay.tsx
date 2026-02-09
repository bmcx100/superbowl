"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSquare, recordWinner, clearWinner } from "@/lib/squaresStore"
import type { SquaresState } from "@/lib/squaresTypes"

interface WinnersDisplayProps {
  state: SquaresState
  onUpdate?: () => void
}

const CHECKPOINTS: ("Q1" | "Q2" | "Q3" | "Final")[] = ["Q1", "Q2", "Q3", "Final"]

function lookupWinner(state: SquaresState, patriotsScore: number, seahawksScore: number) {
  if (!state.colNumbers || !state.rowNumbers) return { col: null, row: null, winner: null }

  const pDigit = patriotsScore % 10
  const sDigit = seahawksScore % 10

  // Patriots last digit → row, Seahawks last digit → column
  const rowIndex = state.rowNumbers.indexOf(pDigit)
  const colIndex = state.colNumbers.indexOf(sDigit)

  const sq = getSquare(state, rowIndex, colIndex)
  const player = sq?.ownerId
    ? state.players.find((p) => p.id === sq.ownerId) ?? null
    : null

  return {
    col: colIndex,
    row: rowIndex,
    winner: player ? player.name : (sq?.ownerId === null ? "Unclaimed" : null),
  }
}

export function WinnersDisplay({ state, onUpdate }: WinnersDisplayProps) {
  const [scores, setScores] = useState<Record<string, { patriots: string; seahawks: string }>>(() => {
    const initial: Record<string, { patriots: string; seahawks: string }> = {}
    for (const w of state.winners) {
      initial[w.checkpoint] = {
        patriots: String(w.patriotsScore),
        seahawks: String(w.seahawksScore),
      }
    }
    return initial
  })

  const getScore = (cp: string) => scores[cp] ?? { patriots: "", seahawks: "" }
  const numbersReady = state.colNumbers !== null && state.rowNumbers !== null

  return (
    <div className="sq-winners">
      <table className="sq-winners-table">
        <thead>
          <tr>
            <th>Checkpoint</th>
            <th>Patriots</th>
            <th>Seahawks</th>
            <th>Row #</th>
            <th>Col #</th>
            <th>Winner</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {CHECKPOINTS.map((cp) => {
            const s = getScore(cp)
            const pScore = parseInt(s.patriots)
            const sScore = parseInt(s.seahawks)
            const hasScores = !isNaN(pScore) && !isNaN(sScore)
            const result = hasScores && numbersReady
              ? lookupWinner(state, pScore, sScore)
              : null

            return (
              <tr key={cp}>
                <td className="sq-winners-checkpoint">{cp}</td>
                <td>
                  <Input
                    className="sq-winners-score-input"
                    type="number"
                    placeholder="—"
                    value={s.patriots}
                    onChange={(e) => setScores({ ...scores, [cp]: { ...s, patriots: e.target.value } })}
                  />
                </td>
                <td>
                  <Input
                    className="sq-winners-score-input"
                    type="number"
                    placeholder="—"
                    value={s.seahawks}
                    onChange={(e) => setScores({ ...scores, [cp]: { ...s, seahawks: e.target.value } })}
                  />
                </td>
                <td className="sq-winners-digit">
                  {hasScores ? pScore % 10 : "—"}
                </td>
                <td className="sq-winners-digit">
                  {hasScores ? sScore % 10 : "—"}
                </td>
                <td className="sq-winners-name">
                  {result ? (result.winner ?? "—") : "—"}
                </td>
                <td>
                  {state.winners.some((w) => w.checkpoint === cp) ? (
                    <Button
                      variant="outline"
                      className="sq-winners-save-btn"
                      onClick={() => {
                        clearWinner(cp)
                        onUpdate?.()
                      }}
                    >
                      Reset
                    </Button>
                  ) : (
                    hasScores && result && result.winner && result.winner !== "Unclaimed" && (
                      <Button
                        className="sq-winners-save-btn"
                        onClick={() => {
                          recordWinner(cp, pScore, sScore)
                          onUpdate?.()
                        }}
                      >
                        Save
                      </Button>
                    )
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {!numbersReady && (
        <p className="sq-admin-hint">Numbers must be randomized before winners can be computed.</p>
      )}
    </div>
  )
}

"use client"

import type { WinnerRecord } from "@/lib/squaresTypes"

interface WinnersDisplayProps {
  winners: WinnerRecord[]
}

const CHECKPOINTS: ("Q1" | "Q2" | "Q3" | "Final")[] = ["Q1", "Q2", "Q3", "Final"]

export function WinnersDisplay({ winners }: WinnersDisplayProps) {
  const winnerMap = new Map<string, WinnerRecord>()
  for (const w of winners) winnerMap.set(w.checkpoint, w)

  return (
    <div className="sq-winners">
      <h3 className="sq-winners-title">Winners</h3>
      <table className="sq-winners-table">
        <thead>
          <tr>
            <th>Checkpoint</th>
            <th>Score</th>
            <th>Winner</th>
          </tr>
        </thead>
        <tbody>
          {CHECKPOINTS.map((cp) => {
            const w = winnerMap.get(cp)
            return (
              <tr key={cp}>
                <td className="sq-winners-checkpoint">{cp}</td>
                <td>
                  {w
                    ? `Patriots ${w.patriotsScore} – Seahawks ${w.seahawksScore}`
                    : "—"}
                </td>
                <td className="sq-winners-name">
                  {w ? (w.winningPlayerName ?? "Unclaimed") : "—"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

"use client"

import type { LeaderboardEntry } from "@/lib/store"

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export function Leaderboard({ entries }: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <p className="leaderboard-empty">
        No scores yet &mdash; results will appear once props are scored.
      </p>
    )
  }

  return (
    <div className="leaderboard-table-wrapper">
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const podium = i < 3 ? `leaderboard-top${i + 1}` : ""
            return (
              <tr key={entry.name} className={podium}>
                <td className="leaderboard-rank">{i + 1}</td>
                <td className="leaderboard-name">{entry.name}</td>
                <td>{entry.correct}/{entry.scored}</td>
                <td>
                  {entry.scored > 0
                    ? `${Math.round(entry.accuracy * 100)}%`
                    : "\u2013"}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

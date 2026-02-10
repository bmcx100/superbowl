"use client"

import { useState, Fragment } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { getState } from "@/lib/store"
import type { LeaderboardEntry } from "@/lib/store"
import type { Prop } from "@/lib/types"

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (entries.length === 0) {
    return (
      <p className="leaderboard-empty">
        No scores yet &mdash; results will appear once props are scored.
      </p>
    )
  }

  // Compute tied ranks and group positions
  const ranks: number[] = []
  const groups: number[] = []
  let groupNum = 0
  for (let i = 0; i < entries.length; i++) {
    if (i === 0 || entries[i].correct !== entries[i - 1].correct) {
      ranks.push(i + 1)
      groupNum++
    } else {
      ranks.push(ranks[i - 1])
    }
    groups.push(groupNum)
  }

  const getPodiumClass = (group: number) => {
    if (group === 1) return "leaderboard-top1"
    if (group === 2) return "leaderboard-top2"
    if (group === 3) return "leaderboard-top3"
    return ""
  }

  const handleRowClick = (id: string) => {
    setExpandedId((prev) => prev === id ? null : id)
  }

  const state = getState()
  const sortedProps = [...state.props].sort((a, b) => a.order - b.order)
  const total = state.friends.length

  const pickPcts = new Map<string, { a: number; b: number }>()
  for (const prop of state.props) {
    let aCount = 0
    let bCount = 0
    for (const f of state.friends) {
      if (f.picks[prop.id] === "A") aCount++
      else if (f.picks[prop.id] === "B") bCount++
    }
    pickPcts.set(prop.id, {
      a: total > 0 ? Math.round((aCount / total) * 100) : 0,
      b: total > 0 ? Math.round((bCount / total) * 100) : 0,
    })
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
            const rank = ranks[i]
            const podium = getPodiumClass(groups[i])
            const isExpanded = expandedId === entry.id
            const friend = state.friends.find((f) => f.id === entry.id)

            return (
              <Fragment key={entry.id}>
                <tr
                  className={`${podium} leaderboard-clickable`}
                  onClick={() => handleRowClick(entry.id)}
                >
                  <td className="leaderboard-rank">{rank}</td>
                  <td className="leaderboard-name">
                    {entry.name}
                    {isExpanded ? <ChevronUp size={16} className="leaderboard-chevron" /> : <ChevronDown size={16} className="leaderboard-chevron" />}
                  </td>
                  <td>{entry.correct}/{entry.scored}</td>
                  <td>
                    {entry.scored > 0
                      ? `${Math.round(entry.accuracy * 100)}%`
                      : "\u2013"}
                  </td>
                </tr>
                {isExpanded && friend && (
                  <tr key={`${entry.id}-picks`} className="leaderboard-picks-row">
                    <td colSpan={4}>
                      <div className="leaderboard-picks">
                        {sortedProps.map((prop: Prop, pi: number) => {
                          const pick = friend.picks[prop.id]
                          const correct = prop.correctAnswer !== null && pick === prop.correctAnswer
                          const wrong = prop.correctAnswer !== null && pick !== undefined && pick !== prop.correctAnswer
                          const pcts = pickPcts.get(prop.id)
                          const pct = pick === "A" ? pcts?.a : pick === "B" ? pcts?.b : null
                          return (
                            <div key={prop.id} className="leaderboard-pick-item">
                              <span className="leaderboard-pick-num">{pi + 1}.</span>
                              <span className="leaderboard-pick-question">{prop.question}</span>
                              <span className={`leaderboard-pick-answer ${correct ? "leaderboard-pick-correct" : ""} ${wrong ? "leaderboard-pick-wrong" : ""}`}>
                                {pick === "A" ? prop.optionA : pick === "B" ? prop.optionB : "—"}
                                {pct !== null && pct !== undefined && <span className="leaderboard-pick-pct">{pct}%</span>}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

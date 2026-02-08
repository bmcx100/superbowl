"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Leaderboard } from "@/components/Leaderboard"
import { getLeaderboard } from "@/lib/store"
import type { LeaderboardEntry } from "@/lib/store"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    setLeaderboard(getLeaderboard())
  }, [])

  return (
    <div className="page-root">
      <section className="leaderboard-section">
        <h2 className="leaderboard-title">Leaderboard</h2>
        <Leaderboard entries={leaderboard} />
      </section>

      <Footer />
    </div>
  )
}

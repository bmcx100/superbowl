"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { SquaresGrid } from "@/components/squares/SquaresGrid"
import { WinnersDisplay } from "@/components/squares/WinnersDisplay"
import { PlayerSelector } from "@/components/squares/PlayerSelector"
import { getSquaresState, getTotalClaimed } from "@/lib/squaresStore"
import type { SquaresState } from "@/lib/squaresTypes"

export default function SquaresPage() {
  const [state, setState] = useState<SquaresState | null>(null)
  const [showPlayers, setShowPlayers] = useState(false)

  useEffect(() => {
    setState(getSquaresState())
  }, [])

  if (!state) return null

  const claimed = getTotalClaimed(state)

  return (
    <div className="page-root">
      <section className="squares-page">
        <h1 className="squares-page-title">Football Squares</h1>

        {/* Info bar */}
        <div className="sq-info-bar">
          <span className="sq-info-item">{claimed} / 100 squares claimed</span>
          <span className="sq-info-item">
            {state.locked ? "Board is locked" : "Board is open"}
          </span>
          {!state.locked && (
            <Button
              className="sq-claim-btn"
              onClick={() => setShowPlayers(!showPlayers)}
            >
              {showPlayers ? "Hide Players" : "Claim Squares →"}
            </Button>
          )}
        </div>

        {/* Player selection */}
        {showPlayers && !state.locked && (
          <PlayerSelector state={state} />
        )}

        {/* Grid */}
        <SquaresGrid state={state} />

        {/* Winners */}
        <WinnersDisplay winners={state.winners} />
      </section>
      <Footer />
    </div>
  )
}

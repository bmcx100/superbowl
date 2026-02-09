"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { SquaresGrid } from "@/components/squares/SquaresGrid"
import { WinnersDisplay } from "@/components/squares/WinnersDisplay"
import { PlayerSelector } from "@/components/squares/PlayerSelector"
import { getSquaresState } from "@/lib/squaresStore"
import type { SquaresState } from "@/lib/squaresTypes"

export default function SquaresPage() {
  const [state, setState] = useState<SquaresState | null>(null)
  const [showPlayers, setShowPlayers] = useState(false)

  useEffect(() => {
    setState(getSquaresState())
  }, [])

  if (!state) return null

  const handleEmptyCellClick = () => {
    if (state.locked) return
    setShowPlayers(true)
  }

  return (
    <div className="page-root">
      <section className="squares-page">
        {/* Player selection */}
        {showPlayers && !state.locked && (
          <PlayerSelector state={state} onClose={() => setShowPlayers(false)} />
        )}

        {/* Grid */}
        <SquaresGrid state={state} onEmptyCellClick={handleEmptyCellClick} />

        {/* Winners */}
        <WinnersDisplay winners={state.winners} />
      </section>
      <Footer />
    </div>
  )
}

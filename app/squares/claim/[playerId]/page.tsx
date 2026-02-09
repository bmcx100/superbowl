"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { SquaresGrid } from "@/components/squares/SquaresGrid"
import {
  getSquaresState,
  claimSquare,
  unclaimSquare,
  getPlayerLimit,
  getPlayerClaimedCount,
  canPlayerClaim,
} from "@/lib/squaresStore"
import { getState } from "@/lib/store"
import { getContrastColor } from "@/lib/squaresColors"
import type { SquaresState, SquaresPlayer } from "@/lib/squaresTypes"

export default function ClaimPage() {
  const params = useParams()
  const router = useRouter()
  const playerId = params.playerId as string

  const [state, setState] = useState<SquaresState | null>(null)
  const [player, setPlayer] = useState<SquaresPlayer | null>(null)

  const loadState = useCallback(() => {
    const s = getSquaresState()
    setState(s)
    const p = s.players.find((pl) => pl.id === playerId) ?? null
    if (!p) {
      router.push("/squares")
      return
    }
    setPlayer(p)
  }, [playerId, router])

  useEffect(() => {
    loadState()
  }, [loadState])

  const handleCellClick = (row: number, col: number) => {
    if (!state || !player) return
    if (state.locked) return

    const sq = state.board.find((s) => s.row === row && s.col === col)
    if (!sq) return

    if (sq.ownerId === playerId) {
      // Unclaim own square
      unclaimSquare(playerId, row, col)
    } else if (sq.ownerId === null) {
      if (!canPlayerClaim(state, playerId)) return
      claimSquare(playerId, row, col)
    }
    // If owned by another player, do nothing

    loadState()
  }

  if (!state || !player) return null

  const limit = getPlayerLimit(state, playerId)
  const claimed = getPlayerClaimedCount(state, playerId)

  const handleSubmit = () => {
    const appState = getState()
    const friend = appState.friends.find((f) => f.name.toLowerCase() === player.name.toLowerCase())
    if (friend) {
      const allPicked = appState.props.every((p) => friend.picks[p.id] !== undefined)
      if (allPicked) {
        router.push("/")
        return
      }
    }
    router.back()
  }

  return (
    <div className="page-root">
      <section className="squares-page">
        <div className="sq-claim-info">
          <div
            className="sq-claim-color"
            style={{ backgroundColor: player.color, color: getContrastColor(player.color) }}
          >
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div className="sq-claim-details">
            <h1 className="sq-claim-name">Claiming for: {player.name}</h1>
            <p className="sq-claim-count">Claimed: {claimed} / {limit}</p>
          </div>
          <Button className="picks-action-btn" onClick={handleSubmit}>
            SUBMIT
          </Button>
        </div>

        <SquaresGrid
          state={state}
          interactive
          onCellClick={handleCellClick}
          claimingPlayerId={playerId}
        />
      </section>
      <Footer />
    </div>
  )
}

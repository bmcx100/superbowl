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
  autoFillPlayer,
} from "@/lib/squaresStore"
import { getState } from "@/lib/store"
import { getContrastColor, getPlayerLabel } from "@/lib/squaresColors"
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
      unclaimSquare(playerId, row, col)
    } else if (sq.ownerId === null) {
      if (!canPlayerClaim(state, playerId)) return
      claimSquare(playerId, row, col)
    }

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
    router.push("/squares")
  }

  const handleRandom = () => {
    autoFillPlayer(playerId)
    loadState()
  }

  return (
    <div className="page-root">
      <div className="picks-page">
        <div className="picks-divider-top" />
        <div className="sq-claim-top-row">
          <button className="picks-back" onClick={() => router.push("/squares")}>
            <ArrowLeft size={28} />
            <span>Back</span>
          </button>
          <div className="sq-claim-progress-inline">
            <div className="picks-progress-bar">
              <div
                className="picks-progress-fill"
                style={{ width: `${limit > 0 ? (claimed / limit) * 100 : 0}%` }}
              />
            </div>
            <span className="picks-progress-text">
              {claimed} / {limit}
            </span>
          </div>
        </div>

        <div className="sq-claim-name-actions">
          <div className="sq-claim-name-row">
            <div
              className="sq-claim-color"
              style={{ backgroundColor: player.color, color: getContrastColor(player.color) }}
            >
              {getPlayerLabel(state.players, player.id)}
            </div>
            <div className="sq-claim-name-text">
              <h1 className="picks-friend-name">{player.name}</h1>
              <p className="picks-subtitle">Claiming squares</p>
            </div>
          </div>
          <div className="sq-claim-actions">
            <Button
              variant="outline"
              className="picks-action-btn picks-action-btn-secondary"
              onClick={handleRandom}
            >
              RANDOM
            </Button>
            <Button className="picks-action-btn" onClick={handleSubmit}>
              SUBMIT
            </Button>
          </div>
        </div>

        <SquaresGrid
          state={state}
          interactive
          onCellClick={handleCellClick}
          claimingPlayerId={playerId}
        />
      </div>

      <Footer />
    </div>
  )
}

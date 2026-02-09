"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LockOpen } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { SquaresGrid } from "@/components/squares/SquaresGrid"
import { WinnersDisplay } from "@/components/squares/WinnersDisplay"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import {
  getSquaresState,
  getPlayerLimit,
  getPlayerClaimedCount,
  getUnclaimedCount,
  lockBoard,
} from "@/lib/squaresStore"
import { getContrastColor } from "@/lib/squaresColors"
import type { SquaresState, SquaresPlayer } from "@/lib/squaresTypes"

export default function SquaresPage() {
  const router = useRouter()
  const [state, setState] = useState<SquaresState | null>(null)
  const [confirmPlayer, setConfirmPlayer] = useState<SquaresPlayer | null>(null)

  useEffect(() => {
    setState(getSquaresState())
  }, [])

  if (!state) return null

  const allFull = !state.locked && getUnclaimedCount(state) === 0

  const handleLock = () => {
    lockBoard()
    setState(getSquaresState())
  }

  const handlePlayerClick = (player: SquaresPlayer) => {
    if (state.locked) return
    const limit = getPlayerLimit(state, player.id)
    const claimed = getPlayerClaimedCount(state, player.id)
    if (claimed >= limit) {
      setConfirmPlayer(player)
    } else {
      router.push(`/squares/claim/${player.id}`)
    }
  }

  return (
    <div className="page-root">
      <section className="friends-section">
        <div className="friends-header">
          <h2 className="friends-title">Super Bowl LX Squares</h2>
        </div>

        {allFull && (
          <div className="picks-complete-banner">
            <LockOpen size={20} />
            <span>All squares claimed! Ready to lock?</span>
            <Button className="picks-action-btn" onClick={handleLock}>
              Lock Board
            </Button>
          </div>
        )}

        {state.locked ? (
          <div className="picks-locked-view">
            <Tabs defaultValue="squares" className="picks-locked-tabs">
              <TabsList className="picks-locked-tabs-list">
                <TabsTrigger value="squares">Squares</TabsTrigger>
                <TabsTrigger value="winners">Winners</TabsTrigger>
              </TabsList>

              <TabsContent value="squares">
                <SquaresGrid state={state} />
              </TabsContent>

              <TabsContent value="winners">
                <WinnersDisplay winners={state.winners} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="friend-grid">
            {state.players.map((player) => {
              const limit = getPlayerLimit(state, player.id)
              const claimed = getPlayerClaimedCount(state, player.id)
              const full = claimed >= limit

              let status: "complete" | "in-progress" | "not-started"
              if (full) status = "complete"
              else if (claimed > 0) status = "in-progress"
              else status = "not-started"

              const statusLabel = full
                ? "Full"
                : claimed > 0
                  ? `${claimed} / ${limit}`
                  : "Not Started"

              return (
                <button
                  key={player.id}
                  className="friend-card"
                  onClick={() => handlePlayerClick(player)}
                >
                  <div className="sq-card-swatch" style={{ backgroundColor: player.color, color: getContrastColor(player.color) }}>
                    {player.initials ?? player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="friend-card-name">{player.name}</span>
                  <Badge className={`friend-badge friend-badge-${status}`}>
                    {statusLabel}
                  </Badge>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={confirmPlayer !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmPlayer(null)
        }}
        title={confirmPlayer ? `${confirmPlayer.name}'s squares are full` : ""}
        description={
          confirmPlayer
            ? `${confirmPlayer.name}'s squares are already full. Do you want to review them?`
            : ""
        }
        confirmLabel="Continue"
        onConfirm={() => {
          if (confirmPlayer) router.push(`/squares/claim/${confirmPlayer.id}`)
        }}
      />

      <Footer />
    </div>
  )
}

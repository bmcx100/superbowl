"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, LockOpen } from "lucide-react"
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
  randomizeRemaining,
} from "@/lib/squaresStore"
import { getContrastColor, getUniqueLabels } from "@/lib/squaresColors"
import type { SquaresState, SquaresPlayer } from "@/lib/squaresTypes"

export default function SquaresPage() {
  const router = useRouter()
  const [state, setState] = useState<SquaresState | null>(null)
  const [confirmPlayer, setConfirmPlayer] = useState<SquaresPlayer | null>(null)

  const refresh = useCallback(() => setState(getSquaresState()), [])

  useEffect(() => {
    refresh()
    const onFocus = () => refresh()
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [refresh])

  if (!state) return null

  const unclaimed = getUnclaimedCount(state)
  const labelMap = getUniqueLabels(state.players)
  const allFull = !state.locked && unclaimed === 0
  const allPlayersFull = !state.locked && !allFull && state.players.length > 0 && state.players.every(
    (p) => getPlayerClaimedCount(state, p.id) >= getPlayerLimit(state, p.id)
  )

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

        {allPlayersFull && (
          <div className="picks-complete-banner">
            <span className="picks-banner-text">
              <LockOpen size={20} />
              <span className="sq-remaining-msg">
                <span className="sq-remaining-count">{unclaimed} Squares Remaining</span>
                <span className="sq-remaining-sub">Randomly assign them or go to admin for manual entry</span>
              </span>
            </span>
            <Button className="picks-action-btn" onClick={() => { randomizeRemaining(); refresh() }}>
              Randomize Remaining
            </Button>
          </div>
        )}

        {allFull && (
          <div className="picks-complete-banner">
            <span className="picks-banner-text">
              <LockOpen size={20} />
              All squares claimed! Ready to lock?
            </span>
            <Button className="picks-action-btn" onClick={handleLock}>
              Lock Board
            </Button>
          </div>
        )}

        {!state.locked && !allFull && !allPlayersFull && state.players.length > 0 && (
          <p className="picks-instruction">Tap your name to start claiming squares</p>
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
                <WinnersDisplay state={state} onUpdate={refresh} />
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
                    {labelMap.get(player.id) ?? player.name.charAt(0).toUpperCase()}
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

      <div className="page-back-row">
        <button className="picks-back" onClick={() => router.push("/")}>
          <ArrowLeft size={22} />
          <span>Back</span>
        </button>
      </div>

      <Footer />
    </div>
  )
}

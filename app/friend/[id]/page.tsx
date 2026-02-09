"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getState, setPick, randomizePicks } from "@/lib/store"
import { getSquaresState, getPlayerLimit, getPlayerClaimedCount } from "@/lib/squaresStore"
import { PropQuestion } from "@/components/PropQuestion"
import { Footer } from "@/components/footer"
import type { Friend, Prop } from "@/lib/types"

export default function FriendPicksPage() {
  const params = useParams()
  const router = useRouter()
  const friendId = params.id as string

  const [friend, setFriend] = useState<Friend | null>(null)
  const [props, setProps] = useState<Prop[]>([])
  const [picks, setPicks] = useState<Record<string, "A" | "B">>({})
  const [squaresPlayerId, setSquaresPlayerId] = useState<string | null>(null)
  const [squaresFull, setSquaresFull] = useState(false)
  const [locked, setLocked] = useState(false)

  useEffect(() => {
    const state = getState()
    const f = state.friends.find((fr) => fr.id === friendId)
    if (!f) {
      router.push("/picks")
      return
    }
    if (state.propsLocked) {
      setLocked(true)
    }
    setFriend(f)
    setPicks({ ...f.picks })
    setProps([...state.props].sort((a, b) => a.order - b.order))
    const sqState = getSquaresState()
    const sqPlayer = sqState.players.find((p) => p.name.toLowerCase() === f.name.toLowerCase())
    if (sqPlayer) {
      setSquaresPlayerId(sqPlayer.id)
      const limit = getPlayerLimit(sqState, sqPlayer.id)
      const claimed = getPlayerClaimedCount(sqState, sqPlayer.id)
      setSquaresFull(claimed >= limit)
    }
  }, [friendId, router])

  const handlePick = useCallback(
    (propId: string, value: "A" | "B") => {
      if (locked) return
      setPick(friendId, propId, value)
      setPicks((prev) => ({ ...prev, [propId]: value }))
    },
    [friendId, locked]
  )

  if (!friend) return null

  const answeredCount = Object.keys(picks).length
  const totalCount = props.length

  const handleRandom = () => {
    if (locked) return
    randomizePicks(friendId)
    const state = getState()
    const f = state.friends.find((fr) => fr.id === friendId)
    if (f) setPicks({ ...f.picks })
  }

  return (
    <div className="page-root">
      <div className="picks-page">
        <div className="picks-divider-top" />
        <div className="picks-header">
          <button className="picks-back" onClick={() => router.push("/picks")}>
            <ArrowLeft size={28} />
            <span>Back</span>
          </button>
        </div>
        <div className="picks-name-row">
          <div className="picks-name-row-left">
            <h1 className="picks-friend-name">{friend.name}</h1>
            <p className="picks-subtitle">Making picks</p>
          </div>
          {!locked && (
            <Button
              variant="outline"
              className="picks-action-btn picks-action-btn-secondary"
              onClick={handleRandom}
            >
              RANDOM
            </Button>
          )}
        </div>

        <div className="picks-progress">
          <div className="picks-progress-bar">
            <div
              className="picks-progress-fill"
              style={{ width: `${totalCount > 0 ? (answeredCount / totalCount) * 100 : 0}%` }}
            />
          </div>
          <span className="picks-progress-text">
            {answeredCount} of {totalCount} answered
          </span>
        </div>

        <div className="picks-list">
          {props.map((prop, i) => (
            <PropQuestion
              key={prop.id}
              prop={prop}
              index={i}
              pick={picks[prop.id]}
              onPick={(value) => handlePick(prop.id, value)}
            />
          ))}
        </div>

        <div className="picks-submit-row">
          {squaresPlayerId && (
            <Button
              variant={squaresFull ? "outline" : "default"}
              className={squaresFull ? "picks-action-btn picks-action-btn-secondary" : "picks-action-btn"}
              onClick={() => router.push(`/squares/claim/${squaresPlayerId}`)}
            >
              {squaresFull ? "SQUARES" : "CLAIM SQUARES"}
            </Button>
          )}
          <Button className="picks-action-btn" onClick={() => router.push("/picks")}>
            SUBMIT PICKS
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

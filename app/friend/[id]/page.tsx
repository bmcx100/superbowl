"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getState, setPick } from "@/lib/store"
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

  useEffect(() => {
    const state = getState()
    const f = state.friends.find((fr) => fr.id === friendId)
    if (!f) {
      router.push("/picks")
      return
    }
    setFriend(f)
    setPicks({ ...f.picks })
    setProps([...state.props].sort((a, b) => a.order - b.order))
  }, [friendId, router])

  const handlePick = useCallback(
    (propId: string, value: "A" | "B") => {
      setPick(friendId, propId, value)
      setPicks((prev) => ({ ...prev, [propId]: value }))
    },
    [friendId]
  )

  if (!friend) return null

  const answeredCount = Object.keys(picks).length
  const totalCount = props.length

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
          <h1 className="picks-friend-name">{friend.name}</h1>
          <p className="picks-subtitle">Making picks</p>
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
          <Button className="cta-button" onClick={() => router.push("/picks")}>
            SUBMIT PICKS
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

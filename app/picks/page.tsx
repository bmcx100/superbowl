"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Lock, LockOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"
import { FriendCard } from "@/components/FriendCard"
import { Leaderboard } from "@/components/Leaderboard"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import {
  getState,
  areAllFriendsComplete,
  lockProps,
  unlockProps,
  setCorrectAnswer,
  getLeaderboard,
} from "@/lib/store"
import type { AppState, Friend, Prop } from "@/lib/types"

export default function PicksPage() {
  const router = useRouter()
  const [appState, setAppState] = useState<AppState | null>(null)
  const [confirmFriend, setConfirmFriend] = useState<Friend | null>(null)
  const [leaderboard, setLeaderboard] = useState(() => getLeaderboard())

  const refresh = () => {
    setAppState(getState())
    setLeaderboard(getLeaderboard())
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleFriendClick = (friend: Friend) => {
    if (!appState) return
    if (appState.propsLocked) return
    const pickCount = Object.keys(friend.picks).length
    if (pickCount >= appState.props.length) {
      setConfirmFriend(friend)
    } else {
      router.push(`/friend/${friend.id}`)
    }
  }

  const handleLock = () => {
    lockProps()
    refresh()
  }

  const handleUnlock = () => {
    unlockProps()
    refresh()
  }

  const handleScore = (propId: string, value: "A" | "B" | null) => {
    setCorrectAnswer(propId, value)
    refresh()
  }

  const allComplete = appState ? areAllFriendsComplete() : false
  const isLocked = appState?.propsLocked === true
  const sortedProps: Prop[] = appState
    ? [...appState.props].sort((a, b) => a.order - b.order)
    : []

  return (
    <div className="page-root">
      {appState && (
        <section className="friends-section">
          <div className="friends-header">
            <h2 className="friends-title">{appState.eventName}</h2>
          </div>

          {isLocked ? (
            <div className="picks-locked-view">
              <div className="picks-complete-banner">
                <Lock size={20} />
                <span>All picks are locked in!</span>
                <Button variant="outline" className="picks-action-btn picks-action-btn-secondary" onClick={handleUnlock}>
                  Unlock
                </Button>
              </div>

              <Tabs defaultValue="scoring" className="picks-locked-tabs">
                <TabsList className="picks-locked-tabs-list">
                  <TabsTrigger value="scoring">Scoring</TabsTrigger>
                  <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                </TabsList>

                <TabsContent value="scoring">
                  <div className="admin-scoring-list">
                    {sortedProps.map((prop, i) => (
                      <div key={prop.id} className="admin-scoring-row">
                        <div className="admin-scoring-info">
                          <span className="admin-prop-order">{i + 1}</span>
                          <span className="admin-prop-question">{prop.question}</span>
                        </div>
                        <div className="admin-scoring-buttons">
                          <Button
                            variant={prop.correctAnswer === "A" ? "default" : "outline"}
                            className={`admin-score-btn ${prop.correctAnswer === "A" ? "admin-score-active" : ""}`}
                            onClick={() => handleScore(prop.id, prop.correctAnswer === "A" ? null : "A")}
                          >
                            {prop.optionA}
                          </Button>
                          <Button
                            variant={prop.correctAnswer === "B" ? "default" : "outline"}
                            className={`admin-score-btn ${prop.correctAnswer === "B" ? "admin-score-active" : ""}`}
                            onClick={() => handleScore(prop.id, prop.correctAnswer === "B" ? null : "B")}
                          >
                            {prop.optionB}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="leaderboard">
                  <Leaderboard entries={leaderboard} />
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <>
              {allComplete && (
                <div className="picks-complete-banner">
                  <LockOpen size={20} />
                  <span>Everyone has picked! Ready to lock?</span>
                  <Button className="picks-action-btn" onClick={handleLock}>
                    Lock Picks
                  </Button>
                </div>
              )}

              <div className="friend-grid">
                {appState.friends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    totalProps={appState.props.length}
                    onClick={() => handleFriendClick(friend)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <ConfirmDialog
        open={confirmFriend !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmFriend(null)
        }}
        title={confirmFriend ? `${confirmFriend.name}'s picks are complete` : ""}
        description={
          confirmFriend
            ? `${confirmFriend.name}'s picks are already complete. Do you want to review/edit them?`
            : ""
        }
        confirmLabel="Continue"
        onConfirm={() => {
          if (confirmFriend) router.push(`/friend/${confirmFriend.id}`)
        }}
      />

      <Footer />
    </div>
  )
}

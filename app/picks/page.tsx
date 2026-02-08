"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { FriendCard } from "@/components/FriendCard"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { getState } from "@/lib/store"
import type { AppState, Friend } from "@/lib/types"

export default function PicksPage() {
  const router = useRouter()
  const [appState, setAppState] = useState<AppState | null>(null)
  const [confirmFriend, setConfirmFriend] = useState<Friend | null>(null)

  useEffect(() => {
    setAppState(getState())
  }, [])

  const handleFriendClick = (friend: Friend) => {
    if (!appState) return
    const pickCount = Object.keys(friend.picks).length
    if (pickCount >= appState.props.length) {
      setConfirmFriend(friend)
    } else {
      router.push(`/friend/${friend.id}`)
    }
  }

  return (
    <div className="page-root">
      {appState && (
        <section className="friends-section">
          <div className="friends-header">
            <h2 className="friends-title">{appState.eventName}</h2>
          </div>
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

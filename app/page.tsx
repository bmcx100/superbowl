"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { FriendCard } from "@/components/FriendCard"
import { Leaderboard } from "@/components/Leaderboard"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { getState, getLeaderboard } from "@/lib/store"
import type { AppState, Friend } from "@/lib/types"
import type { LeaderboardEntry } from "@/lib/store"

export default function Home() {
  const router = useRouter()
  const [appState, setAppState] = useState<AppState | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [confirmFriend, setConfirmFriend] = useState<Friend | null>(null)

  useEffect(() => {
    setAppState(getState())
    setLeaderboard(getLeaderboard())
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

  const scrollToFriends = () => {
    document.getElementById("friends")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToLeaderboard = () => {
    document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="page-root">

      <div className="splash-root">
        {/* Animated background layers */}
        <div className="splash-bg" />
        <div className="splash-radial" />
        <div className="splash-noise" />
        <div className="splash-vignette" />

        {/* Floating yard-line decorations */}
        <div className="yard-lines" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="yard-line" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>

        {/* Main content */}
        <main className="splash-content">
          {/* Top badge */}
          <div className="splash-badge">
            <span className="badge-text">SUPER BOWL LX</span>
            <span className="badge-divider" />
            <span className="badge-sub">PROP PICKS</span>
          </div>

          {/* Hero image area */}
          <div className="hero-section">
            <div className="hero-glow" />

            <div className="hero-image-wrapper">
              <Image
                src="/images/helmets.jpg"
                alt="Seattle Seahawks vs New England Patriots helmets at Levi's Stadium"
                width={900}
                height={506}
                priority
                className="hero-image"
              />
              <div className="hero-image-fade" />
            </div>

            {/* VS overlay */}
            <div className="vs-badge">
              <span>VS</span>
            </div>
          </div>

          {/* Team names */}
          <div className="matchup-bar">
            <div className="team team-left">
              <div className="team-city">SEATTLE</div>
              <div className="team-name seahawks-name">SEAHAWKS</div>
            </div>
            <div className="matchup-divider">
              <div className="divider-diamond" />
            </div>
            <div className="team team-right">
              <div className="team-city">NEW ENGLAND</div>
              <div className="team-name patriots-name">PATRIOTS</div>
            </div>
          </div>

          {/* Game info strip */}
          <div className="game-info">
            <div className="info-item">
              <span className="info-label">DATE</span>
              <span className="info-value">FEB 9, 2025</span>
            </div>
            <div className="info-sep" />
            <div className="info-item">
              <span className="info-label">VENUE</span>
              <span className="info-value">CAESARS SUPERDOME</span>
            </div>
            <div className="info-sep" />
            <div className="info-item">
              <span className="info-label">LOCATION</span>
              <span className="info-value">NEW ORLEANS, LA</span>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-area">
            <div className="cta-buttons">
              <Button className="cta-button" onClick={scrollToFriends}>
                MAKE YOUR PICKS
              </Button>
              <Button className="cta-button" onClick={scrollToLeaderboard}>
                LEADERBOARD
              </Button>
            </div>
            <p className="cta-sub">Free to play &bull; Bragging rights guaranteed</p>
          </div>
        </main>
      </div>

      {/* Friend selection grid */}
      {appState && (
        <section id="friends" className="friends-section">
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

      {/* Leaderboard */}
      {appState && (
        <section id="leaderboard" className="leaderboard-section">
          <h2 className="leaderboard-title">Leaderboard</h2>
          <Leaderboard entries={leaderboard} />
        </section>
      )}

      {/* Completion guard dialog */}
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

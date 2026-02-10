"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Settings, LockOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

function LockMockup() {
  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Props Page &mdash; Ready to Lock</div>
      <div className="htp-mock-lock-banner">
        <LockOpen size={18} className="htp-mock-lock-icon" />
        <span className="htp-mock-lock-text">Everyone has picked! Ready to lock?</span>
        <div className="htp-mock-lock-btn">Lock Picks</div>
      </div>
    </div>
  )
}

function FriendCardsMockup() {
  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Props Page</div>
      <div className="htp-mock-friends-grid">
        <div className="htp-mock-friend-card">
          <span className="htp-mock-friend-name">Mike</span>
          <span className="htp-mock-badge htp-mock-badge-complete">Complete</span>
        </div>
        <div className="htp-mock-friend-card htp-mock-friend-you">
          <span className="htp-mock-friend-name">Sarah</span>
          <span className="htp-mock-badge htp-mock-badge-progress">3 / 10</span>
        </div>
        <div className="htp-mock-friend-card">
          <span className="htp-mock-friend-name">Jake</span>
          <span className="htp-mock-badge htp-mock-badge-not-started">Not Started</span>
        </div>
        <div className="htp-mock-friend-card">
          <span className="htp-mock-friend-name">Emily</span>
          <span className="htp-mock-badge htp-mock-badge-not-started">Not Started</span>
        </div>
      </div>
    </div>
  )
}

function PickingMockup() {
  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Picking Screen</div>
      <div className="htp-mock-prop">
        <div className="htp-mock-header">
          <span className="htp-mock-num">1.</span>
          <span>Who will win Super Bowl LX?</span>
        </div>
        <div className="htp-mock-options">
          <div className="htp-mock-option htp-mock-selected">Seahawks</div>
          <div className="htp-mock-option">Patriots</div>
        </div>
      </div>
      <div className="htp-mock-prop">
        <div className="htp-mock-header">
          <span className="htp-mock-num">2.</span>
          <span>Will the National Anthem be over 2 minutes?</span>
        </div>
        <div className="htp-mock-options">
          <div className="htp-mock-option">Yes</div>
          <div className="htp-mock-option htp-mock-selected">No</div>
        </div>
      </div>
      <div className="htp-mock-prop htp-mock-unanswered">
        <div className="htp-mock-header">
          <span className="htp-mock-num">3.</span>
          <span>First team to score?</span>
        </div>
        <div className="htp-mock-options">
          <div className="htp-mock-option">Seahawks</div>
          <div className="htp-mock-option">Patriots</div>
        </div>
      </div>
    </div>
  )
}

function ScoringMockup() {
  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Admin &rarr; Scoring Tab</div>
      <div className="htp-mock-scoring-row">
        <div className="htp-mock-scoring-info">
          <span className="htp-mock-num">1.</span>
          <span>Who will win Super Bowl LX?</span>
        </div>
        <div className="htp-mock-scoring-btns">
          <div className="htp-mock-score-btn htp-mock-score-correct">Seahawks</div>
          <div className="htp-mock-score-btn">Patriots</div>
        </div>
      </div>
      <div className="htp-mock-scoring-row">
        <div className="htp-mock-scoring-info">
          <span className="htp-mock-num">2.</span>
          <span>Will the National Anthem be over 2 minutes?</span>
        </div>
        <div className="htp-mock-scoring-btns">
          <div className="htp-mock-score-btn">Yes</div>
          <div className="htp-mock-score-btn htp-mock-score-correct">No</div>
        </div>
      </div>
      <div className="htp-mock-scoring-row">
        <div className="htp-mock-scoring-info">
          <span className="htp-mock-num">3.</span>
          <span>First team to score?</span>
        </div>
        <div className="htp-mock-scoring-btns">
          <div className="htp-mock-score-btn">Seahawks</div>
          <div className="htp-mock-score-btn">Patriots</div>
        </div>
      </div>
    </div>
  )
}

function LeaderboardMockup() {
  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Leaderboard</div>
      <div className="htp-mock-lb">
        <div className="htp-mock-lb-header">
          <span>#</span>
          <span>Name</span>
          <span>Score</span>
          <span>Accuracy</span>
        </div>
        <div className="htp-mock-lb-row htp-mock-lb-gold">
          <span>1</span>
          <span>Mike</span>
          <span>8/10</span>
          <span>80%</span>
        </div>
        <div className="htp-mock-lb-row htp-mock-lb-silver">
          <span>1</span>
          <span>Sarah</span>
          <span>8/10</span>
          <span>80%</span>
        </div>
        <div className="htp-mock-lb-row htp-mock-lb-bronze">
          <span>3</span>
          <span>Jake</span>
          <span>7/10</span>
          <span>70%</span>
        </div>
        <div className="htp-mock-lb-row">
          <span>4</span>
          <span>Emily</span>
          <span>5/10</span>
          <span>50%</span>
        </div>
      </div>
    </div>
  )
}

export default function PropsHowToPlay() {
  const router = useRouter()

  return (
    <div className="page-root">
      <section className="htp-section">
        <button className="admin-back" onClick={() => router.back()}>
          <ArrowLeft size={28} />
          <span>Back</span>
        </button>

        <h1 className="htp-title">How To Play Props</h1>
        <p className="htp-subtitle">Pick winners. Talk trash. Have fun.</p>

        <div className="htp-steps">
          <div className="htp-step">
            <div className="htp-step-number">1</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Add Your Friends</h3>
              <p className="htp-step-desc">
                Tap the <Settings size={18} className="htp-gear-icon" /> gear
                icon in the top-right corner to open the Admin panel, then add
                everyone who wants to play. Each person gets their own pick sheet.
              </p>
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">2</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Pick Your Name</h3>
              <p className="htp-step-desc">
                Open the Props page and find your name. Tap it to start
                making your picks.
              </p>
              <FriendCardsMockup />
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">3</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Answer Each Question</h3>
              <p className="htp-step-desc">
                Choose Option A or Option B for every prop. You can change
                your mind anytime before picks are locked.
              </p>
              <PickingMockup />
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">4</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Lock It In</h3>
              <p className="htp-step-desc">
                Once everyone has finished picking, a banner appears on the
                Props page to lock picks. You can also lock from the Admin
                panel. No more changes after that!
              </p>
              <LockMockup />
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">5</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Score During the Game</h3>
              <p className="htp-step-desc">
                As the Super Bowl plays out, go to the Scoring tab in Admin
                and tap the correct answer for each prop. The leaderboard
                updates in real time.
              </p>
              <ScoringMockup />
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">6</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Crown the Winner</h3>
              <p className="htp-step-desc">
                Check the Leaderboard to see who got the most right.
                Tap any name to see exactly what they picked and how the
                group voted.
              </p>
              <LeaderboardMockup />
            </div>
          </div>
        </div>

        <div className="htp-cta">
          <Button className="cta-button" onClick={() => router.push("/picks")}>
            Go To Props
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

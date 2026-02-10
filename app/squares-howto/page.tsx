"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Settings, LockOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

function PlayerCardsMockup() {
  const players = [
    { name: "Mike", initial: "M", color: "#4a90d9", status: "Full", badgeClass: "htp-mock-badge-complete", highlight: false },
    { name: "Sarah", initial: "S", color: "#8bc53f", status: "3 / 14", badgeClass: "htp-mock-badge-progress", highlight: true },
    { name: "Jake", initial: "J", color: "#e67e22", status: "Not Started", badgeClass: "htp-mock-badge-not-started", highlight: false },
    { name: "Emily", initial: "E", color: "#9b59b6", status: "Not Started", badgeClass: "htp-mock-badge-not-started", highlight: false },
  ]

  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Squares Page</div>
      <div className="htp-mock-friends-grid">
        {players.map((p) => (
          <div key={p.name} className={`htp-mock-friend-card ${p.highlight ? "htp-mock-friend-you" : ""}`}>
            <div className="htp-mock-swatch" style={{ backgroundColor: p.color }}>
              {p.initial}
            </div>
            <span className="htp-mock-friend-name">{p.name}</span>
            <span className={`htp-mock-badge ${p.badgeClass}`}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniGridMockup() {
  const colors = [
    [null, "#4a90d9", null, "#e67e22", null],
    ["#8bc53f", null, "#9b59b6", null, "#4a90d9"],
    [null, "#e67e22", "#8bc53f", null, null],
    ["#4a90d9", null, null, "#9b59b6", "#8bc53f"],
    [null, "#9b59b6", "#4a90d9", "#e67e22", null],
  ]
  const initials = [
    ["", "M", "", "J", ""],
    ["S", "", "E", "", "M"],
    ["", "J", "S", "", ""],
    ["M", "", "", "E", "S"],
    ["", "E", "M", "J", ""],
  ]

  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Claiming Screen</div>
      <div className="htp-mock-grid-progress">
        <span>8 / 14 claimed</span>
      </div>
      <div className="htp-mock-grid">
        {colors.map((row, ri) => (
          <div key={ri} className="htp-mock-grid-row">
            {row.map((color, ci) => (
              <div
                key={ci}
                className={`htp-mock-grid-cell ${!color ? "htp-mock-grid-cell-empty" : ""} ${ri === 1 && ci === 0 ? "htp-mock-grid-cell-glow" : ""}`}
                style={color ? { backgroundColor: color } : undefined}
              >
                {initials[ri][ci]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function LockBannerMockup() {
  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Squares Page &mdash; Ready to Lock</div>
      <div className="htp-mock-lock-banner">
        <LockOpen size={18} className="htp-mock-lock-icon" />
        <span className="htp-mock-lock-text">All squares claimed! Ready to lock?</span>
        <div className="htp-mock-lock-btn">Lock Board</div>
      </div>
    </div>
  )
}

function NumbersGridMockup() {
  const colNums = [3, 7, 1, 9, 0]
  const rowNums = [8, 2, 5, 1, 9]
  const cells = [
    ["#4a90d9", "#e67e22", null, "#8bc53f", null],
    [null, "#9b59b6", "#4a90d9", null, "#e67e22"],
    ["#8bc53f", null, null, "#9b59b6", "#4a90d9"],
    [null, "#4a90d9", "#e67e22", null, "#8bc53f"],
    ["#9b59b6", null, "#8bc53f", "#4a90d9", null],
  ]
  const inits = [
    ["M", "J", "", "S", ""],
    ["", "E", "M", "", "J"],
    ["S", "", "", "E", "M"],
    ["", "M", "J", "", "S"],
    ["E", "", "S", "M", ""],
  ]

  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Board with Numbers</div>
      <div className="htp-mock-grid-labeled">
        <div className="htp-mock-grid-team-top">SEAHAWKS &rarr;</div>
        <div className="htp-mock-grid-with-headers">
          <div className="htp-mock-grid-team-left">P<br/>A<br/>T<br/>S<br/>&darr;</div>
          <div>
            <div className="htp-mock-grid-row">
              <div className="htp-mock-grid-corner" />
              {colNums.map((n, i) => (
                <div key={i} className="htp-mock-grid-header">{n}</div>
              ))}
            </div>
            {cells.map((row, ri) => (
              <div key={ri} className="htp-mock-grid-row">
                <div className="htp-mock-grid-header">{rowNums[ri]}</div>
                {row.map((color, ci) => (
                  <div
                    key={ci}
                    className={`htp-mock-grid-cell ${!color ? "htp-mock-grid-cell-empty" : ""}`}
                    style={color ? { backgroundColor: color } : undefined}
                  >
                    {inits[ri][ci]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function WinnersTableMockup() {
  const rows = [
    { quarter: "Q1", sea: "7", ne: "3", digit_s: "7", digit_n: "3", winner: "Mike" },
    { quarter: "Q2", sea: "14", ne: "10", digit_s: "4", digit_n: "0", winner: "Sarah" },
    { quarter: "Q3", sea: "21", ne: "17", digit_s: "1", digit_n: "7", winner: "Jake" },
    { quarter: "Final", sea: "\u2014", ne: "\u2014", digit_s: "", digit_n: "", winner: "\u2014" },
  ]

  return (
    <div className="htp-mockup">
      <div className="htp-mockup-label">Winners</div>
      <div className="htp-mock-winners-table">
        <div className="htp-mock-winners-header">
          <span>Quarter</span>
          <span>SEA</span>
          <span>NE</span>
          <span>Last Digits</span>
          <span>Winner</span>
        </div>
        {rows.map((r) => (
          <div key={r.quarter} className={`htp-mock-winners-row ${r.winner !== "\u2014" ? "htp-mock-winners-row-scored" : ""}`}>
            <span className="htp-mock-winners-quarter">{r.quarter}</span>
            <span>{r.sea}</span>
            <span>{r.ne}</span>
            <span>
              {r.digit_s && r.digit_n ? (
                <>
                  <span className="htp-mock-digit-highlight">{r.digit_s}</span>
                  {" / "}
                  <span className="htp-mock-digit-highlight">{r.digit_n}</span>
                </>
              ) : "\u2014"}
            </span>
            <span className={r.winner !== "\u2014" ? "htp-mock-winners-name" : ""}>{r.winner}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SquaresHowToPlay() {
  const router = useRouter()

  return (
    <div className="page-root">
      <section className="htp-section">
        <button className="admin-back" onClick={() => router.back()}>
          <ArrowLeft size={28} />
          <span>Back</span>
        </button>

        <h1 className="htp-title">How To Play Squares</h1>
        <p className="htp-subtitle">Claim your squares. Watch the score. Win big.</p>

        <div className="htp-steps">
          <div className="htp-step">
            <div className="htp-step-number">1</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Add Players</h3>
              <p className="htp-step-desc">
                Tap the <Settings size={18} className="htp-gear-icon" /> gear
                icon in the top-right corner to open the Admin panel. Switch to
                Squares, then add everyone who wants to play. You can also
                import players directly from Props.
              </p>
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">2</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Pick Your Name</h3>
              <p className="htp-step-desc">
                Open the Squares page and find your name. Tap it to start
                claiming squares.
              </p>
              <PlayerCardsMockup />
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">3</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Claim Your Squares</h3>
              <p className="htp-step-desc">
                Tap empty squares on the 10x10 grid to claim them. Your squares
                light up in your color. You can also hit Random to auto-fill.
              </p>
              <MiniGridMockup />
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">4</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Lock the Board</h3>
              <p className="htp-step-desc">
                Once all 100 squares are claimed, a banner appears on the
                Squares page to lock the board. You can also lock from the
                Admin panel. When the board locks, the row and column numbers
                (0-9) are automatically randomized. These numbers determine
                which square wins at each quarter based on the last digit of
                each team's score.
              </p>
              <LockBannerMockup />
              <NumbersGridMockup />
            </div>
          </div>

          <div className="htp-step htp-step-with-mockup">
            <div className="htp-step-number">5</div>
            <div className="htp-step-content">
              <h3 className="htp-step-title">Watch & Win</h3>
              <p className="htp-step-desc">
                At the end of each quarter, check the last digit of each
                team's score. Find where the row and column meet on the
                grid — that square wins! Winners are recorded for Q1, Q2,
                Q3, and Final.
              </p>
              <WinnersTableMockup />
            </div>
          </div>
        </div>

        <div className="htp-cta">
          <Button className="cta-button" onClick={() => router.push("/squares")}>
            Go To Squares
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

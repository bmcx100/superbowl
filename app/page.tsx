"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="page-root">
      <Navbar />

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

          {/* SB Logo */}
          <div className="sb-logo-row">
            <Image
              src="/images/SB-LX1.webp"
              alt="Super Bowl LX Logo"
              width={180}
              height={135}
              className="sb-logo"
            />
          </div>

          {/* CTA */}
          <div className="cta-area">
            <Button className="cta-button">
              MAKE YOUR PICKS
            </Button>
            <p className="cta-sub">Free to play &bull; Bragging rights guaranteed</p>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

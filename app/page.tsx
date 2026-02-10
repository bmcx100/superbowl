"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"

export default function Home() {
  const router = useRouter()

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

          {/* CTA */}
          <div className="cta-area">
            <div className="cta-buttons">
              <Button className="cta-button" onClick={() => router.push("/picks")}>
                PROPS
              </Button>
              <Button className="cta-button" onClick={() => router.push("/squares")}>
                SQUARES
              </Button>
            </div>
            <p className="cta-heading">Select A Game</p>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

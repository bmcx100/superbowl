"use client"

import Image from "next/image"
import { useState } from "react"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>SUPER BOWL LX &bull; SEAHAWKS VS PATRIOTS &bull; FEB 9, 2025 &bull; CAESARS SUPERDOME &bull; NEW ORLEANS, LA &bull;&nbsp;</span>
          <span>SUPER BOWL LX &bull; SEAHAWKS VS PATRIOTS &bull; FEB 9, 2025 &bull; CAESARS SUPERDOME &bull; NEW ORLEANS, LA &bull;&nbsp;</span>
        </div>
      </div>

      <div className="nav-main">
        <div className="nav-inner">
          <div className="nav-brand">
            <Image
              src="/images/SB-LX1.webp"
              alt="Super Bowl LX"
              width={52}
              height={40}
              className="nav-logo"
            />
            <div className="nav-title-group">
              <span className="nav-title">PROP PICKS</span>
              <span className="nav-subtitle">SUPER BOWL LX</span>
            </div>
          </div>

          <div className="nav-links">
            <a href="#" className="nav-link nav-link-active">Home</a>
            <a href="#" className="nav-link">Props</a>
            <a href="#" className="nav-link">Leaderboard</a>
            <a href="#" className="nav-link">Rules</a>
          </div>

          <div className="nav-actions">
            <button className="nav-cta">
              Sign In
            </button>
          </div>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${mobileOpen ? "open" : ""}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>

        {mobileOpen && (
          <div className="nav-mobile-menu">
            <a href="#" className="nav-mobile-link nav-link-active">Home</a>
            <a href="#" className="nav-mobile-link">Props</a>
            <a href="#" className="nav-mobile-link">Leaderboard</a>
            <a href="#" className="nav-mobile-link">Rules</a>
            <button className="nav-mobile-cta">Sign In</button>
          </div>
        )}
      </div>
    </nav>
  )
}

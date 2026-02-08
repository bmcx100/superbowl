"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Settings } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

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
          <Link href="/" className="nav-brand">
            <Image
              src="/images/SB-LX1.webp"
              alt="Super Bowl LX"
              width={72}
              height={55}
              className="nav-logo"
            />
            <div className="nav-title-group">
              <span className="nav-title">PROP PICKS</span>
              <span className="nav-subtitle">SUPER BOWL LX</span>
            </div>
          </Link>

          <div className="nav-links">
            <Link href="/#friends" className="nav-link">Make Your Picks</Link>
            <Link href="/#leaderboard" className="nav-link">Leaderboard</Link>
          </div>

          <div className="nav-actions">
            <ThemeToggle />
            <Link href="/admin" className="nav-cta">
              <Settings size={22} />
              <span>Admin</span>
            </Link>
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
            <Link href="/#friends" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
              Make Your Picks
            </Link>
            <Link href="/#leaderboard" className="nav-mobile-link" onClick={() => setMobileOpen(false)}>
              Leaderboard
            </Link>
            <div className="nav-mobile-bottom">
              <Link href="/admin" className="nav-mobile-cta" onClick={() => setMobileOpen(false)}>
                Admin
              </Link>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

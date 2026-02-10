"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Home, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-ticker" aria-hidden="true">
        <div className="ticker-track">
          <span>SUPER BOWL LX &bull; SEAHAWKS VS PATRIOTS &bull; FEB 8, 2026 &bull; LEVI'S STADIUM &bull; SANTA CLARA, CA &bull;&nbsp;</span>
          <span>SUPER BOWL LX &bull; SEAHAWKS VS PATRIOTS &bull; FEB 8, 2026 &bull; LEVI'S STADIUM &bull; SANTA CLARA, CA &bull;&nbsp;</span>
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
              <span className="nav-title">PARTY PICKS</span>
              <span className="nav-subtitle">SUPER BOWL LX</span>
            </div>
          </Link>

          <div className="nav-actions">
            <Link href="/" className="nav-settings-icon" aria-label="Home">
              <Home size={26} />
            </Link>
            <Link href="/admin" className="nav-settings-icon" aria-label="Admin Settings">
              <Settings size={26} />
            </Link>
            <ThemeToggle />
          </div>

          <button
            className="nav-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`hamburger ${menuOpen ? "open" : ""}`}>
              <span />
              <span />
              <span />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile-menu">
          <Link href="/" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/picks" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
            Props
          </Link>
          <Link href="/squares" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
            Squares
          </Link>
          <Link href="/admin" className="nav-mobile-link" onClick={() => setMenuOpen(false)}>
            Admin
          </Link>
          <div className="nav-mobile-bottom">
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  )
}

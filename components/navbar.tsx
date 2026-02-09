"use client"

import Image from "next/image"
import Link from "next/link"
import { Home, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Navbar() {
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
              <span className="nav-title">PROP PICKS</span>
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
        </div>
      </div>
    </nav>
  )
}

"use client"

import Link from "next/link"
import { X } from "lucide-react"
import { getContrastColor } from "@/lib/squaresColors"
import { getPlayerLimit, getPlayerClaimedCount } from "@/lib/squaresStore"
import type { SquaresState } from "@/lib/squaresTypes"

interface PlayerSelectorProps {
  state: SquaresState
  onClose?: () => void
}

export function PlayerSelector({ state, onClose }: PlayerSelectorProps) {
  return (
    <div className="sq-player-selector">
      <div className="sq-player-selector-header">
        <span className="sq-player-selector-title">Who&apos;s claiming?</span>
        {onClose && (
          <button className="sq-player-selector-close" onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>
      <div className="sq-player-grid">
        {state.players.map((player) => {
        const limit = getPlayerLimit(state, player.id)
        const claimed = getPlayerClaimedCount(state, player.id)
        const full = claimed >= limit

        return (
          <Link
            key={player.id}
            href={`/squares/claim/${player.id}`}
            className={`sq-player-card ${full ? "sq-player-full" : ""}`}
          >
            <div
              className="sq-player-color"
              style={{ backgroundColor: player.color, color: getContrastColor(player.color) }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="sq-player-info">
              <span className="sq-player-name">{player.name}</span>
              <span className="sq-player-count">
                {full ? "Full" : `${claimed} / ${limit}`}
              </span>
            </div>
          </Link>
        )
      })}
      </div>
    </div>
  )
}

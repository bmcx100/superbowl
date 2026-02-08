"use client"

import type { Friend } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

interface FriendCardProps {
  friend: Friend
  totalProps: number
  onClick: () => void
}

export function FriendCard({ friend, totalProps, onClick }: FriendCardProps) {
  const pickCount = Object.keys(friend.picks).length

  let status: "complete" | "in-progress" | "not-started"
  if (pickCount >= totalProps && totalProps > 0) status = "complete"
  else if (pickCount > 0) status = "in-progress"
  else status = "not-started"

  const statusLabel =
    status === "complete"
      ? "Complete"
      : status === "in-progress"
        ? `${pickCount} / ${totalProps}`
        : "Not Started"

  return (
    <button className="friend-card" onClick={onClick}>
      <span className="friend-card-name">{friend.name}</span>
      <Badge className={`friend-badge friend-badge-${status}`}>
        {statusLabel}
      </Badge>
    </button>
  )
}

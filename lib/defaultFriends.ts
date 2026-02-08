import type { Friend } from "./types"

const DEFAULT_FRIEND_NAMES = [
  "Mike", "Giovi", "Angie", "Edward", "Sam",
  "Gigi", "Ryan", "Daniella", "Dean", "Julz",
  "Izzy", "Mac", "Jax", "Hanna", "Madison",
]

export const DEFAULT_FRIENDS: Friend[] = DEFAULT_FRIEND_NAMES.map(
  (name, i) => ({
    id: `f-default-${String(i + 1).padStart(4, "0")}`,
    name,
    picks: {},
  })
)

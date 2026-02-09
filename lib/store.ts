import type { AppState, Friend, Prop } from "./types"
import { DEFAULT_PROPS } from "./defaultProps"
import { DEFAULT_FRIENDS } from "./defaultFriends"

const STORAGE_KEY = "sbProps"

// Step 1.1 — Initialize / read state
export function getState(): AppState {
  if (typeof window === "undefined") {
    return buildDefaultState()
  }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const state = buildDefaultState()
    saveState(state)
    return state
  }
  return JSON.parse(raw) as AppState
}

function buildDefaultState(): AppState {
  return {
    eventName: "Super Bowl LX Props",
    props: DEFAULT_PROPS,
    friends: DEFAULT_FRIENDS,
  }
}

// Step 1.2 — Save state
export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

// Step 1.3 — Helper functions

// --- Friends ---

export function addFriend(name: string): void {
  const state = getState()
  const id = `f-${crypto.randomUUID()}`
  const friend: Friend = { id, name, picks: {} }
  state.friends.push(friend)
  saveState(state)
}

export function renameFriend(id: string, name: string): void {
  const state = getState()
  const friend = state.friends.find((f) => f.id === id)
  if (friend) {
    friend.name = name
    saveState(state)
  }
}

export function deleteFriend(id: string): void {
  const state = getState()
  state.friends = state.friends.filter((f) => f.id !== id)
  saveState(state)
}

export function resetFriendPicks(id: string): void {
  const state = getState()
  const friend = state.friends.find((f) => f.id === id)
  if (friend) {
    friend.picks = {}
    saveState(state)
  }
}

// --- Picks ---

export function setPick(
  friendId: string,
  propId: string,
  value: "A" | "B"
): void {
  const state = getState()
  const friend = state.friends.find((f) => f.id === friendId)
  if (friend) {
    friend.picks[propId] = value
    saveState(state)
  }
}

export function isFriendComplete(friendId: string): boolean {
  const state = getState()
  const friend = state.friends.find((f) => f.id === friendId)
  if (!friend) return false
  return state.props.every((p) => friend.picks[p.id] !== undefined)
}

export function areAllFriendsComplete(): boolean {
  const state = getState()
  if (state.friends.length === 0 || state.props.length === 0) return false
  return state.friends.every((f) =>
    state.props.every((p) => f.picks[p.id] !== undefined)
  )
}

export function lockProps(): void {
  const state = getState()
  state.propsLocked = true
  saveState(state)
}

export function unlockProps(): void {
  const state = getState()
  state.propsLocked = false
  saveState(state)
}

// --- Props ---

export function updateProp(
  id: string,
  question: string,
  optionA: string,
  optionB: string
): void {
  const state = getState()
  const prop = state.props.find((p) => p.id === id)
  if (prop) {
    prop.question = question
    prop.optionA = optionA
    prop.optionB = optionB
    prop.correctAnswer = null
    for (const friend of state.friends) {
      delete friend.picks[id]
    }
    saveState(state)
  }
}

export function reorderProps(orderedIds: string[]): void {
  const state = getState()
  for (let i = 0; i < orderedIds.length; i++) {
    const prop = state.props.find((p) => p.id === orderedIds[i])
    if (prop) {
      prop.order = i
    }
  }
  saveState(state)
}

export function setCorrectAnswer(
  propId: string,
  value: "A" | "B" | null
): void {
  const state = getState()
  const prop = state.props.find((p) => p.id === propId)
  if (prop) {
    prop.correctAnswer = value
    saveState(state)
  }
}

// --- Scoring ---

export interface LeaderboardEntry {
  id: string
  name: string
  correct: number
  scored: number
  accuracy: number
}

export function getLeaderboard(): LeaderboardEntry[] {
  const state = getState()
  const scoredProps = state.props.filter((p) => p.correctAnswer !== null)

  return state.friends
    .map((friend) => {
      let correct = 0
      for (const prop of scoredProps) {
        if (friend.picks[prop.id] === prop.correctAnswer) {
          correct++
        }
      }
      const scored = scoredProps.length
      const accuracy = scored > 0 ? correct / scored : 0
      return { id: friend.id, name: friend.name, correct, scored, accuracy }
    })
    .sort((a, b) => b.correct - a.correct)
}

// --- Bulk resets ---

export function clearAllPicks(): void {
  const state = getState()
  for (const friend of state.friends) {
    friend.picks = {}
  }
  saveState(state)
}

export function clearAllResults(): void {
  const state = getState()
  for (const prop of state.props) {
    prop.correctAnswer = null
  }
  saveState(state)
}

export function clearAllFriends(): void {
  const state = getState()
  state.friends = []
  saveState(state)
}

export function clearAllProps(): void {
  const state = getState()
  state.props = DEFAULT_PROPS.map((p) => ({ ...p }))
  for (const friend of state.friends) {
    friend.picks = {}
  }
  saveState(state)
}

// --- Backup / Restore ---

export function exportBackup(): string {
  return JSON.stringify(getState(), null, 2)
}

export function importBackup(json: string): void {
  const state = JSON.parse(json) as AppState
  saveState(state)
}

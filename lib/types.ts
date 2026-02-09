export interface Prop {
  id: string
  question: string
  optionA: string
  optionB: string
  correctAnswer: "A" | "B" | null
  order: number
}

export interface Friend {
  id: string
  name: string
  picks: Record<string, "A" | "B">
}

export interface AppState {
  eventName: string
  props: Prop[]
  friends: Friend[]
  propsLocked?: boolean
}

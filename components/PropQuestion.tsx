"use client"

import type { Prop } from "@/lib/types"

interface PropQuestionProps {
  prop: Prop
  index: number
  pick: "A" | "B" | undefined
  onPick: (value: "A" | "B") => void
}

export function PropQuestion({ prop, index, pick, onPick }: PropQuestionProps) {
  const answered = pick !== undefined

  return (
    <div className={`prop-question ${answered ? "prop-answered" : "prop-unanswered"}`}>
      <div className="prop-question-header">
        <span className="prop-number">{index + 1}.</span>
        <span className="prop-text">{prop.question}</span>
      </div>
      <div className="prop-options">
        <button
          className={`prop-option ${pick === "A" ? "prop-option-selected" : ""}`}
          onClick={() => onPick("A")}
        >
          {prop.optionA}
        </button>
        <button
          className={`prop-option ${pick === "B" ? "prop-option-selected" : ""}`}
          onClick={() => onPick("B")}
        >
          {prop.optionB}
        </button>
      </div>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Footer } from "@/components/footer"

const sections = [
  {
    id: "general",
    title: "General",
    rules: [
      "This is a free, friendly game for entertainment only. No real money is required to participate.",
      "All players must be added before the game is locked. Once locked, no new players can join.",
      "The admin (game host) has final say on all disputes and rulings.",
      "Be honest and respectful. This is supposed to be fun.",
    ],
  },
  {
    id: "props",
    title: "Props",
    rules: [
      "Each player must answer every prop question by choosing Option A or Option B.",
      "You may use the Random button to auto-fill your picks, but you can change them before locking.",
      "Once the admin locks props, no picks can be changed.",
      "After each prop is decided during the game, the admin marks the correct answer.",
      "Each correct pick is worth 1 point. The player with the most correct picks wins.",
      "In the event of a tie, the tied players share the win.",
    ],
  },
  {
    id: "squares",
    title: "Squares",
    rules: [
      "The board is a 10\u00d710 grid with 100 total squares.",
      "Squares are divided as evenly as possible among all players. Any remainder squares are randomly assigned.",
      "Tap empty squares to claim them, or use Random to auto-fill your allotment.",
      "You can unclaim your own squares before the board is locked.",
      "Once all 100 squares are claimed, the admin locks the board. Row and column numbers (0\u20139) are randomly assigned at lock time.",
      "At the end of each quarter (Q1, Q2, Q3, Final), the last digit of each team\u2019s score determines the winning square.",
      "Find the intersection of the row number matching one team\u2019s last digit and the column number matching the other team\u2019s last digit. That square wins.",
      "There are 4 winners total, one per quarter. A single player can win multiple quarters.",
    ],
  },
  {
    id: "payouts",
    title: "Payouts",
    rules: [
      "Payout structure is decided by the group before the game starts.",
      "A common split for squares is 20% for Q1, 20% for Q2, 20% for Q3, and 40% for the Final.",
      "Props payouts are up to the group. Winner-take-all or top-3 splits are both common.",
      "All payouts should be settled promptly after the game ends.",
    ],
  },
  {
    id: "fair-play",
    title: "Fair Play",
    rules: [
      "No changing picks or squares after the game has been locked.",
      "The admin should not give themselves an unfair advantage when assigning remainder squares.",
      "If a prop question is ambiguous or voided, the admin may remove it. No points are awarded for voided props.",
      "Screenshots of the locked board and picks are encouraged for transparency.",
    ],
  },
]

export default function RulesPage() {
  const router = useRouter()

  return (
    <div className="page-root">
      <section className="htp-section">
        <button className="admin-back" onClick={() => router.back()}>
          <ArrowLeft size={28} />
          <span>Back</span>
        </button>

        <h1 className="htp-title">Rules</h1>
        <p className="htp-subtitle">Keep it fun, keep it fair.</p>

        <div className="rules-container">
          <Accordion type="multiple" defaultValue={["general"]}>
            {sections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="rules-accordion-item">
                <AccordionTrigger className="rules-accordion-trigger">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="rules-accordion-content">
                  <ol className="rules-list">
                    {section.rules.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  )
}

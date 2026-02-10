"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Footer } from "@/components/footer"

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        q: "How do I join the game?",
        a: "The game host (admin) adds all players through the Admin panel. Once you\u2019re added, just find your name on the Props or Squares page and start playing.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. There are no accounts or logins. The admin manages everything from one device and passes it around for players to make their picks.",
      },
      {
        q: "Can I play both Props and Squares?",
        a: "Yes! They\u2019re two separate games. You can play one or both.",
      },
    ],
  },
  {
    id: "props",
    title: "Props",
    items: [
      {
        q: "What are props?",
        a: "Props (short for propositions) are fun yes-or-no style questions about the Super Bowl. For example: \u201cWill the coin toss be heads?\u201d or \u201cWill there be a safety?\u201d You pick Option A or Option B for each one.",
      },
      {
        q: "Can I change my picks after submitting?",
        a: "Yes, as long as the admin hasn\u2019t locked props yet. Once locked, all picks are final.",
      },
      {
        q: "What does the Random button do?",
        a: "It randomly fills in all your remaining picks. You can still change any of them afterward, as long as props aren\u2019t locked.",
      },
      {
        q: "How is scoring done?",
        a: "Each correct pick is worth 1 point. The admin marks the correct answer for each prop during or after the game. The leaderboard updates automatically.",
      },
      {
        q: "What happens if there\u2019s a tie?",
        a: "Tied players share the win. There are no tiebreakers.",
      },
    ],
  },
  {
    id: "squares",
    title: "Squares",
    items: [
      {
        q: "How many squares do I get?",
        a: "The 100 squares are divided evenly among all players. For example, with 7 players each person gets 14 squares, and the 2 remaining squares are randomly assigned to lucky players.",
      },
      {
        q: "Can I pick which squares I want?",
        a: "Yes! Tap any empty square on the grid to claim it. You can also use Random to auto-fill your remaining squares.",
      },
      {
        q: "Can I unclaim a square?",
        a: "Yes, tap one of your own squares to unclaim it. This only works before the board is locked.",
      },
      {
        q: "What are the numbers on the grid?",
        a: "After the board is locked, the digits 0\u20139 are randomly assigned to each row and each column. These numbers are used to determine winners based on the game score.",
      },
      {
        q: "How do I win a square?",
        a: "At the end of each quarter, take the last digit of each team\u2019s score. Find where those two digits intersect on the grid \u2014 that square wins. For example, if the score is Patriots 17, Seahawks 14, the last digits are 7 and 4. The square at row 7, column 4 wins.",
      },
      {
        q: "Can I win more than once?",
        a: "Yes. There\u2019s a winner at Q1, Q2, Q3, and the Final. If your square hits multiple times, you win multiple times.",
      },
    ],
  },
  {
    id: "admin",
    title: "Admin & Setup",
    items: [
      {
        q: "How do I access the Admin panel?",
        a: "Tap the gear icon in the top-right corner of the page. From there you can manage players, props, squares, scoring, and settings.",
      },
      {
        q: "Can I add or remove players after the game starts?",
        a: "You can add players at any time before locking. Removing a player will clear all of their picks and squares.",
      },
      {
        q: "What does locking do?",
        a: "Locking prevents any further changes. For Props, it freezes all picks. For Squares, it freezes the board and randomizes the row/column numbers.",
      },
      {
        q: "Can I unlock after locking?",
        a: "Yes, the admin can unlock from the Admin panel. Unlocking Squares will reset the row/column numbers and clear any recorded winners.",
      },
      {
        q: "Is my data saved?",
        a: "All data is saved locally in your browser. It persists between sessions but is not synced across devices. Use the Backup feature in Admin Settings to export your data.",
      },
    ],
  },
]

export default function FAQPage() {
  const router = useRouter()

  return (
    <div className="page-root">
      <section className="htp-section">
        <button className="admin-back" onClick={() => router.back()}>
          <ArrowLeft size={28} />
          <span>Back</span>
        </button>

        <h1 className="htp-title">FAQ</h1>
        <p className="htp-subtitle">Answers to common questions.</p>

        <div className="rules-container">
          {sections.map((section) => (
            <div key={section.id} className="faq-section">
              <h2 className="faq-section-title">{section.title}</h2>
              <Accordion type="multiple">
                {section.items.map((item, i) => (
                  <AccordionItem key={i} value={`${section.id}-${i}`} className="rules-accordion-item">
                    <AccordionTrigger className="faq-accordion-trigger">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="rules-accordion-content">
                      <p className="faq-answer">{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}

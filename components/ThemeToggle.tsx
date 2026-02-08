"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"))
  }, [])

  const toggle = () => {
    const next = !isLight
    setIsLight(next)
    document.documentElement.classList.toggle("light", next)
    localStorage.setItem("theme", next ? "light" : "dark")
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      <span className="theme-toggle-icon">
        {isLight ? <Moon size={20} /> : <Sun size={20} />}
      </span>
    </button>
  )
}

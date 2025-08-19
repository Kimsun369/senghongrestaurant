"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("restaurant-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    document.documentElement.classList.toggle("dark", newIsDark)
    localStorage.setItem("restaurant-theme", newIsDark ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-amber-700 hover:text-amber-800 dark:text-amber-300 dark:hover:text-amber-200"
    >
      {isDark ? "☀️" : "🌙"}
    </Button>
  )
}

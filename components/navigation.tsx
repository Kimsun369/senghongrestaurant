"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Coffee, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#menu", label: "Menu" },
    { href: "#contact", label: "Contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Active section detection
  const [activeSection, setActiveSection] = useState("home")
  useEffect(() => {
    const handleSectionScroll = () => {
      const sections = ["home", "menu", "contact"]
      const offset = 64 // navbar height
      let closestSection = "home"
      let minDistance = Infinity
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          const distance = Math.abs(rect.top - offset)
          if (rect.top - offset <= 0 && distance < minDistance) {
            minDistance = distance
            closestSection = section
          }
        }
      }
      setActiveSection(closestSection)
    }
    window.addEventListener("scroll", handleSectionScroll)
    return () => window.removeEventListener("scroll", handleSectionScroll)
  }, [])

  // Smooth scroll to section
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.replace("#", "")
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 64 // navbar height
      window.scrollTo({ top: y, behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  const isActive = (href: string) => href === `#${activeSection}`

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/90 dark:bg-coffee-900/90 backdrop-blur-md shadow-lg border-b border-coffee-100 dark:border-coffee-800"
            : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 lg:h-20">
            <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="flex items-center space-x-3 group">
              <div className="relative">
                <Coffee className="h-8 w-8 text-coffee-600 dark:text-gold-400 group-hover:animate-coffee-breath transition-colors" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-pulse opacity-60"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-serif font-bold text-coffee-900 dark:text-cream-100">
                  Slow drip
                </span>
                <span className="text-xs font-script text-coffee-600 dark:text-gold-400 -mt-1">
                 cafe & eatery
                </span>
              </div>
            </a>

            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative text-base font-medium transition-all duration-200 hover:scale-105",
                      isActive(link.href)
                        ? "text-coffee-800 dark:text-gold-400 bg-coffee-50 dark:bg-coffee-800/50"
                        : "text-coffee-700 dark:text-cream-200 hover:text-coffee-900 dark:hover:text-gold-300",
                    )}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-coffee-600 dark:bg-gold-400 rounded-full"></div>
                    )}
                  </Button>
                </a>
              ))}

              <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-coffee-200 dark:border-coffee-700">
                <ThemeToggle />
              </div>
            </div>

            <div className="lg:hidden flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-coffee-700 dark:text-cream-200" />
                ) : (
                  <Menu className="h-6 w-6 text-coffee-700 dark:text-cream-200" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="bg-white/95 dark:bg-coffee-900/95 backdrop-blur-md border-t border-coffee-100 dark:border-coffee-800">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left transition-all duration-200",
                      "animate-slide-in-left",
                      isActive(link.href)
                        ? "text-coffee-800 dark:text-gold-400 bg-coffee-50 dark:bg-coffee-800/50"
                        : "text-coffee-700 dark:text-cream-200",
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {link.label}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="h-16 lg:h-20"></div>
    </>
  )
}


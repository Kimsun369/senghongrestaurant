"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { authManager } from "@/lib/auth"
import type { User } from "@/lib/data-manager"

export function MobileMenu() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setCurrentUser(authManager.getCurrentUser())

    const handleAuthChange = () => {
      setCurrentUser(authManager.getCurrentUser())
    }

    window.addEventListener("auth-change", handleAuthChange)
    return () => window.removeEventListener("auth-change", handleAuthChange)
  }, [])

  const handleLogout = () => {
    authManager.logout()
    setCurrentUser(null)
    window.dispatchEvent(new Event("auth-change"))
    setIsOpen(false)
    window.location.href = "/"
  }

  const closeMenu = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="text-cream-100 md:hidden">
          ☰
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-coffee-800 dark:bg-coffee-900 text-cream-100 border-coffee-700">
        <SheetHeader>
          <SheetTitle className="text-gold-400 text-left">Café Delight</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col space-y-4 mt-8">
          <Link href="/" onClick={closeMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-cream-100 hover:text-gold-300 hover:bg-coffee-700"
            >
              Home
            </Button>
          </Link>

          <Link href="/menu" onClick={closeMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-cream-100 hover:text-gold-300 hover:bg-coffee-700"
            >
              Menu
            </Button>
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            <Button
              variant="ghost"
              className="w-full justify-start text-cream-100 hover:text-gold-300 hover:bg-coffee-700"
            >
              Contact
            </Button>
          </Link>

          {currentUser ? (
            <>
              {currentUser.role === "admin" && (
                <Link href="/admin" onClick={closeMenu}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gold-300 hover:text-gold-200 hover:bg-coffee-700"
                  >
                    Admin
                  </Button>
                </Link>
              )}

              <Link href="/profile" onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-cream-100 hover:text-gold-300 hover:bg-coffee-700"
                >
                  Profile
                </Button>
              </Link>

              <div className="border-t border-coffee-700 pt-4">
                <p className="text-sm text-cream-200 mb-2">Welcome, {currentUser.name}</p>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-cream-100 hover:text-gold-300 hover:bg-coffee-700"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Link href="/login" onClick={closeMenu}>
              <Button
                variant="ghost"
                className="w-full justify-start text-cream-100 hover:text-gold-300 hover:bg-coffee-700"
              >
                Login
              </Button>
            </Link>
          )}

          <div className="border-t border-coffee-700 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-cream-200">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

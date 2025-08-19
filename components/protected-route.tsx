"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authManager } from "@/lib/auth"
import type { User } from "@/lib/data-manager"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "customer"
  redirectTo?: string
}

export function ProtectedRoute({ children, requiredRole, redirectTo = "/login" }: ProtectedRouteProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authManager.getCurrentUser()

    if (!currentUser) {
      router.push(redirectTo)
      return
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      router.push("/")
      return
    }

    setUser(currentUser)
    setIsLoading(false)
  }, [router, requiredRole, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">☕</div>
          <p className="text-coffee-600 dark:text-cream-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}

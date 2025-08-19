"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProtectedRoute } from "@/components/protected-route"
import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cream-50 dark:bg-gray-900">
        <Navigation />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-coffee-900 dark:text-cream-100 mb-8">My Profile</h1>
            <UserProfile />
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}

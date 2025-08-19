"use client"

import type React from "react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { ProtectedRoute } from "@/components/protected-route"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen bg-cream-50 dark:bg-gray-900">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  )
}

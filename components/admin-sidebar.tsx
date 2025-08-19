"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "📊",
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: "🍽️",
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: "📂",
  },
  {
    title: "Back to Site",
    href: "/",
    icon: "🏠",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-coffee-900 dark:bg-black text-cream-100 h-screen sticky top-0 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-coffee-700 dark:border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gold-400">Admin Panel</h2>
              <p className="text-sm text-cream-300">Café Delight</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-cream-100 hover:bg-coffee-800"
          >
            {isCollapsed ? "→" : "←"}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-cream-100 hover:bg-coffee-800 hover:text-gold-300",
                  isActive && "bg-coffee-800 text-gold-400",
                  isCollapsed && "px-2",
                )}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

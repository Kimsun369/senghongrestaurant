"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { authManager } from "@/lib/auth"
import { dataManager } from "@/lib/data-manager"

export function UserProfile() {
  const [user] = useState(authManager.getCurrentUser())
  const [favorites] = useState(dataManager.getFavorites())

  if (!user) return null

  const favoriteProducts = favorites.map((id) => dataManager.getProduct(id)).filter(Boolean)

  return (
    <div className="space-y-6">
      {/* User Info */}
      <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-coffee-900 dark:text-cream-100">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-coffee-600 dark:text-cream-300">Name</label>
            <p className="text-coffee-900 dark:text-cream-100">{user.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-coffee-600 dark:text-cream-300">Username</label>
            <p className="text-coffee-900 dark:text-cream-100">{user.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-coffee-600 dark:text-cream-300">Role</label>
            <div>
              <Badge className={user.role === "admin" ? "bg-red-500 text-white" : "bg-blue-500 text-white"}>
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorites */}
      {user.role === "customer" && (
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-coffee-900 dark:text-cream-100">Your Favorites</CardTitle>
          </CardHeader>
          <CardContent>
            {favoriteProducts.length === 0 ? (
              <p className="text-coffee-600 dark:text-cream-300">No favorites yet. Start browsing our menu!</p>
            ) : (
              <div className="space-y-3">
                {favoriteProducts.map((product) => (
                  <div
                    key={product?.id}
                    className="flex justify-between items-center p-3 bg-cream-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-coffee-900 dark:text-cream-100">{product?.name}</h4>
                      <p className="text-sm text-coffee-600 dark:text-cream-300">${product?.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (product?.id) {
                          dataManager.removeFromFavorites(product.id)
                          window.location.reload()
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/data-manager"
import { dataManager } from "@/lib/data-manager"
import { authManager } from "@/lib/auth"

interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(dataManager.isFavorite(product.id))
  const isLoggedIn = authManager.isLoggedIn()

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isLoggedIn) return

    if (isFavorite) {
      dataManager.removeFromFavorites(product.id)
    } else {
      dataManager.addToFavorites(product.id)
    }
    setIsFavorite(!isFavorite)
  }

  const getDietaryColor = (dietary: string) => {
    switch (dietary) {
      case "vegan":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "spicy":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "gluten-free":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <Card className="group cursor-pointer hover-lift bg-cream-50 dark:bg-gray-800 border-coffee-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto sm:max-w-full">
      <div className="relative" onClick={() => onViewDetails(product)}>
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={600}
          height={400}
          className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, 600px"
          priority
        />

        {/* Favorite button */}
        {isLoggedIn && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteToggle}
            className="absolute top-2 right-2 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black p-1 rounded"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </Button>
        )}

        {/* Popular & Featured badges container for stacking */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.popular && <Badge className="bg-gold-500 text-white text-xs px-2 py-0.5">Popular</Badge>}
          {product.featured && <Badge className="bg-coffee-600 text-white text-xs px-2 py-0.5">Featured</Badge>}
        </div>
      </div>

      <CardContent className="p-4" onClick={() => onViewDetails(product)}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-base sm:text-lg text-coffee-900 dark:text-cream-100 group-hover:text-coffee-700 dark:group-hover:text-cream-200 transition-colors">
            {product.name}
          </h3>
          <span className="text-base sm:text-lg font-bold text-gold-600 dark:text-gold-400">${product.price.toFixed(2)}</span>
        </div>

        <p className="text-coffee-600 dark:text-cream-300 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>

        {/* Dietary badges */}
        {product.dietary.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.dietary.map((diet) => (
              <Badge
                key={diet}
                variant="secondary"
                className={`text-[10px] sm:text-xs ${getDietaryColor(diet)}`}
              >
                {diet}
              </Badge>
            ))}
          </div>
        )}

        <Button
          className="w-full bg-coffee-600 hover:bg-coffee-700 text-cream-100 text-sm sm:text-base"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails(product)
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  )
}

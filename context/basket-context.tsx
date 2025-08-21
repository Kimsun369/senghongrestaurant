"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface BasketItem {
  product: any
  options: any
  quantity: number
}

interface BasketContextType {
  items: BasketItem[]
  addItem: (item: BasketItem) => void
  updateItem: (idx: number, item: Partial<BasketItem>) => void
  removeItem: (idx: number) => void
  clear: () => void
  basketTotal: number
}

const BasketContext = createContext<BasketContextType | undefined>(undefined)

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("basket")
    if (stored) setItems(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem("basket", JSON.stringify(items))
  }, [items])

  const addItem = (item: BasketItem) => {
    setItems(prev => [...prev, item])
  }

  const updateItem = (idx: number, item: Partial<BasketItem>) => {
    setItems(prev => prev.map((it, i) => (i === idx ? { ...it, ...item } : it)))
  }

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const clear = () => setItems([])

  const basketTotal = items.reduce(
    (sum, item) => {
      // Use the same price calculation as in product-modal
      let additional = 0
      const PRICING = {
        sizes: { small: 0, medium: 0.5, large: 1.0 },
        coffeeShots: { single: 0, double: 0.8, triple: 1.5 },
        milk: { regular: 0, oat: 0.5, almond: 0.5, soy: 0.5, coconut: 0.5 },
        portions: { regular: 0, large: 2.0 }
      }
      if (item.options.size && PRICING.sizes[item.options.size] !== undefined)
        additional += PRICING.sizes[item.options.size]
      if (item.options.shots && PRICING.coffeeShots[item.options.shots] !== undefined)
        additional += PRICING.coffeeShots[item.options.shots]
      if (item.options.milk && PRICING.milk[item.options.milk] !== undefined)
        additional += PRICING.milk[item.options.milk]
      if (item.options.portion && PRICING.portions[item.options.portion] !== undefined)
        additional += PRICING.portions[item.options.portion]
      return sum + (item.product.price + additional) * item.quantity
    },
    0
  )

  return (
    <BasketContext.Provider value={{ items, addItem, updateItem, removeItem, clear, basketTotal }}>
      {children}
    </BasketContext.Provider>
  )
}

export function useBasket() {
  const ctx = useContext(BasketContext)
  if (!ctx) throw new Error("useBasket must be used within BasketProvider")
  return ctx
}

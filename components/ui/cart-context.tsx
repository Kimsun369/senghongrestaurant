"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  options: Record<string, string>
  quantity: number
}

interface CartContextProps {
  cartItems: CartItem[]
  addItemToCart: (item: CartItem) => void
  removeItemFromCart: (index: number) => void
  clearCart: () => void
  totalQuantity: number
}

const CartContext = createContext<CartContextProps | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addItemToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item])
  }

  const removeItemFromCart = (index: number) => {
    setCartItems(prev => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => setCartItems([])

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, clearCart, totalQuantity }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}

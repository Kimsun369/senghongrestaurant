"use client"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Trash, Minus, Plus, ShoppingCart } from "lucide-react"
import { useBasket } from "@/context/basket-context"
import { useState } from "react"

export function BasketModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateItem, removeItem, clear, basketTotal } = useBasket()
  const [ordering, setOrdering] = useState(false)

  // Helper for order message/PDF
  const getOrderOptionsText = (category: string | undefined, options: any) => {
    let optionsText = ""
    if (category === "coffee") {
      optionsText = [
        `Size: ${options.size}`,
        `Shots: ${options.shots}`,
        `Sugar level: ${options.sugar}`,
        `Ice level: ${options.ice}`,
        `Milk type: ${options.milk}`
      ].join("\n")
    } else if (category === "tea") {
      optionsText = [
        `Size: ${options.size}`,
        `Sugar level: ${options.sugar}`,
        `Ice level: ${options.ice}`
      ].join("\n")
    } else if (
      ["milk-drinks", "smoothies", "soft-drinks"].includes(category || "")
    ) {
      optionsText = [
        `Size: ${options.size}`,
        `Ice level: ${options.ice}`
      ].join("\n")
    } else if (
      ["rice-dishes", "noodles", "sandwiches", "cakes-pastries", "salads", "snacks", "desserts"].includes(category || "")
    ) {
      optionsText = [
        `Portion size: ${options.portion}`,
        options.extras ? `• Special requests: ${options.extras}` : ""
      ].filter(Boolean).join("\n")
    }
    return optionsText
  }

  const calculateItemPrice = (category: string | undefined, options: any, basePrice: number) => {
    let additionalCharges = 0
    const PRICING = {
      sizes: { small: 0, medium: 0.5, large: 1.0 },
      coffeeShots: { single: 0, double: 0.8, triple: 1.5 },
      milk: { regular: 0, oat: 0.5, almond: 0.5, soy: 0.5, coconut: 0.5 },
      portions: { regular: 0, large: 2.0 }
    }
    if (options.size && PRICING.sizes[options.size] !== undefined)
      additionalCharges += PRICING.sizes[options.size]
    if (options.shots && PRICING.coffeeShots[options.shots] !== undefined)
      additionalCharges += PRICING.coffeeShots[options.shots]
    if (options.milk && PRICING.milk[options.milk] !== undefined)
      additionalCharges += PRICING.milk[options.milk]
    if (options.portion && PRICING.portions[options.portion] !== undefined)
      additionalCharges += PRICING.portions[options.portion]
    return basePrice + additionalCharges
  }

  const generateOrderMessage = (timestamp: string) => {
    let msg = `Order:\nTime: ${timestamp}\n\n`
    items.forEach((item, idx) => {
      const optionsText = getOrderOptionsText(item.product.category, item.options)
      const itemPrice = calculateItemPrice(item.product.category, item.options, item.product.price)
      msg +=
        `Item ${idx + 1}: ${item.product.name}\n` +
        `  Quantity: ${item.quantity}\n` +
        (optionsText ? optionsText.split("\n").map(line => `  ${line}`).join("\n") + "\n" : "") +
        `  Total: $${(itemPrice * item.quantity).toFixed(2)}\n\n`
    })
    msg += `Grand Total: $${basketTotal.toFixed(2)}\nThank you!`
    return msg
  }

  // PDF generation (same as in product-modal)
  const generateAndDownloadPDF = async (timestamp: string, message: string) => {
    function waitForJsPDF() {
      return new Promise((resolve) => {
        if (typeof window !== "undefined" && window.jspdf && window.jspdf.jsPDF) {
          resolve(window.jspdf.jsPDF)
        } else {
          const interval = setInterval(() => {
            if (window.jspdf && window.jspdf.jsPDF) {
              clearInterval(interval)
              resolve(window.jspdf.jsPDF)
            }
          }, 50)
        }
      })
    }
    const JsPDF = await waitForJsPDF() as any
    const doc = new JsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [340, Math.max(600, 180 + items.length * 120)]
    })

    doc.setFillColor("#f6e9d7")
    doc.rect(0, 0, 340, 80, "F")
    doc.setFontSize(20)
    doc.setTextColor("#8d5524")
    doc.setFont("helvetica", "bold")
    doc.text("Slow Drip", 170, 38, { align: "center" })
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor("#8d5524")
    doc.text("Order Receipt", 170, 58, { align: "center" })

    let y = 95
    doc.setFontSize(12)
    doc.setTextColor("#333")
    doc.setFont("helvetica", "bold")
    doc.text(`Date: ${timestamp}`, 20, y)
    y += 22

    doc.setDrawColor("#e0c9a6")
    doc.line(20, y, 320, y)
    y += 18
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text("Order Items", 20, y)
    y += 18

    items.forEach((item, idx) => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor("#8d5524")
      doc.text(`Item ${idx + 1}: ${item.product.name}`, 20, y)
      y += 16
      doc.setFont("helvetica", "normal")
      doc.setTextColor("#333")
      doc.text(`Quantity: ${item.quantity}`, 28, y)
      y += 14
      const optionsText = getOrderOptionsText(item.product.category, item.options)
      if (optionsText) {
        doc.setFont("helvetica", "normal")
        const lines = doc.splitTextToSize(optionsText, 270)
        doc.text(lines, 36, y)
        y += lines.length * 14
      }
      const itemPrice = calculateItemPrice(item.product.category, item.options, item.product.price)
      doc.setFont("helvetica", "bold")
      doc.setTextColor("#8d5524")
      doc.text(`Total: $${(itemPrice * item.quantity).toFixed(2)}`, 28, y)
      y += 20
      doc.setDrawColor("#e0c9a6")
      doc.line(20, y, 320, y)
      y += 10
    })

    y += 10
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor("#8d5524")
    doc.text(`Grand Total: $${basketTotal.toFixed(2)}`, 20, y)
    y += 24

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.setTextColor("#333")
    doc.text("Thank you for your order!", 170, y, { align: "center" })
    y += 16
    doc.setFontSize(9)
    doc.setTextColor("#bfa16b")
    doc.text("Slow Drip · Heart of the city", 170, y, { align: "center" })

    const safeTimestamp = timestamp.replace(/[^0-9a-zA-Z]/g, "_")
    const filename = `order_${safeTimestamp}.pdf`
    doc.save(filename)
  }

  const handleBuyNow = async () => {
    setOrdering(true)
    const timestamp = new Date().toLocaleString()
    const message = generateOrderMessage(timestamp)
    const encodedMessage = encodeURIComponent(message)
    window.open(`https://t.me/Eschoolcam?text=${encodedMessage}`, "_blank")
    await generateAndDownloadPDF(timestamp, message)
    setOrdering(false)
    clear()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-0 bg-cream-50 dark:bg-coffee-900 border-0 shadow-2xl rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-amber-200 dark:border-coffee-800 bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-coffee-900 dark:to-coffee-800/70">
          <DialogTitle className="text-lg sm:text-xl font-bold text-coffee-900 dark:text-cream-100 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-600 dark:text-amber-300" />
            Basket
          </DialogTitle>
        </div>
        <div className="p-0 sm:p-0">
          {items.length === 0 ? (
            <div className="text-center py-12 text-amber-700 dark:text-amber-200 text-base sm:text-lg font-medium">
              Your basket is empty.
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <ul className="divide-y divide-amber-100 dark:divide-coffee-800 px-3 sm:px-5 py-2 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                {items.map((item, idx) => (
                  <li key={idx} className="py-4 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-coffee-900 dark:text-cream-100 text-base truncate">{item.product.name}</div>
                      <div className="text-xs text-amber-700 dark:text-amber-300 whitespace-pre-line mt-1">
                        {getOrderOptionsText(item.product.category, item.options)}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-amber-200 dark:border-coffee-700 text-amber-700 dark:text-amber-200 bg-white dark:bg-coffee-900"
                          onClick={() =>
                            updateItem(idx, { quantity: Math.max(1, item.quantity - 1) })
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold text-coffee-900 dark:text-cream-100">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-amber-200 dark:border-coffee-700 text-amber-700 dark:text-amber-200 bg-white dark:bg-coffee-900"
                          onClick={() =>
                            updateItem(idx, { quantity: item.quantity + 1 })
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-coffee-800 rounded-full"
                          onClick={() => removeItem(idx)}
                          aria-label="Remove item"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="font-bold text-amber-700 dark:text-amber-300 mt-1 text-right min-w-[70px]">
                      ${calculateItemPrice(item.product.category, item.options, item.product.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-amber-100 dark:border-coffee-800 px-5 py-4 bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-coffee-900 dark:to-coffee-800/70">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg text-coffee-900 dark:text-cream-100">Total</span>
                  <span className="font-bold text-lg text-amber-700 dark:text-amber-300">${basketTotal.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    onClick={clear}
                    variant="outline"
                    className="flex-1 border-amber-300 dark:border-coffee-700 text-amber-700 dark:text-amber-200 bg-white dark:bg-coffee-900 hover:bg-amber-100 dark:hover:bg-coffee-800 transition"
                  >
                    Clear Basket
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base shadow-lg hover:scale-[1.02] transition-all"
                    disabled={ordering}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {ordering ? "Ordering..." : "Buy Now"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

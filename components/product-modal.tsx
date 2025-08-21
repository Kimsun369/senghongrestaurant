"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBasket } from "@/context/basket-context"
import { Star, ShoppingCart, X, Plus, Minus } from "lucide-react"
import { Input } from "./ui/input"

interface Product {
  id: string
  name: string
  price: number
  image?: string
  fullDescription: string
  dietary: string[]
  popular?: boolean
  featured?: boolean
  category?: string
}

interface ProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const PRICING = {
  sizes: {
    small: 0,
    medium: 0.5,
    large: 1.0
  },
  coffeeShots: {
    single: 0,
    double: 0.8,
    triple: 1.5
  },
  milk: {
    regular: 0,
    oat: 0.5,
    almond: 0.5,
    soy: 0.5,
    coconut: 0.5
  },
  portions: {
    regular: 0,
    large: 2.0
  }
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const getDefaultOptions = (category?: string) => {
    switch (category) {
      case "coffee":
        return { 
          size: "medium", 
          sugar: "normal", 
          ice: "regular", 
          milk: "regular", 
          shots: "single",
          extras: "" 
        }
      case "tea":
        return { 
          size: "medium", 
          sugar: "normal", 
          ice: "regular", 
          milk: "", 
          shots: "",
          extras: "" 
        }
      case "milk-drinks":
      case "smoothies":
      case "soft-drinks":
        return { 
          size: "medium", 
          sugar: "", 
          ice: "regular", 
          milk: "", 
          shots: "",
          extras: "" 
        }
      case "rice-dishes":
      case "noodles":
      case "sandwiches":
      case "cakes-pastries":
      case "salads":
      case "snacks":
      case "desserts":
        return { 
          size: "", 
          sugar: "", 
          ice: "", 
          milk: "", 
          shots: "",
          portion: "regular", 
          extras: "" 
        }
      default:
        return { 
          size: "", 
          sugar: "", 
          ice: "", 
          milk: "", 
          shots: "",
          portion: "", 
          extras: "" 
        }
    }
  }

  const displayProduct = product
  const [options, setOptions] = useState(getDefaultOptions(displayProduct?.category))
  const [quantity, setQuantity] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)
  const [subItems, setSubItems] = useState([
    { options: getDefaultOptions(product?.category), quantity: 1 }
  ])

  useEffect(() => {
    setSubItems([{ options: getDefaultOptions(product?.category), quantity: 1 }])
  }, [product, isOpen])

  const updateSubItem = (idx: number, newData: Partial<{ options: any; quantity: number }>) => {
    setSubItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...newData } : item))
    )
  }

  const handleAddSubItem = () => {
    setSubItems((prev) => [
      ...prev,
      { options: getDefaultOptions(product?.category), quantity: 1 }
    ])
  }

  const handleRemoveSubItem = (idx: number) => {
    setSubItems((prev) => prev.filter((_, i) => i !== idx))
  }

  useEffect(() => {
    if (!displayProduct) return
    
    let basePrice = displayProduct.price
    let additionalCharges = 0
    
    if (options.size && PRICING.sizes[options.size as keyof typeof PRICING.sizes] !== undefined) {
      additionalCharges += PRICING.sizes[options.size as keyof typeof PRICING.sizes]
    }
    
    if (options.shots && PRICING.coffeeShots[options.shots as keyof typeof PRICING.coffeeShots] !== undefined) {
      additionalCharges += PRICING.coffeeShots[options.shots as keyof typeof PRICING.coffeeShots]
    }
    
    if (options.milk && PRICING.milk[options.milk as keyof typeof PRICING.milk] !== undefined) {
      additionalCharges += PRICING.milk[options.milk as keyof typeof PRICING.milk]
    }
    
    if (options.portion && PRICING.portions[options.portion as keyof typeof PRICING.portions] !== undefined) {
      additionalCharges += PRICING.portions[options.portion as keyof typeof PRICING.portions]
    }
    
    const itemTotal = basePrice + additionalCharges
    setTotalPrice(itemTotal * quantity)
  }, [displayProduct, options, quantity])

  const contactInfo = {
    telegram: "https://t.me/Eschoolcam",
    facebook: "https://www.facebook.com/mrr.hong.5055",
    phone: "+855123456789",
    mapUrl: "https://maps.app.goo.gl/xC3pE4kPM2C4sdaN9?g_st=ipc"
  }

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
    if (options.size && PRICING.sizes[options.size as keyof typeof PRICING.sizes] !== undefined) {
      additionalCharges += PRICING.sizes[options.size as keyof typeof PRICING.sizes]
    }
    if (options.shots && PRICING.coffeeShots[options.shots as keyof typeof PRICING.coffeeShots] !== undefined) {
      additionalCharges += PRICING.coffeeShots[options.shots as keyof typeof PRICING.coffeeShots]
    }
    if (options.milk && PRICING.milk[options.milk as keyof typeof PRICING.milk] !== undefined) {
      additionalCharges += PRICING.milk[options.milk as keyof typeof PRICING.milk]
    }
    if (options.portion && PRICING.portions[options.portion as keyof typeof PRICING.portions] !== undefined) {
      additionalCharges += PRICING.portions[options.portion as keyof typeof PRICING.portions]
    }
    return basePrice + additionalCharges
  }

  const generateOrderMessage = (
    subItemsList: { options: any; quantity: number }[],
    timestamp: string
  ) => {
    let msg = `Order: ${product?.name}\nTime: ${timestamp}\n\n`
    subItemsList.forEach((item, idx) => {
      const optionsText = getOrderOptionsText(product?.category, item.options)
      const itemPrice = calculateItemPrice(product?.category, item.options, product?.price ?? 0)
      msg +=
        `Item ${idx + 1}:\n` +
        `  Quantity: ${item.quantity}\n` +
        (optionsText ? optionsText.split("\n").map(line => `  ${line}`).join("\n") + "\n" : "") +
        `  Total: $${(itemPrice * item.quantity).toFixed(2)}\n\n`
    })
    msg += "Thank you!"
    return msg
  }

  const handleTelegramOrder = async () => {
    if (!product) return

    const timestamp = new Date().toLocaleString()
    const message = generateOrderMessage(subItems, timestamp)

    const encodedMessage = encodeURIComponent(message)
    const telegramUrl = `${contactInfo.telegram}?text=${encodedMessage}`
    window.open(telegramUrl, "_blank")

    await generateAndDownloadPDF(subItems, timestamp, message)
  }

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.jspdf) {
      const script = document.createElement("script")
      script.src = "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  const generateAndDownloadPDF = async (
    subItemsList: { options: any; quantity: number }[],
    timestamp: string,
    message: string
  ) => {
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
      format: [340, Math.max(600, 180 + subItemsList.length * 120)]
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
    doc.text(`Product: ${product?.name ?? ""}`, 20, y)
    y += 18
    doc.setFont("helvetica", "normal")
    doc.text(`Date: ${timestamp}`, 20, y)
    y += 22

    doc.setDrawColor("#e0c9a6")
    doc.line(20, y, 320, y)
    y += 18
    doc.setFont("helvetica", "bold")
    doc.setFontSize(13)
    doc.text("Order Items", 20, y)
    y += 18

    let grandTotal = 0

    subItemsList.forEach((item, idx) => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.setTextColor("#8d5524")
      doc.text(`Item ${idx + 1}`, 20, y)
      y += 16
      doc.setFont("helvetica", "normal")
      doc.setTextColor("#333")
      doc.text(`Quantity: ${item.quantity}`, 28, y)
      y += 14
      const optionsText = getOrderOptionsText(product?.category, item.options)
      if (optionsText) {
        doc.setFont("helvetica", "normal")
        const lines = doc.splitTextToSize(optionsText, 270)
        doc.text(lines, 36, y)
        y += lines.length * 14
      }
      const itemPrice = calculateItemPrice(product?.category, item.options, product?.price ?? 0)
      doc.setFont("helvetica", "bold")
      doc.setTextColor("#8d5524")
      doc.text(`Total: $${(itemPrice * item.quantity).toFixed(2)}`, 28, y)
      y += 20
      doc.setDrawColor("#e0c9a6")
      doc.line(20, y, 320, y)
      y += 10
      grandTotal += itemPrice * item.quantity
    })

    y += 10
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor("#8d5524")
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 20, y)
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

  const getDietaryColor = (dietary: string) => {
    switch (dietary.toLowerCase()) {
      case "vegan":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      case "vegetarian":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "spicy":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "gluten-free":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
    }
  }

  const renderSubItemForms = () => (
    <div className="space-y-8">
      {subItems.map((item, idx) => (
        <div
          key={idx}
          className="bg-amber-50/70 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200/30 dark:border-amber-800/30 shadow-sm relative"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-amber-900 dark:text-amber-100 text-base sm:text-lg">
              Item {idx + 1}
            </span>
            {subItems.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                onClick={() => handleRemoveSubItem(idx)}
                aria-label="Remove item"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="flex items-center mb-4">
            <Label className="mr-3 text-base font-semibold">Amount</Label>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none border-amber-300"
              onClick={() =>
                updateSubItem(idx, { quantity: Math.max(1, item.quantity - 1) })
              }
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="h-8 w-12 flex items-center justify-center border-y border-amber-300">
              {item.quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none border-amber-300"
              onClick={() =>
                updateSubItem(idx, { quantity: item.quantity + 1 })
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div>
            {renderOptionsForSubItem(idx, item.options)}
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        <Button
          variant="outline"
          className="mt-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800/30"
          onClick={handleAddSubItem}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Item
        </Button>
      </div>
    </div>
  )

  const renderOptionsForSubItem = (idx: number, options: any) => {
    if (!product?.category) return null
    switch (product.category) {
      case "coffee":
        return (
          <>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Size</Label>
              <Select value={options.size} onValueChange={v => updateSubItem(idx, { options: { ...options, size: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (+${PRICING.sizes.small.toFixed(2)})</SelectItem>
                  <SelectItem value="medium">Medium (+${PRICING.sizes.medium.toFixed(2)})</SelectItem>
                  <SelectItem value="large">Large (+${PRICING.sizes.large.toFixed(2)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Coffee Shots</Label>
              <Select value={options.shots} onValueChange={v => updateSubItem(idx, { options: { ...options, shots: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Shot (+${PRICING.coffeeShots.single.toFixed(2)})</SelectItem>
                  <SelectItem value="double">Double Shot (+${PRICING.coffeeShots.double.toFixed(2)})</SelectItem>
                  <SelectItem value="triple">Triple Shot (+${PRICING.coffeeShots.triple.toFixed(2)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Sugar</Label>
              <Select value={options.sugar} onValueChange={v => updateSubItem(idx, { options: { ...options, sugar: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-sugar">No Sugar</SelectItem>
                  <SelectItem value="less-sugar">Less Sugar</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="extra-sweet">Extra Sweet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Ice</Label>
              <Select value={options.ice} onValueChange={v => updateSubItem(idx, { options: { ...options, ice: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-ice">No Ice</SelectItem>
                  <SelectItem value="less-ice">Less Ice</SelectItem>
                  <SelectItem value="regular">Regular Ice</SelectItem>
                  <SelectItem value="extra-ice">Extra Ice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Milk</Label>
              <Select value={options.milk} onValueChange={v => updateSubItem(idx, { options: { ...options, milk: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Milk (+${PRICING.milk.regular.toFixed(2)})</SelectItem>
                  <SelectItem value="oat">Oat Milk (+${PRICING.milk.oat.toFixed(2)})</SelectItem>
                  <SelectItem value="almond">Almond Milk (+${PRICING.milk.almond.toFixed(2)})</SelectItem>
                  <SelectItem value="soy">Soy Milk (+${PRICING.milk.soy.toFixed(2)})</SelectItem>
                  <SelectItem value="coconut">Coconut Milk (+${PRICING.milk.coconut.toFixed(2)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "tea":
        return (
          <>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Size</Label>
              <Select value={options.size} onValueChange={v => updateSubItem(idx, { options: { ...options, size: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (+${PRICING.sizes.small.toFixed(2)})</SelectItem>
                  <SelectItem value="medium">Medium (+${PRICING.sizes.medium.toFixed(2)})</SelectItem>
                  <SelectItem value="large">Large (+${PRICING.sizes.large.toFixed(2)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Sugar</Label>
              <Select value={options.sugar} onValueChange={v => updateSubItem(idx, { options: { ...options, sugar: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-sugar">No Sugar</SelectItem>
                  <SelectItem value="less-sugar">Less Sugar</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="extra-sweet">Extra Sweet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Ice</Label>
              <Select value={options.ice} onValueChange={v => updateSubItem(idx, { options: { ...options, ice: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-ice">No Ice</SelectItem>
                  <SelectItem value="less-ice">Less Ice</SelectItem>
                  <SelectItem value="regular">Regular Ice</SelectItem>
                  <SelectItem value="extra-ice">Extra Ice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "milk-drinks":
      case "smoothies":
      case "soft-drinks":
        return (
          <>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Size</Label>
              <Select value={options.size} onValueChange={v => updateSubItem(idx, { options: { ...options, size: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (+${PRICING.sizes.small.toFixed(2)})</SelectItem>
                  <SelectItem value="medium">Medium (+${PRICING.sizes.medium.toFixed(2)})</SelectItem>
                  <SelectItem value="large">Large (+${PRICING.sizes.large.toFixed(2)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Ice</Label>
              <Select value={options.ice} onValueChange={v => updateSubItem(idx, { options: { ...options, ice: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-ice">No Ice</SelectItem>
                  <SelectItem value="less-ice">Less Ice</SelectItem>
                  <SelectItem value="regular">Regular Ice</SelectItem>
                  <SelectItem value="extra-ice">Extra Ice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )
      case "rice-dishes":
      case "noodles":
      case "sandwiches":
      case "cakes-pastries":
      case "salads":
      case "snacks":
      case "desserts":
        return (
          <>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Portion</Label>
              <Select value={options.portion} onValueChange={v => updateSubItem(idx, { options: { ...options, portion: v } })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular (+${PRICING.portions.regular.toFixed(2)})</SelectItem>
                  <SelectItem value="large">Large (+${PRICING.portions.large.toFixed(2)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-base font-semibold">Extras</Label>
              <Input
                placeholder="Any extras? (e.g. no onions, extra cheese)"
                value={options.extras || ""}
                onChange={e => updateSubItem(idx, { options: { ...options, extras: e.target.value } })}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  // Add basket context
  const { addItem, basketTotal } = useBasket()

  // Add to basket handler
  const handleAddToBasket = () => {
    if (!product) return
    subItems.forEach(item => {
      addItem({
        product,
        options: item.options,
        quantity: item.quantity
      })
    })
    // Optionally: show animation/feedback here
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full sm:w-[95vw] max-h-[95vh] overflow-y-auto bg-white dark:bg-amber-950 border-amber-200/50 dark:border-amber-800/50 shadow-2xl sm:rounded-2xl p-0"
        style={{ padding: 0 }}
      >
        <div className="sticky top-0 bg-white/95 dark:bg-amber-950/95 backdrop-blur-xl border-b border-amber-200/30 dark:border-amber-800/30 p-4 sm:p-6 rounded-t-2xl z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2 sm:pr-4">
              <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900 dark:text-amber-100 leading-tight mb-2">
                {displayProduct?.name}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                {displayProduct?.popular && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {displayProduct?.featured && (
                  <Badge className="bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-sm">
                    Featured
                  </Badge>
                )}
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 dark:text-amber-400">
                  ${displayProduct?.price?.toFixed(2)}
                </span>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 p-2 hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8">
            <div className="lg:col-span-2 mb-4 lg:mb-0">
              <div className="relative overflow-hidden rounded-2xl shadow-lg">
                {displayProduct?.image ? (
                  <Image
                    src={displayProduct.image}
                    alt={displayProduct.name}
                    width={400}
                    height={300}
                    className="w-full h-48 sm:h-64 lg:h-96 object-cover transition-transform duration-500 hover:scale-105"
                    style={{ borderRadius: '1rem' }}
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 lg:h-96 bg-amber-100 flex items-center justify-center text-amber-600">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <div>
                <p className="text-amber-800 dark:text-amber-200 leading-relaxed text-base sm:text-lg">
                  {displayProduct?.fullDescription}
                </p>
              </div>

              {(displayProduct?.dietary?.length ?? 0) > 0 && (
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 text-lg">
                    Dietary Information
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {displayProduct?.dietary?.map((diet) => (
                      <Badge 
                        key={diet} 
                        variant="secondary" 
                        className={`${getDietaryColor(diet)} capitalize font-medium shadow-sm`}
                      >
                        {diet}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-2xl p-3 sm:p-6 border border-amber-200/30 dark:border-amber-800/30">
            <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-4 sm:mb-6 text-lg sm:text-xl">
              Customize Your Order
            </h4>
            {renderSubItemForms()}
          </div>

          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl p-3 sm:p-6 border border-amber-200/50 dark:border-amber-800/50">
            <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-3 sm:mb-4 text-lg sm:text-xl">
              Ready to Add to Basket?
            </h4>
            <div className="mb-4 p-3 bg-white/80 dark:bg-amber-900/30 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Order Summary:</strong>
              </p>
              <ul className="mt-2 space-y-2">
                {subItems.map((item, idx) => {
                  const itemPrice = calculateItemPrice(product?.category, item.options, product?.price ?? 0)
                  return (
                    <li key={idx} className="text-amber-800 dark:text-amber-200 text-sm">
                      <span className="font-semibold">Item {idx + 1}:</span> {item.quantity} x {product?.name}
                      {item.options.size && ` (${item.options.size})`}
                      {item.options.shots && `, ${item.options.shots} shot`}
                      {item.options.milk && item.options.milk !== "regular" && `, ${item.options.milk} milk`}
                      {item.options.portion && `, ${item.options.portion} portion`}
                      <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                        (${itemPrice.toFixed(2)} × {item.quantity})
                      </span>
                    </li>
                  )
                })}
              </ul>
              <p className="text-lg font-bold mt-4 text-amber-700 dark:text-amber-300">
                Grand Total: $
                {subItems.reduce(
                  (sum, item) =>
                    sum +
                    calculateItemPrice(product?.category, item.options, product?.price ?? 0) *
                      item.quantity,
                  0
                ).toFixed(2)}
              </p>
              <p className="text-sm mt-2 text-amber-700 dark:text-amber-300">
                Basket Total: <span className="font-bold">${basketTotal.toFixed(2)}</span>
              </p>
            </div>
            <Button
              onClick={handleAddToBasket}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-3 sm:mb-4"
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              Add to Basket
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
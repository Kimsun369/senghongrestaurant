"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star, ShoppingCart, MessageCircle, Phone, MapPin, X, Plus, Minus } from "lucide-react"
import { Input } from "./ui/input"

// Product interface should match your mock-data
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

// Pricing structure for customizations
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
  // Dynamic options based on product category
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

  // Calculate total price whenever options or quantity change
  useEffect(() => {
    if (!displayProduct) return
    
    let basePrice = displayProduct.price
    let additionalCharges = 0
    
    // Add size charge if applicable
    if (options.size && PRICING.sizes[options.size as keyof typeof PRICING.sizes] !== undefined) {
      additionalCharges += PRICING.sizes[options.size as keyof typeof PRICING.sizes]
    }
    
    // Add shots charge for coffee
    if (options.shots && PRICING.coffeeShots[options.shots as keyof typeof PRICING.coffeeShots] !== undefined) {
      additionalCharges += PRICING.coffeeShots[options.shots as keyof typeof PRICING.coffeeShots]
    }
    
    // Add milk charge if premium milk selected
    if (options.milk && PRICING.milk[options.milk as keyof typeof PRICING.milk] !== undefined) {
      additionalCharges += PRICING.milk[options.milk as keyof typeof PRICING.milk]
    }
    
    // Add portion charge for food items
    if (options.portion && PRICING.portions[options.portion as keyof typeof PRICING.portions] !== undefined) {
      additionalCharges += PRICING.portions[options.portion as keyof typeof PRICING.portions]
    }
    
    const itemTotal = basePrice + additionalCharges
    setTotalPrice(itemTotal * quantity)
  }, [displayProduct, options, quantity])

  // Contact info (can be imported from your dataManager)
  const contactInfo = {
    telegram: "https://t.me/Eschoolcam",
    facebook: "https://www.facebook.com/mrr.hong.5055",
    phone: "+855123456789",
    mapUrl: "https://maps.app.goo.gl/xC3pE4kPM2C4sdaN9?g_st=ipc"
  }

  // Telegram message generator (no price)
  const generateTelegramMessage = () => {
    let optionsText = ""
    
    if (displayProduct?.category === "coffee") {
      optionsText = [
        `• Size: ${options.size}`,
        `• Shots: ${options.shots}`,
        `• Sugar level: ${options.sugar}`,
        `• Ice level: ${options.ice}`,
        `• Milk type: ${options.milk}`
      ].join("\n")
    } else if (displayProduct?.category === "tea") {
      optionsText = [
        `• Size: ${options.size}`,
        `• Sugar level: ${options.sugar}`,
        `• Ice level: ${options.ice}`
      ].join("\n")
    } else if (
      ["milk-drinks", "smoothies", "soft-drinks"].includes(displayProduct?.category || "")
    ) {
      optionsText = [
        `• Size: ${options.size}`,
        `• Ice level: ${options.ice}`
      ].join("\n")
    } else if (
      ["rice-dishes", "noodles", "sandwiches", "cakes-pastries", "salads", "snacks", "desserts"].includes(displayProduct?.category || "")
    ) {
      optionsText = [
        `• Portion size: ${options.portion}`,
        options.extras ? `• Special requests: ${options.extras}` : ""
      ].filter(Boolean).join("\n")
    }
    
    return `Hello! I would like to place an order:\n\n• ${quantity} x ${displayProduct?.name}\n${optionsText ? optionsText + "\n" : ""}\nThank you!`
  }

  const handleTelegramOrder = () => {
    const message = generateTelegramMessage()
    const encodedMessage = encodeURIComponent(message)
    const telegramUrl = `${contactInfo.telegram}?text=${encodedMessage}`
    window.open(telegramUrl, "_blank")
  }

  // Dietary color helper
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

  // Calculate base price with customizations
  const calculateItemPrice = () => {
    if (!displayProduct) return 0
    
    let basePrice = displayProduct.price
    let additionalCharges = 0
    
    // Add size charge if applicable
    if (options.size && PRICING.sizes[options.size as keyof typeof PRICING.sizes] !== undefined) {
      additionalCharges += PRICING.sizes[options.size as keyof typeof PRICING.sizes]
    }
    
    // Add shots charge for coffee
    if (options.shots && PRICING.coffeeShots[options.shots as keyof typeof PRICING.coffeeShots] !== undefined) {
      additionalCharges += PRICING.coffeeShots[options.shots as keyof typeof PRICING.coffeeShots]
    }
    
    // Add milk charge if premium milk selected
    if (options.milk && PRICING.milk[options.milk as keyof typeof PRICING.milk] !== undefined) {
      additionalCharges += PRICING.milk[options.milk as keyof typeof PRICING.milk]
    }
    
    // Add portion charge for food items
    if (options.portion && PRICING.portions[options.portion as keyof typeof PRICING.portions] !== undefined) {
      additionalCharges += PRICING.portions[options.portion as keyof typeof PRICING.portions]
    }
    
    return basePrice + additionalCharges
  }

  // Option renderers
  const renderOptions = () => {
    if (!displayProduct?.category) return null
    switch (displayProduct.category) {
      case "coffee":
        return (
          <>
            {/* Size */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Size</Label>
              <Select value={options.size} onValueChange={v => setOptions({ ...options, size: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (+${PRICING.sizes.small.toFixed(2)})</SelectItem>
                  <SelectItem value="medium">Medium (+${PRICING.sizes.medium.toFixed(2)})</SelectItem>
                  <SelectItem value="large">Large (+${PRICING.sizes.large.toFixed(2)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Coffee Shots */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Coffee Shots</Label>
              <Select value={options.shots} onValueChange={v => setOptions({ ...options, shots: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Shot (+${PRICING.coffeeShots.single.toFixed(2)})</SelectItem>
                  <SelectItem value="double">Double Shot (+${PRICING.coffeeShots.double.toFixed(2)})</SelectItem>
                  <SelectItem value="triple">Triple Shot (+${PRICING.coffeeShots.triple.toFixed(2)})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Sugar */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Sugar</Label>
              <Select value={options.sugar} onValueChange={v => setOptions({ ...options, sugar: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-sugar">No Sugar</SelectItem>
                  <SelectItem value="less-sugar">Less Sugar</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="extra-sweet">Extra Sweet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Ice */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Ice</Label>
              <Select value={options.ice} onValueChange={v => setOptions({ ...options, ice: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-ice">No Ice</SelectItem>
                  <SelectItem value="less-ice">Less Ice</SelectItem>
                  <SelectItem value="regular">Regular Ice</SelectItem>
                  <SelectItem value="extra-ice">Extra Ice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Milk */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Milk</Label>
              <Select value={options.milk} onValueChange={v => setOptions({ ...options, milk: v })}>
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
              <Select value={options.size} onValueChange={v => setOptions({ ...options, size: v })}>
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
              <Select value={options.sugar} onValueChange={v => setOptions({ ...options, sugar: v })}>
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
              <Select value={options.ice} onValueChange={v => setOptions({ ...options, ice: v })}>
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
              <Select value={options.size} onValueChange={v => setOptions({ ...options, size: v })}>
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
              <Select value={options.ice} onValueChange={v => setOptions({ ...options, ice: v })}>
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
              <Select value={options.portion} onValueChange={v => setOptions({ ...options, portion: v })}>
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
                onChange={e => setOptions({ ...options, extras: e.target.value })}
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full sm:w-[95vw] max-h-[95vh] overflow-y-auto bg-white dark:bg-amber-950 border-amber-200/50 dark:border-amber-800/50 shadow-2xl sm:rounded-2xl p-0"
        style={{ padding: 0 }}
      >
        {/* Header */}
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
            {/* Product Image */}
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

            {/* Product Details & Customization */}
            <div className="lg:col-span-3 space-y-6">
              {/* Description */}
              <div>
                <p className="text-amber-800 dark:text-amber-200 leading-relaxed text-base sm:text-lg">
                  {displayProduct?.fullDescription}
                </p>
              </div>

              {/* Dietary Information */}
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

              {/* Quantity Selector */}
              <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200/30 dark:border-amber-800/30">
                <Label className="text-base font-semibold mb-3 block">Amount</Label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-r-none border-amber-300"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="h-10 w-16 flex items-center justify-center border-y border-amber-300">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-l-none border-amber-300"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Dynamic Options */}
              <div className="bg-amber-50/50 dark:bg-amber-900/20 rounded-2xl p-3 sm:p-6 border border-amber-200/30 dark:border-amber-800/30">
                <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-4 sm:mb-6 text-lg sm:text-xl">
                  Customize Your Order
                </h4>
                <div className="space-y-4 sm:space-y-6">
                  {renderOptions()}
                </div>
              </div>
            </div>
          </div>

          {/* Order Actions */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl p-3 sm:p-6 border border-amber-200/50 dark:border-amber-800/50">
            <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-3 sm:mb-4 text-lg sm:text-xl">
              Ready to Order?
            </h4>
            <div className="mb-4 p-3 bg-white/80 dark:bg-amber-900/30 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Order Summary:</strong> {quantity} x {displayProduct?.name} 
                {options.size && ` (${options.size})`}
                {options.shots && `, ${options.shots} shot`}
                {options.milk && options.milk !== "regular" && `, ${options.milk} milk`}
                {options.portion && `, ${options.portion} portion`}
              </p>
              <p className="text-lg font-bold mt-2 text-amber-700 dark:text-amber-300">
                Total: ${totalPrice.toFixed(2)}
                <span className="text-sm font-normal ml-2 text-amber-600 dark:text-amber-400">
                  (${calculateItemPrice().toFixed(2)} × {quantity})
                </span>
              </p>
            </div>
            <Button
              onClick={handleTelegramOrder}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-3 sm:mb-4"
            >
              <ShoppingCart className="w-5 h-5 mr-3" />
              Order via Telegram
            </Button>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {contactInfo?.facebook && (
                <Button 
                  asChild 
                  variant="outline" 
                  className="h-10 sm:h-12 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors"
                >
                  <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Facebook
                  </a>
                </Button>
              )}
              {contactInfo?.phone && (
                <Button 
                  asChild 
                  variant="outline"
                  className="h-10 sm:h-12 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors"
                >
                  <a href={`tel:${contactInfo.phone}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call Us
                  </a>
                </Button>
              )}
              {contactInfo?.mapUrl && (
                <Button 
                  asChild 
                  variant="outline"
                  className="h-10 sm:h-12 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors sm:col-span-1"
                >
                  <a href={contactInfo.mapUrl} target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4 mr-2" />
                    Visit Us
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/product-card"
import { ProductModal } from "@/components/product-modal"
import { dataManager, type Product, type Category } from "@/lib/data-manager"
interface ProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-none overflow-hidden h-full">
      <CardContent className="p-2 xs:p-3 sm:p-4 h-full flex flex-col">
        {/* Product Image */}
        <div className="aspect-square bg-gradient-to-br from-cream-100 to-coffee-100 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center mb-2 xs:mb-3 sm:mb-4 flex-shrink-0 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover w-full h-full rounded-lg"
          />
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col">
          {/* Product Info */}
          <div className="flex-1 mb-2 xs:mb-3 sm:mb-4">
            {product.popular && (
              <Badge className="bg-red-600 text-white text-xs px-1.5 xs:px-2 py-0.5 mb-1 xs:mb-2 rounded-none">
                Popular
              </Badge>
            )}

            <h3 className="font-bold text-coffee-900 dark:text-cream-100 text-xs xs:text-sm sm:text-base mb-1 xs:mb-2 line-clamp-2 leading-tight">
              {product.name}
            </h3>

            <p className="text-coffee-600 dark:text-cream-300 text-xs xs:text-sm leading-relaxed line-clamp-3 mb-2 xs:mb-3">
              {product.description}
            </p>

            <p className="text-coffee-800 dark:text-cream-200 font-bold text-sm xs:text-base sm:text-lg">
              ${product.price.toFixed(2)}
            </p>
          </div>

          {/* Button Container */}
          <div className="mt-auto">
            <Button
              onClick={() => onViewDetails(product)}
              className="w-full bg-coffee-600 hover:bg-coffee-700 text-cream-100 px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 text-xs xs:text-sm sm:text-base font-medium rounded-none transition-all duration-300 transform hover:scale-105"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MainPage() {
  // Home state
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  // Menu state
  const [products, setProducts] = useState<Product[]>([])
  // Shared modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  // Menu filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  // Contact info
  const contactInfo = dataManager.getContactInfo()
  // Refs
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFeaturedProducts(dataManager.getFeaturedProducts())
    setCategories(dataManager.getCategories())
    setProducts(dataManager.getProducts())
  }, [])

  useEffect(() => {
    if (!endRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
        }
      },
      { threshold: 1 },
    )
    observer.observe(endRef.current)
    return () => observer.disconnect()
  }, [endRef])

  // Menu filter/sort logic
  const filteredProducts = useMemo(() => {
    let filtered = products
    if (searchQuery) {
      filtered = dataManager.searchProducts(searchQuery)
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "popular":
          return b.popular ? 1 : -1
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })
    return filtered
  }, [products, searchQuery, selectedCategory, sortBy])

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("name")
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900 font-serif">
      <Navigation />
      <main>
        <section id="home" className="min-h-screen bg-cream-50 dark:bg-gray-900">
          <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background with mobile-optimized overlay */}
            <div className="absolute inset-0 z-0">
              <div className="relative w-full h-full">
                <Image
                  src="/warm-coffee-shop.png"
                  alt="Café Delight Interior"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/80 via-coffee-800/70 to-coffee-900/80"></div>
            </div>

            <div className="relative z-10 container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center min-h-screen py-8 xs:py-12 sm:py-16 lg:py-20">
                <div className="text-center max-w-4xl mx-auto w-full">
                  <div className="space-y-3 xs:space-y-4 sm:space-y-6 lg:space-y-8">
                    <div className="inline-block">
                      <span className="text-cream-200 text-xs xs:text-sm font-medium tracking-wider uppercase bg-coffee-800/50 px-2 xs:px-3 py-1 xs:py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm">
                        Est. 2020
                      </span>
                    </div>
                    <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight px-2">
                      Slow
                      <span className="block text-cream-200 font-light italic">drip</span>
                    </h1>
                    <div className="w-12 xs:w-16 sm:w-24 h-1 bg-cream-300 mx-auto"></div>
                    <p className="text-base xs:text-lg sm:text-xl lg:text-2xl text-cream-100 max-w-2xl mx-auto leading-relaxed font-light px-3 xs:px-4 sm:px-6">
                      Where exceptional coffee meets culinary artistry in the heart of the city
                    </p>
                  </div>

                  <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 pt-4 xs:pt-6 sm:pt-8 justify-center px-3 xs:px-4">
                    <a href="#menu" className="w-full xs:w-auto">
                      <Button
                        size="lg"
                        className="w-full xs:w-auto bg-cream-100 hover:bg-white text-coffee-900 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-medium rounded-none border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        Explore Menu
                      </Button>
                    </a>
                    <a href="#contact" className="w-full xs:w-auto">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full xs:w-auto border-2 border-cream-200 text-cream-100 hover:bg-cream-100 hover:text-coffee-900 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-medium rounded-none bg-transparent backdrop-blur-sm transition-all duration-300"
                      >
                        Visit Us
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Daily Special Section - Mobile Optimized */}
          <section className="py-8 xs:py-12 sm:py-16 lg:py-24 bg-coffee-900 dark:bg-black text-white">
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                {/* Content */}
                <div className="space-y-3 xs:space-y-4 sm:space-y-6 lg:space-y-8">
                  <div>
                    <span className="text-cream-300 text-xs sm:text-sm font-medium tracking-wider uppercase">
                      Today Only
                    </span>
                    <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold mt-2 mb-3 xs:mb-4 sm:mb-6 px-2">Daily Special</h2>
                    <div className="w-10 xs:w-12 sm:w-16 h-1 bg-cream-300 mb-3 xs:mb-4 sm:mb-6 mx-auto lg:mx-0"></div>
                  </div>

                  <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                    <Badge className="bg-red-600 text-white text-sm xs:text-base sm:text-lg px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 sm:py-3 rounded-none">
                      20% OFF
                    </Badge>
                    <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold px-2">Khmer Special</h3>
                    <p className="text-sm xs:text-base sm:text-lg lg:text-xl text-cream-200 leading-relaxed max-w-lg mx-auto lg:mx-0 px-3 xs:px-4 lg:px-0">
                      Authentic flavors meet traditional techniques in our signature Khmer, crafted with the finest
                      ingredients and served with love.
                    </p>
                    <div className="pt-2 xs:pt-4 sm:pt-6">
                      <a href="#menu">
                        <Button className="bg-cream-100 hover:bg-white text-coffee-900 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-medium rounded-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          Order Now
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Visual element - optimized for all screens */}
                <div className="mt-8 lg:mt-0 flex justify-center lg:block relative">
                  <div className="aspect-square w-48 xs:w-56 sm:w-64 lg:w-full max-w-sm bg-gradient-to-br from-cream-200/20 to-coffee-600/20 rounded-full flex items-center justify-center">
                    <div className="text-4xl xs:text-5xl sm:text-6xl lg:text-8xl">🍜</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section id="menu" className="min-h-screen bg-cream-50 dark:bg-gray-900">
          <section className="bg-coffee-900 dark:bg-black text-white py-8 xs:py-12 sm:py-16 lg:py-24">
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              <div className="text-center lg:text-left max-w-4xl">
                <span className="text-cream-300 text-xs sm:text-sm font-medium tracking-wider uppercase">
                  Our Collection
                </span>
                <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-7xl font-bold mt-2 mb-3 xs:mb-4 sm:mb-6 leading-tight px-2 lg:px-0">Menu</h1>
                <div className="w-12 xs:w-16 sm:w-24 h-1 bg-cream-300 mb-4 xs:mb-6 sm:mb-8 mx-auto lg:mx-0"></div>
                <p className="text-base xs:text-lg sm:text-xl lg:text-2xl text-cream-200 max-w-2xl leading-relaxed font-light mx-auto lg:mx-0 px-3 xs:px-4 lg:px-0">
                  A carefully curated selection of artisanal coffee, gourmet food, and premium beverages
                </p>
              </div>
            </div>
          </section>

          {/* Mobile-optimized filter section */}
          <section className="bg-white dark:bg-gray-800 py-3 xs:py-4 sm:py-6 lg:py-8 sticky top-16 z-40 shadow-lg border-b border-coffee-100 dark:border-gray-700">
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              <div className="space-y-3 xs:space-y-4 sm:space-y-6">
                {/* Search - Full width on mobile */}
                <div className="w-full">
                  <Input
                    placeholder="Search our menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600 h-10 xs:h-11 sm:h-12 text-sm xs:text-base rounded-none focus:ring-2 focus:ring-coffee-600 w-full"
                  />
                </div>

                <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 items-stretch xs:items-center">
                  {/* Category Filter - Full width on mobile */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full xs:w-36 sm:w-48 h-10 xs:h-11 sm:h-12 bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600 rounded-none text-sm xs:text-base">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort - Full width on mobile */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full xs:w-32 sm:w-48 h-10 xs:h-11 sm:h-12 bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600 rounded-none text-sm xs:text-base">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price (Low to High)</SelectItem>
                      <SelectItem value="price-high">Price (High to Low)</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Clear Filters - Full width on mobile */}
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-coffee-300 text-coffee-700 hover:bg-coffee-100 dark:border-gray-600 dark:text-cream-200 dark:hover:bg-gray-700 bg-transparent h-10 xs:h-11 sm:h-12 px-3 xs:px-4 sm:px-6 rounded-none text-sm xs:text-base"
                  >
                    Clear
                  </Button>
                </div>

                {/* Active Filters - Mobile optimized */}
                {(searchQuery || selectedCategory !== "all" || sortBy !== "name") && (
                  <div className="flex flex-wrap gap-1.5 xs:gap-2 pt-2 border-t border-coffee-100 dark:border-gray-700">
                    {searchQuery && (
                      <Badge
                        variant="secondary"
                        className="bg-coffee-100 text-coffee-800 dark:bg-coffee-800 dark:text-coffee-100 px-2 xs:px-3 py-1 text-xs sm:text-sm"
                      >
                        Search: "{searchQuery}"
                      </Badge>
                    )}
                    {selectedCategory !== "all" && (
                      <Badge
                        variant="secondary"
                        className="bg-coffee-100 text-coffee-800 dark:bg-coffee-800 dark:text-coffee-100 px-2 xs:px-3 py-1 text-xs sm:text-sm"
                      >
                        Category: {categories.find((c) => c.id === selectedCategory)?.name}
                      </Badge>
                    )}
                    {sortBy !== "name" && (
                      <Badge
                        variant="secondary"
                        className="bg-coffee-100 text-coffee-800 dark:bg-coffee-800 dark:text-coffee-100 px-2 xs:px-3 py-1 text-xs sm:text-sm"
                      >
                        Sort: {sortBy.replace("-", " ")}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Products Section - Mobile optimized grid */}
          <section className="py-6 xs:py-8 sm:py-12 lg:py-16">
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8 xs:py-12 sm:py-16 lg:py-24">
                  <div className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl mb-4 xs:mb-6 sm:mb-8">🔍</div>
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-coffee-900 dark:text-cream-100 mb-2 xs:mb-3 sm:mb-4 px-2">
                    No items found
                  </h3>
                  <p className="text-coffee-600 dark:text-cream-300 mb-4 xs:mb-6 sm:mb-8 text-sm xs:text-base sm:text-lg px-3 xs:px-4">
                    Try adjusting your search criteria or browse all categories
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-coffee-600 hover:bg-coffee-700 text-cream-100 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg rounded-none"
                  >
                    Show All Items
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4 xs:mb-6 sm:mb-8 lg:mb-12 px-1">
                    <h2 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-coffee-900 dark:text-cream-100">
                      {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""} found
                    </h2>
                  </div>

                  {/* Responsive grid - 2 cols on mobile, more on larger screens */}
                  <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onViewDetails={handleViewProduct} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        </section>

        {/* Contact Section - Mobile optimized */}
        <section id="contact" className="min-h-screen bg-cream-50 dark:bg-gray-900">
          {/* Header - Mobile optimized */}
          <div className="bg-coffee-900 dark:bg-black text-white py-12 xs:py-16 sm:py-20 lg:py-24">
            <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl text-center lg:text-left">
                <span className="text-cream-300 text-xs xs:text-sm font-medium tracking-wider uppercase">Get in Touch</span>
                <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-2 mb-4 xs:mb-6 leading-tight px-2 lg:px-0">Contact</h1>
                <div className="w-16 xs:w-20 sm:w-24 h-1 bg-cream-300 mb-6 xs:mb-8 mx-auto lg:mx-0"></div>
                <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-cream-200 max-w-2xl leading-relaxed font-light mx-auto lg:mx-0 px-3 xs:px-4 lg:px-0">
                  Visit us for an unforgettable culinary experience or reach out for reservations and inquiries
                </p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-12 sm:py-16">
            {/* Mobile-first grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xs:gap-8 sm:gap-10 lg:gap-12">
              {/* Contact Methods */}
              <div className="space-y-6 xs:space-y-8">
                <div>
                  <h3 className="text-xl xs:text-2xl font-bold text-coffee-900 dark:text-cream-100 mb-4 xs:mb-6 text-center lg:text-left">Connect With Us</h3>
                  <div className="space-y-3 xs:space-y-4">
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="flex items-center gap-3 xs:gap-4 p-3 xs:p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="w-10 xs:w-12 h-10 xs:h-12 bg-coffee-600 text-white rounded-lg flex items-center justify-center text-lg xs:text-xl flex-shrink-0">
                        📞
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-coffee-900 dark:text-cream-100 text-sm xs:text-base">Call Us</h4>
                        <p className="text-coffee-600 dark:text-cream-300 text-xs xs:text-sm truncate">{contactInfo.phone}</p>
                      </div>
                    </a>

                    <a
                      href={contactInfo.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 xs:gap-4 p-3 xs:p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="w-10 xs:w-12 h-10 xs:h-12 bg-coffee-600 text-white rounded-lg flex items-center justify-center text-lg xs:text-xl flex-shrink-0">
                        📱
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-coffee-900 dark:text-cream-100 text-sm xs:text-base">Telegram</h4>
                        <p className="text-coffee-600 dark:text-cream-300 text-xs xs:text-sm">Message us</p>
                      </div>
                    </a>

                    <a
                      href={contactInfo.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 xs:gap-4 p-3 xs:p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="w-10 xs:w-12 h-10 xs:h-12 bg-coffee-600 text-white rounded-lg flex items-center justify-center text-lg xs:text-xl flex-shrink-0">
                        💬
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-coffee-900 dark:text-cream-100 text-sm xs:text-base">Facebook</h4>
                        <p className="text-coffee-600 dark:text-cream-300 text-xs xs:text-sm">Follow us</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="space-y-6 xs:space-y-8">
                <div>
                  <h3 className="text-xl xs:text-2xl font-bold text-coffee-900 dark:text-cream-100 mb-4 xs:mb-6 text-center lg:text-left">Visit Our Café</h3>

                  <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                    <CardContent className="p-4 xs:p-6 space-y-4 xs:space-y-6">
                      <div>
                        <h4 className="font-semibold text-coffee-900 dark:text-cream-100 mb-2 flex items-center gap-2 text-sm xs:text-base">
                          📍 Address
                        </h4>
                        <p className="text-coffee-600 dark:text-cream-300 leading-relaxed text-sm xs:text-base">{contactInfo.address}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-coffee-900 dark:text-cream-100 mb-3 flex items-center gap-2 text-sm xs:text-base">
                          🕒 Opening Hours
                        </h4>
                        <div className="space-y-2 text-coffee-600 dark:text-cream-300 text-sm xs:text-base">
                          <div className="flex justify-between items-center py-1">
                            <span className="font-medium">Monday - Thursday</span>
                            <span className="text-coffee-800 dark:text-cream-200">{contactInfo.hours.monday}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="font-medium">Friday - Saturday</span>
                            <span className="text-coffee-800 dark:text-cream-200">{contactInfo.hours.friday}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="font-medium">Sunday</span>
                            <span className="text-coffee-800 dark:text-cream-200">{contactInfo.hours.sunday}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Map - Mobile optimized */}
              <div>
                <h3 className="text-xl xs:text-2xl font-bold text-coffee-900 dark:text-cream-100 mb-4 xs:mb-6 text-center lg:text-left">Find Us</h3>
                <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg h-64 xs:h-72 sm:h-80">
                  <CardContent className="p-0 h-full">
                    <div className="h-full bg-gradient-to-br from-coffee-100 via-cream-200 to-coffee-200 dark:from-coffee-800 dark:via-gray-700 dark:to-coffee-900 flex items-center justify-center rounded-lg">
                      <div className="text-center p-4 xs:p-6">
                        <div className="text-3xl xs:text-4xl mb-3 xs:mb-4">🗺️</div>
                        <h4 className="text-lg xs:text-xl font-bold text-coffee-900 dark:text-cream-100 mb-2 xs:mb-3">Our Location</h4>
                        <p className="text-coffee-700 dark:text-cream-300 mb-4 xs:mb-6 font-medium text-sm xs:text-base">Heart of the city</p>
                        <a
                          href={contactInfo.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block bg-coffee-600 hover:bg-coffee-700 text-cream-100 px-4 xs:px-6 py-2.5 xs:py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl text-sm xs:text-base"
                        >
                          Open in Maps
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <div ref={endRef} className="h-2" />
      </main>
      <Footer />
    </div>
  )
}
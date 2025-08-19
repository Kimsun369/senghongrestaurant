import mockData from "../data/mock-data.json"

export interface Product {
  icon: ReactNode
  id: string
  name: string
  price: number
  category: string
  image: string
  description: string
  fullDescription: string
  dietary: string[]
  popular: boolean
  featured: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
}

export interface User {
  id: string
  username: string
  password: string
  role: "admin" | "customer"
  name: string
}

export interface DailySpecial {
  id: string
  productId: string
  discount: number
  validUntil: string
}

export interface ContactInfo {
  phone: string
  telegram: string
  facebook: string
  address: string
  mapUrl: string
  hours: Record<string, string>
}

class DataManager {
  private products: Product[] = []
  private categories: Category[] = []
  private users: User[] = []
  private dailySpecials: DailySpecial[] = []
  private contactInfo: ContactInfo
  private favorites: string[] = []
  private isClient = false

  constructor() {
    this.isClient = typeof window !== "undefined"
    this.loadData()
    this.contactInfo = mockData.contactInfo
  }

  private loadData() {
    if (this.isClient) {
      const savedProducts = localStorage.getItem("restaurant-products")
      const savedCategories = localStorage.getItem("restaurant-categories")
      const savedFavorites = localStorage.getItem("restaurant-favorites")

      this.products = savedProducts ? JSON.parse(savedProducts) : mockData.products
      this.categories = savedCategories ? JSON.parse(savedCategories) : mockData.categories
      this.favorites = savedFavorites ? JSON.parse(savedFavorites) : []
    } else {
      this.products = mockData.products
      this.categories = mockData.categories
      this.favorites = []
    }

    this.users = mockData.users.map((u) => ({
      ...u,
      role: u.role === "admin" ? "admin" : "customer",
    }))
    this.dailySpecials = mockData.dailySpecials
  }

  private saveProducts() {
    if (this.isClient) {
      localStorage.setItem("restaurant-products", JSON.stringify(this.products))
    }
  }

  private saveCategories() {
    if (this.isClient) {
      localStorage.setItem("restaurant-categories", JSON.stringify(this.categories))
    }
  }

  private saveFavorites() {
    if (this.isClient) {
      localStorage.setItem("restaurant-favorites", JSON.stringify(this.favorites))
    }
  }

  // Product methods
  getProducts(): Product[] {
    return this.products
  }

  getProduct(id: string): Product | undefined {
    return this.products.find((p) => p.id === id)
  }

  getProductsByCategory(categoryId: string): Product[] {
    return this.products.filter((p) => p.category === categoryId)
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter((p) => p.featured)
  }

  getPopularProducts(): Product[] {
    return this.products.filter((p) => p.popular)
  }

  searchProducts(query: string): Product[] {
    const lowercaseQuery = query.toLowerCase()
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowercaseQuery) ||
        p.description.toLowerCase().includes(lowercaseQuery) ||
        p.category.toLowerCase().includes(lowercaseQuery),
    )
  }

  addProduct(product: Omit<Product, "id">): Product {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    }
    this.products.push(newProduct)
    this.saveProducts()
    return newProduct
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex((p) => p.id === id)
    if (index === -1) return null

    this.products[index] = { ...this.products[index], ...updates }
    this.saveProducts()
    return this.products[index]
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex((p) => p.id === id)
    if (index === -1) return false

    this.products.splice(index, 1)
    this.saveProducts()
    return true
  }

  // Category methods
  getCategories(): Category[] {
    return this.categories
  }

  getCategory(id: string): Category | undefined {
    return this.categories.find((c) => c.id === id)
  }

  addCategory(category: Omit<Category, "id">): Category {
    const newCategory: Category = {
      ...category,
      id: category.name.toLowerCase().replace(/\s+/g, "-"),
    }
    this.categories.push(newCategory)
    this.saveCategories()
    return newCategory
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex((c) => c.id === id)
    if (index === -1) return null

    this.categories[index] = { ...this.categories[index], ...updates }
    this.saveCategories()
    return this.categories[index]
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex((c) => c.id === id)
    if (index === -1) return false

    // Remove products in this category
    this.products = this.products.filter((p) => p.category !== id)
    this.categories.splice(index, 1)
    this.saveCategories()
    this.saveProducts()
    return true
  }

  // User methods
  getUsers(): User[] {
    return this.users
  }

  authenticateUser(username: string, password: string): User | null {
    return this.users.find((u) => u.username === username && u.password === password) || null
  }

  // Favorites methods
  getFavorites(): string[] {
    return this.favorites
  }

  addToFavorites(productId: string): void {
    if (!this.favorites.includes(productId)) {
      this.favorites.push(productId)
      this.saveFavorites()
    }
  }

  removeFromFavorites(productId: string): void {
    this.favorites = this.favorites.filter((id) => id !== productId)
    this.saveFavorites()
  }

  isFavorite(productId: string): boolean {
    return this.favorites.includes(productId)
  }

  // Daily specials methods
  getDailySpecials(): DailySpecial[] {
    return this.dailySpecials
  }

  getSpecialProducts(): Product[] {
    const specialProductIds = this.dailySpecials.map((s) => s.productId)
    return this.products.filter((p) => specialProductIds.includes(p.id))
  }

  // Contact info
  getContactInfo(): ContactInfo {
    return this.contactInfo
  }
}

export const contactInfo = {
  facebook: "https://www.facebook.com/mrr.hong.5055",
  phone: "+855965520593",
  mapUrl: "https://maps.app.goo.gl/xC3pE4kPM2C4sdaN9?g_st=ipc"
}

export const dataManager = new DataManager()

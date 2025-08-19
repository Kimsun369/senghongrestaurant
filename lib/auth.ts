import type { User } from "./data-manager"

class AuthManager {
  private currentUser: User | null = null
  private isInitialized = false

  constructor() {
    // Don't load user data during SSR
    if (typeof window !== "undefined") {
      this.loadUser()
    }
  }

  private loadUser() {
    if (typeof window === "undefined") return

    try {
      const savedUser = localStorage.getItem("restaurant-current-user")
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser)
      }
      this.isInitialized = true
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
      this.isInitialized = true
    }
  }

  private saveUser() {
    if (typeof window === "undefined") return

    try {
      if (this.currentUser) {
        localStorage.setItem("restaurant-current-user", JSON.stringify(this.currentUser))
      } else {
        localStorage.removeItem("restaurant-current-user")
      }
    } catch (error) {
      console.error("Error saving user to localStorage:", error)
    }
  }

  private ensureInitialized() {
    if (!this.isInitialized && typeof window !== "undefined") {
      this.loadUser()
    }
  }

  login(user: User): void {
    this.ensureInitialized()
    this.currentUser = user
    this.saveUser()
  }

  logout(): void {
    this.ensureInitialized()
    this.currentUser = null
    this.saveUser()
  }

  getCurrentUser(): User | null {
    this.ensureInitialized()
    return this.currentUser
  }

  isLoggedIn(): boolean {
    this.ensureInitialized()
    return this.currentUser !== null
  }

  isAdmin(): boolean {
    this.ensureInitialized()
    return this.currentUser?.role === "admin"
  }

  isCustomer(): boolean {
    this.ensureInitialized()
    return this.currentUser?.role === "customer"
  }
}

export const authManager = new AuthManager()

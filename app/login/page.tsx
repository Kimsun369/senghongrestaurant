"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { dataManager } from "@/lib/data-manager"
import { authManager } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = dataManager.authenticateUser(formData.username, formData.password)

      if (user) {
        authManager.login(user)

        // Redirect based on role
        if (user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "admin" | "customer") => {
    const demoCredentials = {
      admin: { username: "admin", password: "admin123" },
      customer: { username: "customer", password: "customer123" },
    }

    setFormData(demoCredentials[role])
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-coffee-900 dark:text-cream-100">Welcome Back</CardTitle>
              <CardDescription className="text-coffee-600 dark:text-cream-300">
                Sign in to your account to access your favorites and more
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-coffee-900 dark:text-cream-100">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-coffee-900 dark:text-cream-100">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-coffee-600 hover:bg-coffee-700 text-cream-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              {/* Demo Login Buttons */}
              <div className="space-y-3 pt-4 border-t border-coffee-200 dark:border-gray-600">
                <p className="text-sm text-coffee-600 dark:text-cream-300 text-center">Demo Accounts</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleDemoLogin("admin")}
                    className="border-coffee-300 text-coffee-700 hover:bg-coffee-100 dark:border-gray-600 dark:text-cream-200 dark:hover:bg-gray-700 bg-transparent"
                  >
                    Admin Demo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDemoLogin("customer")}
                    className="border-coffee-300 text-coffee-700 hover:bg-coffee-100 dark:border-gray-600 dark:text-cream-200 dark:hover:bg-gray-700 bg-transparent"
                  >
                    Customer Demo
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-coffee-600 dark:text-cream-300">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-coffee-800 dark:text-cream-100 font-semibold hover:underline">
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials Info */}
          <Card className="mt-6 bg-gold-50 dark:bg-gold-900/20 border-gold-200 dark:border-gold-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gold-800 dark:text-gold-200 mb-3">Demo Credentials</h3>
              <div className="space-y-2 text-sm text-gold-700 dark:text-gold-300">
                <div>
                  <strong>Admin:</strong> username: admin, password: admin123
                </div>
                <div>
                  <strong>Customer:</strong> username: customer, password: customer123
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

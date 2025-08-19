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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
    setSuccess("")
  }

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      // Mock registration success
      setSuccess("Account created successfully! This is a demo - no actual account was created.")

      // Simulate API delay
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (err) {
      setError("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 dark:bg-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-coffee-900 dark:text-cream-100">Create Account</CardTitle>
              <CardDescription className="text-coffee-600 dark:text-cream-300">
                Join us to save your favorites and get personalized recommendations
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                  <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                  <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-coffee-900 dark:text-cream-100">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                    placeholder="Enter your full name"
                  />
                </div>

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
                    placeholder="Choose a username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-coffee-900 dark:text-cream-100">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-coffee-900 dark:text-cream-100">
                    Account Type
                  </Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="admin">Admin (Demo)</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="Create a password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-coffee-900 dark:text-cream-100">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                    placeholder="Confirm your password"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-coffee-600 hover:bg-coffee-700 text-cream-100"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-coffee-600 dark:text-cream-300">
                  Already have an account?{" "}
                  <Link href="/login" className="text-coffee-800 dark:text-cream-100 font-semibold hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Demo Notice */}
          <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Demo Notice</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This is a demo registration form. No actual accounts are created. Use the existing demo accounts on the
                login page to test the application.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

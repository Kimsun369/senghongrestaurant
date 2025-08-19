"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { dataManager, type Product, type Category } from "@/lib/data-manager"

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    setProducts(dataManager.getProducts())
    setCategories(dataManager.getCategories())
  }, [])

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    featuredProducts: products.filter((p) => p.featured).length,
    popularProducts: products.filter((p) => p.popular).length,
  }

  const recentProducts = products.slice(-5).reverse()

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-coffee-900 dark:text-cream-100">Dashboard</h1>
          <p className="text-coffee-600 dark:text-cream-300">Welcome to your restaurant management panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-coffee-600 dark:text-cream-300">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coffee-900 dark:text-cream-100">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-coffee-600 dark:text-cream-300">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coffee-900 dark:text-cream-100">{stats.totalCategories}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-coffee-600 dark:text-cream-300">Featured Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coffee-900 dark:text-cream-100">{stats.featuredProducts}</div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-coffee-600 dark:text-cream-300">Popular Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-coffee-900 dark:text-cream-100">{stats.popularProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Products */}
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-coffee-900 dark:text-cream-100">Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-cream-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-coffee-200 dark:bg-coffee-700 rounded-lg flex items-center justify-center">
                      <span className="text-coffee-700 dark:text-coffee-300">🍽️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-coffee-900 dark:text-cream-100">{product.name}</h4>
                      <p className="text-sm text-coffee-600 dark:text-cream-300">{product.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-gold-600 dark:text-gold-400">${product.price.toFixed(2)}</span>
                    <div className="flex space-x-1">
                      {product.featured && <Badge className="bg-coffee-600 text-white">Featured</Badge>}
                      {product.popular && <Badge className="bg-gold-500 text-white">Popular</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

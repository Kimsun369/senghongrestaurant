"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { dataManager, type Product, type Category } from "@/lib/data-manager"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    setProducts(dataManager.getProducts())
    setCategories(dataManager.getCategories())
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dataManager.deleteProduct(id)
      refreshData()
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowAddForm(true)
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-coffee-900 dark:text-cream-100">Products Management</h1>
            <p className="text-coffee-600 dark:text-cream-300">Manage your menu items</p>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null)
              setShowAddForm(true)
            }}
            className="bg-coffee-600 hover:bg-coffee-700 text-cream-100"
          >
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700 mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600">
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
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-coffee-900 dark:text-cream-100">Products ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-cream-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-coffee-200 dark:bg-coffee-700 rounded-lg flex items-center justify-center">
                      <span className="text-coffee-700 dark:text-coffee-300">🍽️</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-coffee-900 dark:text-cream-100">{product.name}</h4>
                      <p className="text-sm text-coffee-600 dark:text-cream-300">{product.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant="secondary"
                          className="bg-coffee-100 text-coffee-800 dark:bg-coffee-800 dark:text-coffee-100"
                        >
                          {categories.find((c) => c.id === product.category)?.name}
                        </Badge>
                        {product.featured && <Badge className="bg-coffee-600 text-white">Featured</Badge>}
                        {product.popular && <Badge className="bg-gold-500 text-white">Popular</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-gold-600 dark:text-gold-400 text-lg">
                      ${product.price.toFixed(2)}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="border-coffee-300 text-coffee-700 hover:bg-coffee-100 dark:border-gray-600 dark:text-cream-200 dark:hover:bg-gray-600 bg-transparent"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 bg-transparent"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Product Modal */}
        {showAddForm && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSave={() => {
              refreshData()
              setShowAddForm(false)
              setEditingProduct(null)
            }}
            onCancel={() => {
              setShowAddForm(false)
              setEditingProduct(null)
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}

function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product | null
  categories: Category[]
  onSave: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    category: product?.category || "",
    description: product?.description || "",
    fullDescription: product?.fullDescription || "",
    dietary: product?.dietary || [],
    popular: product?.popular || false,
    featured: product?.featured || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (product) {
      dataManager.updateProduct(product.id, {
        ...formData,
        image: product.image, // Keep existing image
      })
    } else {
      dataManager.addProduct({
        ...formData,
        image: "/placeholder.svg?height=300&width=300",
      })
    }

    onSave()
  }

  const handleDietaryChange = (dietary: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        dietary: [...prev.dietary, dietary],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        dietary: prev.dietary.filter((d) => d !== dietary),
      }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-coffee-900 dark:text-cream-100">
            {product ? "Edit Product" : "Add New Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-coffee-900 dark:text-cream-100 mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coffee-900 dark:text-cream-100 mb-1">Price</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) }))}
                  required
                  className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-900 dark:text-cream-100 mb-1">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-900 dark:text-cream-100 mb-1">
                Short Description
              </label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                required
                className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-900 dark:text-cream-100 mb-1">
                Full Description
              </label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullDescription: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-cream-50 dark:bg-gray-700 border border-coffee-200 dark:border-gray-600 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-900 dark:text-cream-100 mb-2">
                Dietary Information
              </label>
              <div className="flex flex-wrap gap-3">
                {["vegan", "spicy", "gluten-free"].map((dietary) => (
                  <label key={dietary} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.dietary.includes(dietary)}
                      onChange={(e) => handleDietaryChange(dietary, e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm text-coffee-900 dark:text-cream-100 capitalize">{dietary}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData((prev) => ({ ...prev, popular: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm text-coffee-900 dark:text-cream-100">Popular</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm text-coffee-900 dark:text-cream-100">Featured</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-coffee-300 text-coffee-700 hover:bg-coffee-100 dark:border-gray-600 dark:text-cream-200 dark:hover:bg-gray-700 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-coffee-600 hover:bg-coffee-700 text-cream-100">
                {product ? "Update" : "Add"} Product
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLayout } from "@/components/admin-layout"
import { dataManager, type Category } from "@/lib/data-manager"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = () => {
    setCategories(dataManager.getCategories())
  }

  const handleDeleteCategory = (id: string) => {
    const productsInCategory = dataManager.getProductsByCategory(id)
    if (productsInCategory.length > 0) {
      alert(`Cannot delete category. It contains ${productsInCategory.length} products.`)
      return
    }

    if (confirm("Are you sure you want to delete this category?")) {
      dataManager.deleteCategory(id)
      refreshData()
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowAddForm(true)
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-coffee-900 dark:text-cream-100">Categories Management</h1>
            <p className="text-coffee-600 dark:text-cream-300">Organize your menu items</p>
          </div>
          <Button
            onClick={() => {
              setEditingCategory(null)
              setShowAddForm(true)
            }}
            className="bg-coffee-600 hover:bg-coffee-700 text-cream-100"
          >
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const productCount = dataManager.getProductsByCategory(category.id).length
            return (
              <Card
                key={category.id}
                className="bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700 hover-lift"
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <CardTitle className="text-coffee-900 dark:text-cream-100">{category.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-coffee-600 dark:text-cream-300">{productCount} products</p>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                      className="border-coffee-300 text-coffee-700 hover:bg-coffee-100 dark:border-gray-600 dark:text-cream-200 dark:hover:bg-gray-600 bg-transparent"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 bg-transparent"
                      disabled={productCount > 0}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Add/Edit Category Modal */}
        {showAddForm && (
          <CategoryForm
            category={editingCategory}
            onSave={() => {
              refreshData()
              setShowAddForm(false)
              setEditingCategory(null)
            }}
            onCancel={() => {
              setShowAddForm(false)
              setEditingCategory(null)
            }}
          />
        )}
      </div>
    </AdminLayout>
  )
}

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: Category | null
  onSave: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    icon: category?.icon || "🍽️",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (category) {
      dataManager.updateCategory(category.id, formData)
    } else {
      dataManager.addCategory(formData)
    }

    onSave()
  }

  const commonIcons = ["☕", "🍵", "🥛", "🥤", "🍚", "🍜", "🥪", "🧁", "🥗", "🍿", "🍰", "🍽️"]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-coffee-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-coffee-900 dark:text-cream-100">
            {category ? "Edit Category" : "Add New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-coffee-900 dark:text-cream-100 mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                placeholder="Category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-900 dark:text-cream-100 mb-2">Icon</label>
              <div className="grid grid-cols-6 gap-2 mb-3">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                    className={`p-2 text-2xl border rounded hover:bg-coffee-100 dark:hover:bg-gray-700 ${
                      formData.icon === icon
                        ? "border-coffee-600 bg-coffee-100 dark:border-coffee-400 dark:bg-gray-700"
                        : "border-coffee-200 dark:border-gray-600"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <Input
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                className="bg-cream-50 dark:bg-gray-700 border-coffee-200 dark:border-gray-600"
                placeholder="Or enter custom icon"
              />
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
                {category ? "Update" : "Add"} Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

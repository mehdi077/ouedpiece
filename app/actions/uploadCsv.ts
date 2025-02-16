// Server action for handling CSV file uploads and processing
'use server'

import { ConvexHttpClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

// Process CSV for models
export async function processModelsCsv(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file uploaded')

    const text = await file.text()
    const rows = text.split('\n').map(row => row.split(','))
    const headers = rows[0].map(h => h.trim().toLowerCase())

    // Validate headers
    if (!headers.includes('brand') || !headers.includes('model')) {
      throw new Error('CSV must contain "brand" and "model" columns')
    }

    const brandIndex = headers.indexOf('brand')
    const modelIndex = headers.indexOf('model')

    // Process each row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row.length < 2) continue // Skip empty rows

      const brandName = row[brandIndex].trim()
      const modelName = row[modelIndex].trim()

      if (!brandName || !modelName) continue

      // Get or create brand
      const brands = await client.query(api.form.getBrands)
      let brandId = brands.find(b => b.name.toLowerCase() === brandName.toLowerCase())?._id

      if (!brandId) {
        const result = await client.mutation(api.admin.addBrands, {
          brands: [{ name: brandName }]
        })
        brandId = result[0].id
      }

      // Add model
      await client.mutation(api.admin.addModels, {
        brandId,
        models: [{ name: modelName }]
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing CSV:', error)
    return { success: false, error: (error as Error).message }
  }
}

// Process CSV for subcategories
export async function processSubcategoriesCsv(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) throw new Error('No file uploaded')

    const text = await file.text()
    const rows = text.split('\n').map(row => row.split(','))
    const headers = rows[0].map(h => h.trim().toLowerCase())

    // Validate headers
    if (!headers.includes('category') || !headers.includes('subcategory')) {
      throw new Error('CSV must contain "category" and "subcategory" columns')
    }

    const categoryIndex = headers.indexOf('category')
    const subcategoryIndex = headers.indexOf('subcategory')

    // Process each row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row.length < 2) continue // Skip empty rows

      const categoryName = row[categoryIndex].trim()
      const subcategoryName = row[subcategoryIndex].trim()

      if (!categoryName || !subcategoryName) continue

      // Get or create category
      const categories = await client.query(api.form.getCategories)
      let categoryId = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase())?._id

      if (!categoryId) {
        const result = await client.mutation(api.admin.addCategories, {
          categories: [{ name: categoryName }]
        })
        categoryId = result[0].id
      }

      // Add subcategory
      await client.mutation(api.admin.addSubcategories, {
        categoryId,
        subcategories: [{ name: subcategoryName }]
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing CSV:', error)
    return { success: false, error: (error as Error).message }
  }
} 
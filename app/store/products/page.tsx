"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Breadcrumb } from "@/components/breadcrumb"
import { ProductCard } from "@/components/product-card"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  discount?: number
  image?: string
  badge?: string
  isHot?: boolean
  stockCount?: number
  categoryId: string
}

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products")
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (err) {
        console.error("Failed to load products", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Breadcrumb
            items={[
              { label: "HOME", href: "/" },
              { label: "STORE", href: "/store" },
              { label: "ALL PRODUCTS", href: "/store/products" },
            ]}
          />

          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-sky-600" />
              <div>
                <h1 className="text-xl font-bold text-slate-900">สินค้าทั้งหมด</h1>
                <p className="text-sm text-slate-500 font-medium">ALL PRODUCTS ({products.length} รายการ)</p>
              </div>
            </div>
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/store" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                ย้อนกลับ
              </Link>
            </Button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

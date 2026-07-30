"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Flame, ArrowRight, PackageCheck } from "lucide-react"
import { ProductCard } from "@/components/product-card"

export function RecommendedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products?isHot=true&limit=5")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.map(p => ({
            ...p,
            id: p.id.toString(),
            category: p.category,
            image: p.image || "https://placehold.co/400x400/0284c7/ffffff?text=Product"
          })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section className="mb-14">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-sky-100 animate-pulse" />
            <div className="space-y-2">
              <div className="h-5 w-36 bg-sky-100 animate-pulse rounded-md" />
              <div className="h-3 w-28 bg-slate-100 animate-pulse rounded-md" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/70 border border-sky-100" />
          ))}
        </div>
      </section>
    )
  }

  if (products.length === 0) return null

  return (
    <section className="mb-14">
      {/* Section Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-sky-500/20">
            <Flame className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">สินค้าแนะนำยอดนิยม</h2>
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-extrabold text-sky-700 border border-sky-200">HOT</span>
            </div>
            <p className="text-xs font-bold text-sky-600 uppercase tracking-wider">POPULAR RECOMMENDED PRODUCTS</p>
          </div>
        </div>

        <Link
          href="/store"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition-all border border-sky-100"
        >
          ดูสินค้าทั้งหมด
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product, idx) => (
          <div 
            key={product.id} 
            className="animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.08}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-6 text-center sm:hidden">
        <Link
          href="/store"
          className="blue-gradient-btn inline-flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded-xl w-full justify-center shadow-md shadow-sky-500/20"
        >
          <PackageCheck className="h-4 w-4" />
          ดูสินค้าทั้งหมดเพิ่มเติม
        </Link>
      </div>
    </section>
  )
}

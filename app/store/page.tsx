"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Flame, Tag, LayoutGrid, Package, ArrowLeft, ArrowRight, Store } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  icon?: string
}

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
  category?: Category
}

function StoreContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories"),
        ])

        if (prodRes.ok) {
          const prods = await prodRes.json()
          setProducts(prods)
        }
        if (catRes.ok) {
          const cats = await catRes.json()
          setCategories(cats)
        }
      } catch (err) {
        console.error("Failed to load store data", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredProducts = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 animate-fade-in-up">
      {/* Search & Categories Bar */}
      <div className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-bold text-sky-700 border border-sky-100">
            <Store className="h-3.5 w-3.5" />
            <span>ศูนย์รวมสินค้าระบบทั้งหมด</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">คลังสินค้าออนไลน์ทั้งหมด</h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">เลือกชมและสั่งซื้อสินค้าไอที บัญชีพรีเมียม และซอฟต์แวร์ลิขสิทธิ์แท้ 24 ชม.</p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px] z-10">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-sky-100 bg-slate-50 pl-10 pr-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">หมวดหมู่สินค้า</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2",
              !selectedCategory
                ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/25"
                : "bg-white border-sky-100 text-slate-600 hover:bg-sky-50"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            ทั้งหมด ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border shrink-0 flex items-center gap-2",
                  isSelected
                    ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/25"
                    : "bg-white border-sky-100 text-slate-600 hover:bg-sky-50"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/70 border border-sky-100" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-white p-16 text-center space-y-3">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Package className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">ไม่พบสินค้าในหมวดหมู่นี้</h3>
          <p className="text-slate-500 text-sm">ลองเลือกหมวดหมู่อื่น หรือค้นหาด้วยคำอื่น</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function StorePage() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-500 text-center">กำลังโหลดข้อมูล...</div>}>
      <StoreContent />
    </Suspense>
  )
}

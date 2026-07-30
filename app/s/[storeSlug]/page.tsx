"use client"

import { useState, useEffect, useCallback, use } from "react"
import NextLink from "next/link"
import {
  Store,
  ShoppingBag,
  Crown,
  ShieldCheck,
  Search,
  CheckCircle2,
  QrCode,
  Building2,
  Package,
  Zap,
  ArrowLeft,
  Sparkles,
} from "lucide-react"
import { ProductCard } from "@/components/product-card"

interface TenantStore {
  id: string
  slug: string
  name: string
  description: string
  primaryColor: string
  accentColor: string
  logo?: string
  banner?: string
  paymentPromptPay?: string
  paymentBankName?: string
  paymentAccountNo?: string
  paymentAccountName?: string
  paymentQrImage?: string
  products: any[]
  categories: any[]
  owner: { name: string; username: string }
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop"

export default function PublicTenantStorePage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = use(params)
  const [store, setStore] = useState<TenantStore | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchStore = useCallback(async () => {
    try {
      const res = await fetch(`/api/tenants?slug=${storeSlug}`)
      if (res.ok) {
        setStore(await res.json())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [storeSlug])

  useEffect(() => {
    fetchStore()
  }, [fetchStore])

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center space-y-4">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
          <Store className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">ไม่พบร้านค้านี้ในระบบ</h2>
        <p className="text-slate-500 text-sm">กรุณาตรวจสอบชื่อ URL Slug หรือค้นหาร้านค้าอื่นในระบบ</p>
        <NextLink href="/stores" className="blue-gradient-btn inline-flex px-6 py-3 rounded-2xl text-sm font-bold">
          ไปยังหน้ารวมร้านค้าทั้งหมด
        </NextLink>
      </div>
    )
  }

  const themeColor = store.primaryColor || "#0284c7"
  const bannerImg = store.banner || DEFAULT_BANNER

  const filteredProducts = (store.products || []).filter((p: any) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen space-y-8 pb-16 animate-fade-in-up">
      
      {/* Store Banner & Hero Header Card */}
      <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden bg-slate-950 shadow-lg">
        <img
          src={bannerImg}
          alt={store.name}
          className="w-full h-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end">
          <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 pb-6 sm:pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
            
            <div className="flex items-center gap-4 sm:gap-6">
              <div
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl flex items-center justify-center font-black text-3xl sm:text-4xl shadow-2xl border-4 border-white/90 shrink-0 overflow-hidden"
                style={{ backgroundColor: themeColor }}
              >
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="h-full w-full object-cover" />
                ) : (
                  store.name.charAt(0).toUpperCase()
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-black text-white shadow-md"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Crown className="h-3.5 w-3.5" />
                    VERIFIED STORE
                  </div>
                  <span className="text-xs font-mono text-sky-200 bg-black/40 px-2.5 py-0.5 rounded-md border border-white/20">
                    /s/{store.slug}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black drop-shadow-md text-white tracking-tight">
                  {store.name}
                </h1>
                
                <p className="text-xs sm:text-sm text-sky-100/90 font-medium drop-shadow-sm max-w-xl line-clamp-2">
                  {store.description || "ร้านค้าจำหน่ายสินค้าดิจิทัลส่วนตัวออนไลน์ จัดส่งออโต้ 24 ชั่วโมง"}
                </p>
              </div>
            </div>

            {/* Quick Guarantees Badge Strip */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-bold text-white flex items-center gap-2 shadow-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>จัดส่งออโต้ 24 ชั่วโมง</span>
              </div>

              {store.paymentPromptPay && (
                <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs font-bold text-white flex items-center gap-2 shadow-xs">
                  <QrCode className="h-4 w-4 text-sky-300" />
                  <span>PromptPay: {store.paymentPromptPay}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Main Store Content */}
      <div className="mx-auto max-w-7xl px-4 space-y-6">
        
        {/* Products Search & Toolbar */}
        <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs"
              style={{ backgroundColor: themeColor }}
            >
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">สินค้าในร้าน ({store.products?.length || 0})</h2>
              <p className="text-xs text-slate-500 font-semibold">เลือกสั่งซื้อสินค้า รับของทันที 24 ชม.</p>
            </div>
          </div>

          <div className="relative min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาสินค้าในร้านนี้..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-sky-100 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-[2.5rem] border border-dashed border-sky-200 bg-white/90 p-12 sm:p-16 text-center space-y-4 shadow-xs">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600 shadow-inner">
              <Package className="h-10 w-10" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900">
                {searchQuery ? "ไม่พบสินค้าที่ตรงกับคำค้นหา" : "ร้านค้านี้ยังไม่ได้ลงรายการสินค้า"}
              </h3>
              <p className="text-slate-500 text-sm">
                {searchQuery ? "ลองค้นหาด้วยชื่อสินค้าอื่น" : "โปรดแวะกลับมาชมใหม่เร็วๆ นี้ หรือสอบถามเจ้าของร้าน"}
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <NextLink
                href="/stores"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                ดูร้านค้าอื่นในระบบ
              </NextLink>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

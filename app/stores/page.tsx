"use client"

import { useState, useEffect } from "react"
import NextLink from "next/link"
import { Store, Search, ExternalLink, Package, ShieldCheck, Crown, ArrowRight, ArrowLeft } from "lucide-react"

interface TenantStore {
  id: string
  slug: string
  name: string
  description: string
  primaryColor: string
  banner?: string
  products: any[]
  _count?: { products: number }
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop"

export default function AllStoresPage() {
  const [stores, setStores] = useState<TenantStore[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/tenants?publicOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStores(data)
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 space-y-8">
        <div className="h-12 w-64 bg-sky-100 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/70 border border-sky-100" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 animate-fade-in-up">
      {/* Page Header */}
      <div className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3.5 py-1 text-xs font-bold text-sky-700 border border-sky-100">
            <Crown className="h-3.5 w-3.5 text-sky-600" />
            STORES DIRECTORY
          </div>
          <h1 className="text-3xl font-black text-slate-900">รวมร้านค้าทั้งหมดในระบบ</h1>
          <p className="text-slate-500 text-sm max-w-lg">
            เลือกร้านค้าออนไลน์ที่คุณต้องการซื้อสินค้า หรือกดเปิดเช่าร้านค้าส่วนตัวของคุณเองได้ทันที
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10">
          <NextLink
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 px-4 py-3 text-sm font-bold text-sky-700 transition-all whitespace-nowrap"
          >
            <ArrowLeft className="h-4 w-4" />
            กลับไปหน้าหลัก
          </NextLink>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาร้านค้า..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-sky-100 bg-slate-50 pl-10 pr-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
            />
          </div>

          <NextLink
            href="/my-stores/create"
            className="blue-gradient-btn inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold shadow-md shadow-sky-500/20 whitespace-nowrap"
          >
            <Store className="h-4 w-4" />
            เช่าร้านค้าของคุณ
          </NextLink>
        </div>
      </div>

      {/* Stores Listing */}
      {filteredStores.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-sky-200 bg-white p-16 text-center space-y-4">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Store className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {search ? "ไม่พบร้านค้าที่ตรงกับคำค้นหา" : "ยังไม่มีร้านค้าในระบบ"}
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            {search ? "ลองค้นหาด้วยคำอื่น" : "คุณสามารถเป็นผู้เช่าเปิดร้านค้าแรกในระบบได้ทันที เพียง 300 พอยท์/เดือน"}
          </p>
          <NextLink
            href="/my-stores/create"
            className="blue-gradient-btn inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold"
          >
            เปิดเช่าร้านค้าออนไลน์
            <ArrowRight className="h-4 w-4" />
          </NextLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((s) => {
            const themeColor = s.primaryColor || "#0284c7"
            const banner = s.banner || DEFAULT_BANNER

            return (
              <div
                key={s.id}
                className="glass-card rounded-3xl border border-sky-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Banner Thumbnail */}
                <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={banner}
                    alt={s.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Store Initial Badge */}
                  <div
                    className="absolute bottom-3 left-4 h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md border-2 border-white"
                    style={{ backgroundColor: themeColor }}
                  >
                    {s.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 flex items-center justify-between">
                      <span className="truncate">{s.name}</span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-sky-50 text-sky-600 border border-sky-100 font-semibold shrink-0">
                        /s/{s.slug}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{s.description || "ร้านค้าออนไลน์ขายสินค้าดิจิทัล"}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-3 border-t border-sky-50 font-bold">
                    <span className="flex items-center gap-1.5 text-sky-700">
                      <Package className="h-4 w-4 text-sky-500" />
                      {s.products?.length || s._count?.products || 0} สินค้าในร้าน
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <ShieldCheck className="h-4 w-4" />
                      ส่งออโต้ 24 ชม.
                    </span>
                  </div>

                  <NextLink
                    href={`/s/${s.slug}`}
                    target="_blank"
                    className="w-full py-3 rounded-2xl text-center text-xs font-bold transition-all border flex items-center justify-center gap-2 shadow-xs hover:shadow-md mt-2"
                    style={{
                      borderColor: `${themeColor}40`,
                      color: themeColor,
                      backgroundColor: `${themeColor}08`,
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    เข้าชมหน้าร้านค้าออนไลน์
                  </NextLink>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

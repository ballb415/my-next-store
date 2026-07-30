"use client"

import { useState, useEffect } from "react"
import NextLink from "next/link"
import { useSession } from "next-auth/react"
import {
  Store,
  Plus,
  Crown,
  ExternalLink,
  Settings,
  Package,
  Boxes,
  Zap,
  Palette,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ArrowLeft,
} from "lucide-react"

interface TenantStore {
  id: string
  slug: string
  name: string
  description: string
  primaryColor: string
  banner?: string
  status: string
  expiresAt: string
  createdAt: string
  _count?: { products: number; orders: number }
}

const DEFAULT_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop"

export default function MyStoresPage() {
  const { data: session } = useSession()
  const [stores, setStores] = useState<TenantStore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/tenants")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStores(data)
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const totalProducts = stores.reduce((sum, s) => sum + (s._count?.products || 0), 0)
  const totalOrders = stores.reduce((sum, s) => sum + (s._count?.orders || 0), 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-10 animate-fade-in-up">
      
      {/* Ultra Premium Hero Header Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-sky-200/90 bg-gradient-to-br from-white/95 via-sky-50/90 to-blue-100/70 p-6 sm:p-10 lg:p-12 shadow-2xl shadow-sky-500/10 backdrop-blur-2xl">
        {/* Ambient Decorative Liquid Blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/25 to-blue-600/30 blur-3xl animate-mesh-1 pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-300/30 to-blue-400/25 blur-3xl animate-mesh-2 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sky-500/15 to-blue-500/10 px-4 py-1.5 text-xs font-extrabold text-sky-800 border border-sky-300/70 shadow-xs">
              <Crown className="h-4 w-4 text-sky-600 animate-pulse" />
              <span>NEXT STORE RENTAL SAAS PLATFORM</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              จัดการร้านค้าเช่าของคุณ <br />
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                สร้างรายได้ทันทีใน 1 นาที
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              เปิดร้านค้าออนไลน์ส่วนตัวของคุณภายใต้ชื่อ Next ปรับแต่งรูปภาพแบนเนอร์ สีธีมประจำร้าน ลงรายการสินค้า และคีย์สต็อกจัดส่งให้อัตโนมัติ 24 ชั่วโมง
            </p>

            {/* Quick Stats Strip */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-2xl border border-sky-100 shadow-xs">
                <Store className="h-4 w-4 text-sky-600" />
                <span>ร้านค้าของคุณ: <strong className="text-sky-600 font-extrabold">{stores.length}</strong> ร้าน</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-2xl border border-sky-100 shadow-xs">
                <Package className="h-4 w-4 text-sky-600" />
                <span>สินค้ารวม: <strong className="text-sky-600 font-extrabold">{totalProducts}</strong> รายการ</span>
              </div>
              <div className="flex items-center gap-2 bg-white/90 px-4 py-2.5 rounded-2xl border border-sky-100 shadow-xs">
                <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
                <span>ระบบออนไลน์: <strong className="text-emerald-600 font-extrabold">24/7 AUTO</strong></span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <NextLink
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/90 hover:bg-white border border-sky-200/80 px-6 py-3 text-sm font-bold text-sky-700 shadow-sm transition-all active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้าหลัก
            </NextLink>

            <NextLink
              href="/my-stores/create"
              className="shimmer-container blue-gradient-btn inline-flex items-center justify-center gap-3 rounded-2xl px-7 py-4 text-base font-black shadow-xl shadow-sky-600/30 transition-transform active:scale-95 text-white"
            >
              <Plus className="h-5 w-5" />
              สร้าง/เช่าร้านค้าใหม่ (300 พอยท์/เดือน)
            </NextLink>

            <div className="text-center text-xs font-semibold text-slate-500">
              ⚡ ตัดพอยท์ค่าเช่าอัตโนมัติ เปิดใช้งานได้ทันที
            </div>
          </div>
        </div>
      </div>

      {/* Stores Directory Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-sky-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">ร้านค้าเช่าทั้งหมดของคุณ ({stores.length})</h2>
              <p className="text-xs font-bold text-sky-600 uppercase tracking-wider">YOUR RENTED SAAS STORES</p>
            </div>
          </div>

          <NextLink
            href="/my-stores/create"
            className="inline-flex items-center gap-2 text-xs font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition-all border border-sky-100"
          >
            <Plus className="h-4 w-4" />
            เพิ่มร้านค้าใหม่
          </NextLink>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/70 border border-sky-100" />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="rounded-[2.5rem] border border-dashed border-sky-200 bg-white/90 p-12 sm:p-16 text-center space-y-5 shadow-xs">
            <div className="mx-auto h-20 w-20 rounded-3xl bg-sky-50 flex items-center justify-center text-sky-600 shadow-inner">
              <Store className="h-10 w-10" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900">คุณยังไม่ได้เปิดเช่าร้านค้าส่วนตัว</h3>
              <p className="text-slate-500 text-sm">
                เติมเงินแลกพอยท์เพียง 300 พอยท์ เพื่อเปิดหน้าร้านค้าขายของออนไลน์ของคุณเองได้ใน 1 นาที!
              </p>
            </div>
            <NextLink
              href="/my-stores/create"
              className="blue-gradient-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-extrabold shadow-lg shadow-sky-500/25"
            >
              <Plus className="h-5 w-5" />
              เช่าร้านค้าส่วนตัวตอนนี้
            </NextLink>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => {
              const themeColor = store.primaryColor || "#0284c7"
              const banner = store.banner || DEFAULT_BANNER

              return (
                <div
                  key={store.id}
                  className="group glass-card rounded-[2rem] border border-sky-100 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Top Cover Banner */}
                  <div className="relative h-32 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={banner}
                      alt={store.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    
                    {/* Status Pill */}
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-emerald-400 border border-emerald-500/40 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      เปิดใช้งานอยู่
                    </div>

                    {/* Store Logo Avatar */}
                    <div
                      className="absolute bottom-3 left-4 h-14 w-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white"
                      style={{ backgroundColor: themeColor }}
                    >
                      {store.name.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-lg group-hover:text-sky-600 transition-colors truncate">
                          {store.name}
                        </h3>
                      </div>
                      <p className="text-xs font-mono text-sky-600 font-semibold">/s/{store.slug}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                        {store.description || "ร้านค้าจำหน่ายสินค้าดิจิทัลส่วนตัว"}
                      </p>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-sky-100/80 text-xs font-bold text-slate-700">
                      <div className="flex items-center gap-2 bg-sky-50/70 border border-sky-100 p-2.5 rounded-2xl">
                        <Package className="h-4 w-4 text-sky-600 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold">สินค้าในร้าน</div>
                          <div className="text-slate-900 font-extrabold">{store._count?.products || 0} รายการ</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-sky-50/70 border border-sky-100 p-2.5 rounded-2xl">
                        <Boxes className="h-4 w-4 text-sky-600 shrink-0" />
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold">ออเดอร์ขาย</div>
                          <div className="text-slate-900 font-extrabold">{store._count?.orders || 0} ออเดอร์</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2.5 border-t border-slate-100 bg-slate-50/50">
                    <NextLink
                      href={`/s/${store.slug}`}
                      target="_blank"
                      className="w-1/2 py-2.5 rounded-2xl text-center text-xs font-bold text-slate-700 hover:text-sky-700 bg-white hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      ดูหน้าร้าน
                    </NextLink>

                    <NextLink
                      href={`/my-stores/${store.slug}/dashboard`}
                      className="w-1/2 blue-gradient-btn py-2.5 rounded-2xl text-center text-xs font-extrabold text-white flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      จัดการ & แต่งสี
                    </NextLink>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* SaaS Platform Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="glass-card rounded-3xl border border-sky-100 bg-white p-6 space-y-3 shadow-xs">
          <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Zap className="h-5 w-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">เปิดหน้าร้านใน 1 นาที</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            ระบบจัดสร้างหน้าร้านค้าออนไลน์ให้อัตโนมัติทันทีหลังเช่า พร้อม URL Slug ส่วนตัวแชร์ให้ลูกค้าซื้อได้ทันที
          </p>
        </div>

        <div className="glass-card rounded-3xl border border-sky-100 bg-white p-6 space-y-3 shadow-xs">
          <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
            <Palette className="h-5 w-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">ปรับแต่งแบนเนอร์ & ธีมสี</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            เลือกภาพแบนเนอร์ร้าน สีปุ่มกดประจำร้าน สโลแกน และข้อความแนะนำหน้าร้านได้ตามสไตล์ของคุณ
          </p>
        </div>

        <div className="glass-card rounded-3xl border border-sky-100 bg-white p-6 space-y-3 shadow-xs">
          <div className="h-10 w-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="font-extrabold text-slate-900 text-base">คีย์สต็อกส่งออโต้ 24 ชม.</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            เจ้าของร้านคีย์รายการสินค้าเข้าคลังสต็อกได้เอง ระบบจะทำหน้าที่จัดส่งบัญชีให้ลูกค้าอัตโนมัติทันที
          </p>
        </div>
      </div>

    </div>
  )
}

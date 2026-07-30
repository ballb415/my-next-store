"use client"

import Link from "next/link"
import { ShieldCheck, Zap, ArrowRight, CheckCircle2, Crown, Flame, Store, Palette, Boxes } from "lucide-react"

export function HeroBanner() {
  return (
    <section className="relative mb-14 overflow-hidden rounded-[2.5rem] border border-sky-200/90 bg-gradient-to-br from-white/95 via-sky-50/80 to-blue-100/60 p-6 sm:p-10 lg:p-14 shadow-2xl shadow-sky-500/10 backdrop-blur-2xl">
      {/* Decorative Ambient Liquid Blobs inside Hero */}
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br from-sky-400/25 to-blue-600/35 blur-3xl animate-mesh-1 pointer-events-none" />
      <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-gradient-to-tr from-cyan-300/30 to-blue-400/25 blur-3xl animate-mesh-2 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
          
          {/* Top Badge Pill */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-sky-500/15 to-blue-500/10 px-4 py-2 text-xs font-bold text-sky-800 border border-sky-300/70 shadow-xs animate-float-slow">
            <Crown className="h-4 w-4 text-sky-600 animate-pulse" />
            <span>แพลตฟอร์มให้บริการเช่าร้านค้าออนไลน์อันดับ 1</span>
            <span className="flex h-2 w-2 rounded-full bg-sky-500" />
          </div>

          {/* Headline Text */}
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.12]">
            เว็บบริการเช่าร้านค้า <br />
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              เปิดขายของได้ใน 1 นาที
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-base sm:text-lg font-medium text-slate-600 leading-relaxed">
            เติมเงินพอยท์เพื่อเปิดเช่าร้านค้าส่วนตัวเพียง 300 พอยท์/เดือน กำหนดธีมสี แบนเนอร์ ลงสินค้าส่วนตัว และคีย์สต็อกสินค้าสำหรับจัดส่งให้ลูกค้าร้านคุณอัตโนมัติ 24 ชม.
          </p>

          {/* Call To Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="/my-stores/create"
              className="shimmer-container blue-gradient-btn inline-flex items-center gap-3 rounded-2xl px-7 py-4 text-base font-extrabold shadow-xl shadow-sky-600/30 transition-transform active:scale-95"
            >
              <Store className="h-5 w-5" />
              เปิดเช่าร้านค้าออนไลน์ใหม่
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/my-stores"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-white/95 border border-sky-200/90 px-6 py-4 text-base font-bold text-sky-700 shadow-sm hover:bg-sky-50 hover:border-sky-300 transition-all active:scale-95"
            >
              <Crown className="h-4 w-4 text-sky-600" />
              จัดการร้านค้าของคุณ
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-xl border border-sky-100">
              <CheckCircle2 className="h-4 w-4 text-sky-600" />
              <span>เปิดหน้าร้านพร้อมใช้ใน 1 นาที</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-xl border border-sky-100">
              <Palette className="h-4 w-4 text-sky-600" />
              <span>ปรับแต่งแบนเนอร์ & ธีมสีอิสระ</span>
            </div>
            <div className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded-xl border border-sky-100">
              <Boxes className="h-4 w-4 text-sky-600" />
              <span>คีย์สต็อกส่งออโต้ 24 ชม.</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Layered Showcase */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          
          {/* Main Card */}
          <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-[2rem] bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 p-1 shadow-2xl shadow-sky-500/25 transition-transform duration-500 hover:scale-[1.02]">
            <div className="w-full h-full rounded-[1.8rem] bg-slate-950/90 backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden relative border border-white/15">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800/80">
                  <Zap className="h-3 w-3 text-sky-400 animate-pulse" />
                  <span>STORE RENTAL ONLINE</span>
                </div>
              </div>

              {/* Center Icon Showcase */}
              <div className="my-auto z-10 py-6 text-center space-y-4">
                <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/40 animate-pulse-soft">
                  <Store className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">NEXT STORE PLATFORM</h3>
                  <p className="text-xs font-medium text-sky-300/80 mt-1">บริการระบบเช่าหน้าร้านขายของดิจิทัลส่วนตัว</p>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="z-10 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center justify-between text-xs text-white">
                <span className="font-bold">ค่าเช่าร้านค้า</span>
                <span className="font-black text-sky-400 font-mono text-sm">300 พอยท์ / เดือน</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

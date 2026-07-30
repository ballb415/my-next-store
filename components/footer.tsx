"use client"

import Link from "next/link"
import { 
  Wallet, 
  Clock, 
  ShieldCheck, 
  Store,
  Crown,
  Sparkles,
} from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-sky-900/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 pt-16 pb-12 text-slate-400 mt-20 relative overflow-hidden">
      {/* Ambient background glow inside footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Branding */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-1 shadow-md shadow-sky-500/20 border border-sky-200/50 overflow-hidden">
                <img src="/next-logo-v2.png" alt="Next Logo" className="h-full w-full object-cover rounded-xl" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                  NEXT PLATFORM
                  <Crown className="h-4 w-4 text-sky-400" />
                </h2>
                <div className="flex items-center text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  SAAS PLATFORM ACTIVE 24/7
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-slate-400">
              แพลตฟอร์มให้บริการเช่าสร้างร้านค้าออนไลน์ส่วนตัว ปลอดภัย เปิดหน้าร้านขายของของตัวเองภายใต้เครือข่าย Next ได้ใน 1 นาที พร้อมแผงควบคุมระบบคีย์สต็อกและปรับแต่งธีมสี
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-sky-500 pl-2.5">
              เมนูลัดบริการ
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/my-stores" className="flex items-center group transition-colors hover:text-sky-400">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 group-hover:bg-sky-500/20 group-hover:border-sky-500/50 transition-colors">
                    <Crown className="w-4 h-4 text-sky-400" />
                  </div>
                  <span className="text-sm font-medium">เช่าและจัดการร้านค้าออนไลน์</span>
                </Link>
              </li>
              <li>
                <Link href="/topup" className="flex items-center group transition-colors hover:text-sky-400">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mr-3 group-hover:bg-sky-500/20 group-hover:border-sky-500/50 transition-colors">
                    <Wallet className="w-4 h-4 text-sky-400" />
                  </div>
                  <span className="text-sm font-medium">เติมเงินพอยท์เข้าระบบ</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="flex flex-col space-y-5">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-sky-500 pl-2.5">
              จุดเด่นระบบเช่าร้านค้า
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center text-sm font-medium">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mr-3">
                   <Clock className="w-4 h-4 text-sky-400" />
                </div>
                <span>เปิดร้านค้าพร้อมใช้งานทันที 24 ชม.</span>
              </li>
              <li className="flex items-center text-sm font-medium">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mr-3">
                   <ShieldCheck className="w-4 h-4 text-sky-400" />
                </div>
                <span>ระบบสต็อกอัตโนมัติคีย์สินค้าจัดส่งให้ลูกค้า</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 NEXT STORE RENTAL. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors">ข้อตกลงและเงื่อนไข</span>
            <span>•</span>
            <span className="hover:text-slate-400 transition-colors">นโยบายความเป็นส่วนตัว</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

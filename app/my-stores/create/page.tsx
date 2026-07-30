"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import {
  Store,
  Crown,
  Palette,
  Check,
  ArrowLeft,
  Zap,
  Sparkles,
  Info,
} from "lucide-react"

const presetColors = [
  { name: "Sky Blue", hex: "#0284c7" },
  { name: "Royal Indigo", hex: "#4f46e5" },
  { name: "Emerald Green", hex: "#10b981" },
  { name: "Crimson Rose", hex: "#e11d48" },
  { name: "Amber Orange", hex: "#f59e0b" },
  { name: "Purple Violet", hex: "#8b5cf6" },
]

export default function CreateStorePage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#0284c7")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSlugChange = (val: string) => {
    // Sanitize slug
    const cleaned = val.toLowerCase().replace(/[^a-z0-9-]/g, "")
    setSlug(cleaned)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!name || !slug) {
      setError("กรุณากรอกชื่อร้านค้าและ URL Slug ให้ครบถ้วน")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          primaryColor,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "เกิดข้อผิดพลาดในการเช่าร้านค้า")
      } else {
        router.push(`/my-stores/${data.store.slug}/dashboard`)
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดเครือข่าย")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6 animate-fade-in-up">
      {/* Back Button */}
      <NextLink
        href="/my-stores"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-sky-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        ย้อนกลับไปหน้าร้านค้าของคุณ
      </NextLink>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-sky-100 bg-white p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md">
                  <Store className="h-5 w-5" />
                </div>
                <h1 className="text-2xl font-black text-slate-900">เช่าและสร้างร้านค้าใหม่</h1>
              </div>
              <p className="text-slate-500 text-sm mt-1">กำหนดชื่อร้าน ตั้ง URL และเลือกธีมสีประจำร้านตามสไตล์คุณ</p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Store Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ชื่อร้านค้า (Store Name)</label>
                <input
                  type="text"
                  placeholder="เช่น Gaming Shop, Netflix Premium Store"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                />
              </div>

              {/* Store Slug */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">URL Slug หน้าร้านส่วนตัว</label>
                <div className="flex items-center rounded-2xl border border-sky-100 bg-slate-50 overflow-hidden focus-within:border-sky-500 focus-within:bg-white transition-all">
                  <span className="px-3.5 text-xs font-bold text-slate-400 bg-slate-100 py-3.5 border-r border-sky-100">
                    localhost:3000/s/
                  </span>
                  <input
                    type="text"
                    placeholder="my-shop"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="w-full px-3 py-3.5 text-sm font-semibold text-sky-600 outline-none bg-transparent"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">เฉพาะภาษาอังกฤษตัวพิมพ์เล็กและตัวเลข (เช่น `gamestore`)</p>
              </div>

              {/* Theme Color Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>เลือกสีหลักประจำร้าน (Primary Theme Color)</span>
                  <span className="text-sky-600 font-mono">{primaryColor}</span>
                </label>
                
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setPrimaryColor(color.hex)}
                      className="h-10 rounded-xl transition-transform active:scale-95 flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: color.hex }}
                    >
                      {primaryColor === color.hex && <Check className="h-5 w-5 text-white" />}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="text-xs text-slate-500 font-medium">เลือกสีตามใจชอบ:</span>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-8 w-12 rounded-lg cursor-pointer border border-sky-100"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">สโลแกน / คำอธิบายร้านค้า</label>
                <textarea
                  rows={2}
                  placeholder="เช่น จำหน่ายบัญชีดิจิทัลราคาถูก ส่งออโต้ 24 ชม."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              {/* Cost Summary Box */}
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-800">
                  <Crown className="h-4 w-4 text-sky-600" />
                  <span>ค่าบริการเปิดร้านค้า:</span>
                </div>
                <div className="text-sm font-black text-sky-600">
                  300 พอยท์ / เดือน
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full blue-gradient-btn py-4 rounded-2xl font-extrabold text-base shadow-lg shadow-sky-500/25 disabled:opacity-50"
              >
                {loading ? "กำลังดำเนินการเปิดร้าน..." : "ยืนยันเช่าและเปิดร้านค้าทันที"}
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Live Store Badge Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">ตัวอย่างหน้าร้านของคุณ (Live Preview)</h3>

            <div className="rounded-2xl border border-slate-200 p-4 space-y-3 bg-slate-50">
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  {(name || "S").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{name || "ชื่อร้านค้าของคุณ"}</h4>
                  <p className="text-xs font-mono text-sky-600">/s/{slug || "your-shop"}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                {description || "คำอธิบายร้านค้าสั้นๆ ที่จะแสดงบนหน้าร้านค้าของคุณ..."}
              </p>

              {/* Sample Button Preview */}
              <button
                type="button"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                ปุ่มตัวอย่างในธีมสีของคุณ
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

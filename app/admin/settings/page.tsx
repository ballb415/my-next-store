"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  Store,
  QrCode,
  Coins,
  ShieldAlert,
  Save,
  Check,
  Globe,
  Bell,
  Wallet,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "payment" | "rewards" | "maintenance">("general")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Form State
  const [settings, setSettings] = useState({
    // General
    siteName: "WEBSHOP Digital Store",
    siteDescription: "ร้านค้าจำหน่ายสินค้าดิจิทัลและบัญชี พรีเมียม 24 ชม.",
    announcementText: "🎉 ยินดีต้อนรับสู่ WEBSHOP ระบบเติมเงินและจัดส่งสินค้าอัตโนมัติ 24 ชั่วโมง!",
    announcementEnabled: true,

    // Payment / Topup
    promptpayId: "0812345678",
    promptpayName: "นายสมชาย ใจดี",
    topupEnabled: true,
    minTopupAmount: 10,
    maxTopupAmount: 5000,

    // Points & Rewards
    pointsPerHundred: 10,
    pointsToBahtRatio: 100, // 100 points = 1 THB

    // Maintenance & Security
    maintenanceMode: false,
    allowRegistration: true,
  })

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("webshop_admin_settings")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved settings", e)
      }
    }
  }, [])

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      localStorage.setItem("webshop_admin_settings", JSON.stringify(settings))
      setSaving(false)
      showToast("บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!")
    }, 600)
  }

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-50 flex items-center gap-2 rounded-2xl px-5 py-3.5 shadow-xl animate-in slide-in-from-right",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          <Check className="h-5 w-5" />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20">
              <Settings className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">ตั้งค่าระบบ</h1>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">จัดการพารามิเตอร์ ร้านค้า ระบบเติมเงิน และโหมดบำรุงรักษา</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="blue-gradient-btn inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-extrabold shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </button>
      </div>

      {/* Settings Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-3 space-y-2">
          <div className="rounded-3xl border border-sky-100 bg-white p-3 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left",
                activeTab === "general"
                  ? "bg-sky-50 text-sky-600 border border-sky-200/80 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Store className="h-4 w-4" />
              ทั่วไป & ประกาศ
            </button>

            <button
              onClick={() => setActiveTab("payment")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left",
                activeTab === "payment"
                  ? "bg-sky-50 text-sky-600 border border-sky-200/80 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <QrCode className="h-4 w-4" />
              ระบบเติมเงิน & PromtPay
            </button>

            <button
              onClick={() => setActiveTab("rewards")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left",
                activeTab === "rewards"
                  ? "bg-sky-50 text-sky-600 border border-sky-200/80 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Coins className="h-4 w-4" />
              พอยท์สะสม & รางวัล
            </button>

            <button
              onClick={() => setActiveTab("maintenance")}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left",
                activeTab === "maintenance"
                  ? "bg-sky-50 text-sky-600 border border-sky-200/80 shadow-xs"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <ShieldAlert className="h-4 w-4" />
              โหมดบำรุงรักษา & สิทธิ์
            </button>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-9">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-8 shadow-sm">
            
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-sky-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900">ตั้งค่าทั่วไป & ข้อความประกาศ</h3>
                  <p className="text-xs text-slate-500">กำหนดชื่อเว็บไซต์ และข้อความแจ้งเตือนที่แสดงหน้าแรก</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ชื่อเว็บไซต์ (Site Name)</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">คำอธิบายเว็บไซต์ (Meta Description)</label>
                    <textarea
                      rows={3}
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ข้อความประกาศแถบบน (Announcement Bar)</label>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.announcementEnabled}
                          onChange={(e) => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={settings.announcementText}
                      onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                      className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-sky-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900">ตั้งค่าระบบเติมเงิน (PromptPay QR)</h3>
                  <p className="text-xs text-slate-500">กำหนดเบอร์พร้อมเพย์และจำกัดยอดเติมเงิน</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">เปิดใช้งานระบบเติมเงิน</p>
                      <p className="text-xs text-slate-500">อนุญาตให้ผู้ใช้เติมเงินเข้ากระเป๋าเงิน</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.topupEnabled}
                        onChange={(e) => setSettings({ ...settings, topupEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">เบอร์ PromptPay / เลขบัญชี</label>
                      <input
                        type="text"
                        value={settings.promptpayId}
                        onChange={(e) => setSettings({ ...settings, promptpayId: e.target.value })}
                        className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ชื่อบัญชีผู้รับเงิน</label>
                      <input
                        type="text"
                        value={settings.promptpayName}
                        onChange={(e) => setSettings({ ...settings, promptpayName: e.target.value })}
                        className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ยอดเติมขั้นต่ำ (บาท)</label>
                      <input
                        type="number"
                        value={settings.minTopupAmount}
                        onChange={(e) => setSettings({ ...settings, minTopupAmount: Number(e.target.value) })}
                        className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ยอดเติมสูงสุดต่อครั้ง (บาท)</label>
                      <input
                        type="number"
                        value={settings.maxTopupAmount}
                        onChange={(e) => setSettings({ ...settings, maxTopupAmount: Number(e.target.value) })}
                        className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rewards Tab */}
            {activeTab === "rewards" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-sky-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900">พอยท์สะสม & อัตราแลกเปลี่ยน</h3>
                  <p className="text-xs text-slate-500">กำหนดเงื่อนไขการสะสมพอยท์จากทุกคำสั่งซื้อ</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">พอยท์ที่ได้รับต่อยอดซื้อ 100 บาท</label>
                    <input
                      type="number"
                      value={settings.pointsPerHundred}
                      onChange={(e) => setSettings({ ...settings, pointsPerHundred: Number(e.target.value) })}
                      className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">อัตราพอยท์ที่ใช้แลก 1 บาท (เช่น 100 พอยท์ = 1 บาท)</label>
                    <input
                      type="number"
                      value={settings.pointsToBahtRatio}
                      onChange={(e) => setSettings({ ...settings, pointsToBahtRatio: Number(e.target.value) })}
                      className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === "maintenance" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="border-b border-sky-100 pb-4">
                  <h3 className="text-lg font-black text-slate-900">โหมดบำรุงรักษา & สิทธิ์ความปลอดภัย</h3>
                  <p className="text-xs text-slate-500">ควบคุมสิทธิ์การเข้าชมและสมัครสมาชิกชั่วคราว</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <div>
                      <p className="text-sm font-bold text-amber-900">โหมดปิดปรับปรุงเว็บ (Maintenance Mode)</p>
                      <p className="text-xs text-amber-700">ปิดการซื้อขายและแสดงหน้าปรับปรุงระบบชั่วคราว</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
                    <div>
                      <p className="text-sm font-bold text-slate-900">เปิดรับสมัครสมาชิกใหม่</p>
                      <p className="text-xs text-slate-500">อนุญาตให้ผู้ใช้ทั่วไปสมัครสมาชิกได้</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.allowRegistration}
                        onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

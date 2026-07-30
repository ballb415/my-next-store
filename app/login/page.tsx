"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, LogIn, User as UserIcon, Lock, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!username || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน")
      setIsLoading(false)
      return
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      })

      if (res?.error) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
    } finally {
      setIsLoading(false)
    }
  }

  const fillAdminCredentials = () => {
    setUsername("admin")
    setPassword("admin1234")
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative">
      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="rounded-3xl border border-sky-100 bg-white/90 backdrop-blur-2xl shadow-xl shadow-sky-500/10 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 shadow-md shadow-sky-500/30 mb-4 text-white">
              <LogIn className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">เข้าสู่ระบบ</h1>
            <p className="text-slate-500 text-sm mt-1">กรอกข้อมูลเพื่อเข้าสู่บัญชีของคุณ</p>
          </div>

          {/* Quick Admin Helper Button */}
          <div className="mb-6 p-3 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
              <Crown className="h-4 w-4 text-sky-600" />
              <span>บัญชีแอดมินทดสอบ: admin / admin1234</span>
            </div>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 underline cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-sky-200 shadow-xs"
            >
              เติมอัตโนมัติ
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ชื่อผู้ใช้ (Username)</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-11 h-12 rounded-xl bg-slate-50 border-sky-100 focus:border-sky-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">รหัสผ่าน (Password)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 rounded-xl bg-slate-50 border-sky-100 focus:border-sky-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 blue-gradient-btn rounded-xl font-bold text-base shadow-md shadow-sky-500/25 mt-2"
            >
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            ยังไม่มีบัญชีสมาชิก?{" "}
            <Link href="/register" className="text-sky-600 font-bold hover:underline">
              สมัครสมาชิกใหม่
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

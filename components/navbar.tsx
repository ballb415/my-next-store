"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useSession, signOut as nextAuthSignOut } from "next-auth/react"
import {
  Home,
  DollarSign,
  Store,
  History,
  Menu,
  X,
  User,
  Wallet,
  LogOut,
  LogIn,
  ChevronDown,
  LayoutDashboard,
  Crown,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { href: "/", label: "หน้าหลัก", icon: Home },
  { href: "/my-stores", label: "เช่าร้านค้า", icon: Crown },
  { href: "/topup", label: "เติมเงิน", icon: DollarSign },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isAuthenticated = status === "authenticated"
  const user = session?.user

  const handleLogout = () => {
    nextAuthSignOut()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-sky-100/70 bg-white/80 backdrop-blur-2xl shadow-sm shadow-sky-500/5 transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white p-1 shadow-sm shadow-sky-500/15 border border-sky-100 transition-all duration-300 group-hover:scale-105 overflow-hidden">
              <img src="/next-logo-v2.png" alt="Next Logo" className="h-full w-full object-cover rounded-xl" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                NEXT
                <span className="inline-block w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              </span>
              <span className="text-[9px] font-extrabold text-sky-600 tracking-widest uppercase -mt-1">STORE RENTAL SAAS</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-1.5 lg:flex bg-slate-100/80 p-1.5 rounded-full border border-sky-100/80 shadow-xs">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-white text-sky-600 shadow-sm font-bold shadow-sky-500/10"
                      : "text-slate-600 hover:text-sky-600 hover:bg-white/60"
                  )}
                >
                  <Icon className={cn("h-4 w-4 transition-transform duration-200", isActive && "scale-110 text-sky-600")} />
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-500 rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Side User / Login */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Balance Display Badge */}
                <Link 
                  href="/topup"
                  className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/80 hover:border-sky-300 hover:shadow-sm hover:shadow-sky-500/10 transition-all group"
                >
                  <div className="h-6 w-6 rounded-full bg-sky-500/15 flex items-center justify-center text-sky-600">
                    <Crown className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ยอดเงิน</span>
                    <div className="flex items-center gap-0.5">
                      <span className="text-sm font-bold text-sky-600">฿</span>
                      <span className="text-sm font-extrabold text-slate-800">{(user as any).balance?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </Link>

                {/* Vertical Divider */}
                <div className="hidden sm:block h-7 w-[1px] bg-slate-200" />

                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2.5 outline-none group p-1 rounded-full hover:bg-sky-50 transition-colors">
                      <div className="relative">
                        <div className="h-9.5 w-9.5 rounded-full overflow-hidden border-2 border-sky-400/60 shadow-sm group-hover:border-sky-500 transition-colors">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || ""}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                              {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      </div>

                      <div className="hidden sm:flex flex-col items-start leading-tight text-left">
                        <span className="text-sm font-bold text-slate-800 truncate max-w-[110px]">{(user as any).username || user.name}</span>
                        <span className="text-[10px] font-semibold text-sky-600 capitalize bg-sky-100/70 px-1.5 py-0.2 rounded-md">{(user as any).role || "User"}</span>
                      </div>

                      <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors ml-0.5" />
                    </button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border border-sky-100 text-slate-800 shadow-xl shadow-sky-500/10 rounded-2xl p-1.5">
                    <div className="px-3 py-2.5 bg-sky-50/70 rounded-xl mb-1">
                      <p className="font-bold text-slate-800 text-sm">{(user as any).username || user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer font-medium text-slate-600">
                      <Link href="/profile" className="flex items-center gap-2.5 w-full py-2">
                        <User className="h-4 w-4 text-sky-500" />
                        โปรไฟล์
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer font-medium text-slate-600">
                      <Link href="/profile/topup-history" className="flex items-center gap-2.5 w-full py-2">
                        <Wallet className="h-4 w-4 text-sky-500" />
                        ประวัติการเติมเงิน
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer font-medium text-slate-600">
                      <Link href="/profile/orders" className="flex items-center gap-2.5 w-full py-2">
                        <History className="h-4 w-4 text-sky-500" />
                        ประวัติการซื้อสินค้า
                      </Link>
                    </DropdownMenuItem>
                    
                    {((user as any).role || "").toLowerCase() === "admin" && (
                      <>
                        <DropdownMenuSeparator className="bg-slate-100 my-1" />
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-sky-50 focus:text-sky-600 cursor-pointer font-medium text-slate-600">
                          <Link href="/admin" className="flex items-center gap-2.5 w-full py-2">
                            <LayoutDashboard className="h-4 w-4 text-sky-600" />
                            แดชบอร์ดแอดมิน
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    
                    <DropdownMenuSeparator className="bg-slate-100 my-1" />
                    
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="rounded-xl text-rose-600 focus:bg-rose-50 focus:text-rose-600 cursor-pointer font-medium py-2"
                    >
                      <LogOut className="mr-2.5 h-4 w-4" />
                      ออกจากระบบ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-full font-medium">
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-1.5" />
                    เข้าสู่ระบบ
                  </Link>
                </Button>
                <Button asChild className="blue-gradient-btn rounded-full px-5 font-semibold shadow-md shadow-sky-500/20">
                  <Link href="/register">สมัครสมาชิก</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-600 hover:bg-sky-50 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-sky-100 py-3 lg:hidden animate-fade-in-up">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-sky-600"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                )
              })}
              {isAuthenticated && user && ((user as any).role || "").toLowerCase() === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-sky-600 bg-sky-50 border border-sky-100 mt-1"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  แดชบอร์ดแอดมิน
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

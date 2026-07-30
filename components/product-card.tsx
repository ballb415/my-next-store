"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Flame, ShoppingBag, CheckCircle, AlertCircle, Crown } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  discount?: number | null
  image: string | null
  categoryId: string
  isUnlimited: boolean
  pointsEarn: number
  isHot: boolean
  badge?: string | null
  stockCount?: number
  category?: { id: string; name: string }
}

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const finalPrice = product.discount && product.discount > 0
    ? product.price * (1 - product.discount / 100)
    : product.price

  const stockDisplay = product.isUnlimited
    ? "พร้อมส่งตลอด 24 ชม."
    : (product.stockCount || 0) > 0
    ? `คงเหลือ ${product.stockCount} ชิ้น`
    : "สินค้าหมดชั่วคราว"

  const isOutOfStock = !product.isUnlimited && (product.stockCount || 0) === 0

  return (
    <Link
      href={`/store/product/${product.id}`}
      className={cn(
        "group shimmer-container glass-card relative flex flex-col overflow-hidden rounded-2xl border border-sky-100/90 bg-white/90 p-0 text-slate-800 shadow-sm transition-all duration-300 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/12 hover:-translate-y-1.5",
        isOutOfStock && "opacity-75 grayscale-[20%]",
        className
      )}
    >
      {/* HOT Badge */}
      {product.isHot && (
        <div className="absolute right-2.5 top-2.5 z-20 flex items-center gap-1 rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-3 py-1 text-[10px] font-black text-white shadow-md shadow-sky-500/30 animate-pulse">
          <Flame className="h-3 w-3" />
          HOT
        </div>
      )}

      {/* Discount Badge */}
      {product.discount && product.discount > 0 && (
        <div className="absolute left-2.5 top-2.5 z-20 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-2.5 py-0.5 text-[10px] font-black text-white shadow-sm">
          -{product.discount}%
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-sky-50/70 p-2.5">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-sky-100/70" />
        )}
        <img
          src={product.image || "https://placehold.co/400x400/0284c7/ffffff?text=Product"}
          alt={product.name}
          className={cn(
            "h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs">
            <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 shadow-md">
              สินค้าหมด
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-4 pt-3">
        {/* Category Label */}
        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-md w-fit mb-1.5 border border-sky-100">
          {product.category?.name || "สินค้าดิจิทัล"}
        </span>

        {/* Product Name */}
        <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
          {product.name}
        </h3>

        {/* Spacer */}
        <div className="flex-1 min-h-[8px]" />

        {/* Stock status indicator */}
        <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-slate-500">
          {isOutOfStock ? (
            <AlertCircle className="h-3 w-3 text-rose-500" />
          ) : (
            <CheckCircle className="h-3 w-3 text-sky-500" />
          )}
          <span className={isOutOfStock ? "text-rose-500" : "text-slate-600"}>
            {stockDisplay}
          </span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-3 flex items-end justify-between border-t border-sky-100/90 pt-2.5">
          <div className="flex flex-col">
            {product.discount && product.discount > 0 && (
              <span className="text-[10px] text-slate-400 line-through -mb-0.5">
                ฿{product.price.toLocaleString()}
              </span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold text-sky-600">฿</span>
              <span className="text-lg font-black text-slate-900">
                {Math.floor(finalPrice).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all shadow-xs group-hover:shadow-md group-hover:shadow-sky-500/25">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  )
}

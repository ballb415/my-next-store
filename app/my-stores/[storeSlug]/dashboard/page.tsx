"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import {
  Store,
  Palette,
  Package,
  Boxes,
  Plus,
  Settings,
  ExternalLink,
  Save,
  Check,
  Trash2,
  Tag,
  ShoppingBag,
  X,
  Image as ImageIcon,
  TrendingUp,
  DollarSign,
  QrCode,
  CreditCard,
  Building2,
  Ticket,
  BarChart3,
  Users,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Sparkles,
  Pencil,
  AlertTriangle,
  Download,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  price: number
  description?: string
  image?: string
  isHot?: boolean
  isActive?: boolean
  stockCount?: number
  downloadUrl?: string | null
  _count?: { productStock: number; orders: number }
}

const PRESET_BANNERS = [
  {
    name: "🔷 Blue Mesh",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "🌌 Cyber Dark",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "💎 Azure Wave",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1600&auto=format&fit=crop",
  },
  {
    name: "⚡ Deep Tech",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
  },
]

export default function TenantDashboardPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  const { storeSlug } = use(params)
  const router = useRouter()

  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "payment" | "theme" | "stock">("overview")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Theme & Store info edit state
  const [primaryColor, setPrimaryColor] = useState("#0284c7")
  const [storeName, setStoreName] = useState("")
  const [storeDesc, setStoreDesc] = useState("")
  const [storeLogo, setStoreLogo] = useState("")
  const [storeBanner, setStoreBanner] = useState("")
  const [savingTheme, setSavingTheme] = useState(false)

  // Payment settings state
  const [promptPay, setPromptPay] = useState("")
  const [bankName, setBankName] = useState("")
  const [accountNo, setAccountNo] = useState("")
  const [accountName, setAccountName] = useState("")
  const [qrImage, setQrImage] = useState("")
  const [profitMargin, setProfitMargin] = useState("100")
  const [savingPayment, setSavingPayment] = useState(false)

  // New product form modal state
  const [showProductModal, setShowProductModal] = useState(false)
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    downloadUrl: "",
  })
  const [savingProduct, setSavingProduct] = useState(false)

  // Edit product modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    downloadUrl: "",
  })
  const [savingEdit, setSavingEdit] = useState(false)

  // Delete product confirmation state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Stock Add state
  const [selectedProductId, setSelectedProductId] = useState("")
  const [stockInput, setStockInput] = useState("")
  const [savingStock, setSavingStock] = useState(false)

  const fetchStoreData = useCallback(async () => {
    try {
      const res = await fetch(`/api/tenants?slug=${storeSlug}`)
      if (res.ok) {
        const data = await res.json()
        setStore(data)
        setPrimaryColor(data.primaryColor || "#0284c7")
        setStoreName(data.name || "")
        setStoreDesc(data.description || "")
        setStoreLogo(data.logo || "")
        setStoreBanner(data.banner || PRESET_BANNERS[0].url)

        // Payment details
        setPromptPay(data.paymentPromptPay || "")
        setBankName(data.paymentBankName || "")
        setAccountNo(data.paymentAccountNo || "")
        setAccountName(data.paymentAccountName || "")
        setQrImage(data.paymentQrImage || "")
        setProfitMargin(data.profitMargin ? data.profitMargin.toString() : "100")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [storeSlug])

  useEffect(() => {
    fetchStoreData()
  }, [fetchStoreData])

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Save Store Details, Logo & Theme Colors
  const handleSaveTheme = async () => {
    if (!store) return
    setSavingTheme(true)

    try {
      const res = await fetch(`/api/tenants/${store.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: storeName,
          description: storeDesc,
          logo: storeLogo,
          banner: storeBanner,
          primaryColor,
        }),
      })

      if (res.ok) {
        showToast("บันทึกโลโก้ แบนเนอร์ และธีมสีร้านค้าสำเร็จ!")
        fetchStoreData()
      } else {
        showToast("ไม่สามารถบันทึกได้", "error")
      }
    } catch {
      showToast("เกิดข้อผิดพลาด", "error")
    } finally {
      setSavingTheme(false)
    }
  }

  // Save Store Payment Methods
  const handleSavePayment = async () => {
    if (!store) return
    setSavingPayment(true)

    try {
      const res = await fetch(`/api/tenants/${store.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentPromptPay: promptPay,
          paymentBankName: bankName,
          paymentAccountNo: accountNo,
          paymentAccountName: accountName,
          paymentQrImage: qrImage,
          profitMargin: parseFloat(profitMargin) || 100,
        }),
      })

      if (res.ok) {
        showToast("บันทึกช่องทางการชำระเงินสำเร็จ!")
        fetchStoreData()
      } else {
        showToast("ไม่สามารถบันทึกช่องทางชำระเงินได้", "error")
      }
    } catch {
      showToast("เกิดข้อผิดพลาด", "error")
    } finally {
      setSavingPayment(false)
    }
  }

  // Add Product to Tenant Store
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!store || !productForm.name || !productForm.price) return
    setSavingProduct(true)

    try {
      const res = await fetch(`/api/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productForm.name,
          price: productForm.price,
          description: productForm.description || "สินค้าคุณภาพจากร้านค้า",
          image: productForm.image || "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=400&auto=format&fit=crop",
          categoryId: store.categories?.[0]?.id || "",
          tenantStoreId: store.id,
          isUnlimited: false,
          isHot: false,
          isActive: true,
          downloadUrl: productForm.downloadUrl || null,
        }),
      })

      if (res.ok) {
        showToast("ลงสินค้าใหม่ในร้านสำเร็จ!")
        setShowProductModal(false)
        setProductForm({ name: "", price: "", description: "", image: "", downloadUrl: "" })
        fetchStoreData()
      } else {
        showToast("ไม่สามารถลงสินค้าได้", "error")
      }
    } catch {
      showToast("เกิดข้อผิดพลาด", "error")
    } finally {
      setSavingProduct(false)
    }
  }

  // Open edit modal for a product
  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name,
      price: String(product.price),
      description: product.description || "",
      image: product.image || "",
      downloadUrl: product.downloadUrl || "",
    })
    setShowEditModal(true)
  }

  // Save edited product
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct || !editForm.name || !editForm.price) return
    setSavingEdit(true)
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          price: editForm.price,
          description: editForm.description,
          image: editForm.image || null,
          downloadUrl: editForm.downloadUrl || null,
        }),
      })
      if (res.ok) {
        showToast("แก้ไขสินค้าสำเร็จ!")
        setShowEditModal(false)
        setEditingProduct(null)
        fetchStoreData()
      } else {
        showToast("ไม่สามารถแก้ไขสินค้าได้", "error")
      }
    } catch {
      showToast("เกิดข้อผิดพลาด", "error")
    } finally {
      setSavingEdit(false)
    }
  }

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${deletingProduct.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        showToast("ลบสินค้าสำเร็จ!")
        setShowDeleteConfirm(false)
        setDeletingProduct(null)
        fetchStoreData()
      } else {
        showToast("ไม่สามารถลบสินค้าได้", "error")
      }
    } catch {
      showToast("เกิดข้อผิดพลาด", "error")
    } finally {
      setDeleting(false)
    }
  }

  // Add Stock/Accounts to Product
  const handleAddStock = async () => {
    if (!selectedProductId || !stockInput.trim()) return
    setSavingStock(true)

    try {
      const lines = stockInput.trim().split("\n").filter(l => l.trim())
      const items = lines.map(line => {
        const [email, password] = line.includes("|") 
          ? line.split("|").map(s => s.trim())
          : line.split(":").map(s => s.trim())
        return { email: email || "", password: password || "" }
      }).filter(item => item.email && item.password)

      if (items.length === 0) {
        showToast("รูปแบบไม่ถูกต้อง ใช้ email:password", "error")
        setSavingStock(false)
        return
      }

      const res = await fetch(`/api/admin/products/${selectedProductId}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (res.ok) {
        const result = await res.json()
        showToast(`เติมสต็อกสำเร็จ ${result.count} บัญชี`)
        setStockInput("")
        fetchStoreData()
      } else {
        showToast("ไม่สามารถเติมสต็อกได้", "error")
      }
    } catch {
      showToast("เกิดข้อผิดพลาด", "error")
    } finally {
      setSavingStock(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
      </div>
    )
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-xl py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">ไม่พบร้านค้านี้</h2>
        <NextLink href="/my-stores" className="blue-gradient-btn px-6 py-2.5 rounded-xl text-sm font-bold">
          กลับไปหน้าร้านค้าของคุณ
        </NextLink>
      </div>
    )
  }

  const currentBanner = storeBanner || PRESET_BANNERS[0].url

  // Calculate stats
  const totalProductsCount = store.products?.length || 0
  const totalOrdersCount = store.orders?.length || 0
  const totalRevenue = store.orders?.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0) || 0
  const marginPct = parseFloat(profitMargin) || 100
  const estimatedProfit = (totalRevenue * marginPct) / 100

  return (
    <>
      {/* Toast Alert */}
      {toast && (
        <div className={cn(
          "fixed top-4 right-4 z-[9999] flex items-center gap-2 rounded-2xl px-5 py-3.5 shadow-xl animate-in slide-in-from-right",
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        )}>
          <Check className="h-5 w-5" />
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 space-y-8 animate-fade-in-up">
        
        {/* Top Store Cover & Info Card */}
        <div className="rounded-3xl border border-sky-100 bg-white overflow-hidden shadow-sm">
          <div className="relative h-44 sm:h-52 w-full bg-slate-900 overflow-hidden">
            <img src={currentBanner} alt="Store Banner" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            
            <button
              onClick={() => setActiveTab("theme")}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-white/20 flex items-center gap-2 transition-all"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              เปลี่ยนรูปแบนเนอร์ร้าน
            </button>
          </div>

          <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md border-2 border-white -mt-10 z-10 overflow-hidden"
                style={{ backgroundColor: primaryColor }}
              >
                {store.logo ? (
                  <img src={store.logo} alt={store.name} className="h-full w-full object-cover" />
                ) : (
                  store.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  {store.name}
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-600 border border-sky-100 font-bold">
                    /s/{store.slug}
                  </span>
                </h1>
                <p className="text-slate-500 text-sm mt-0.5">{store.description || "ร้านค้าจำหน่ายสินค้าดิจิทัลส่วนตัว"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NextLink
                href={`/s/${store.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-50 border border-sky-200/80 px-5 py-3 text-sm font-bold text-sky-700 hover:bg-sky-100 transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                เปิดดูหน้าร้านค้าออนไลน์
              </NextLink>

              <button
                onClick={() => setShowProductModal(true)}
                className="blue-gradient-btn inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold shadow-md shadow-sky-500/20"
              >
                <Plus className="h-4 w-4" />
                ลงสินค้าใหม่
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-sky-100 pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all",
              activeTab === "overview"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            แดชบอร์ด & สรุปยอดขาย
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all",
              activeTab === "products"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Package className="h-4 w-4" />
            รายการสินค้าในร้าน ({totalProductsCount})
          </button>

          <button
            onClick={() => setActiveTab("payment")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all",
              activeTab === "payment"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <CreditCard className="h-4 w-4" />
            ช่องทางรับชำระเงิน
          </button>

          <button
            onClick={() => setActiveTab("theme")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all",
              activeTab === "theme"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <ImageIcon className="h-4 w-4" />
            ปรับแต่งแบนเนอร์ & สีธีม
          </button>

          <button
            onClick={() => setActiveTab("stock")}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all",
              activeTab === "stock"
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Boxes className="h-4 w-4" />
            เติมคีย์/สต็อกสินค้า
          </button>
        </div>

        {/* Tab 1: Overview & Sales Dashboard */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in-up">
            
            {/* Tab 1 Guide Box */}
            <div className="p-5 rounded-3xl bg-sky-50/80 border border-sky-200/70 flex items-start gap-3.5 text-xs text-sky-900 shadow-xs">
              <Sparkles className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-sky-950">💡 คำแนะนำหน้าสรุปแดชบอร์ด (Overview Guide)</h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  หน้านี้แสดงภาพรวมรายได้รวม ยอดขายออเดอร์ และรายการสินค้าในร้านค้าของคุณ ระบบจะอัปเดตสถิติให้อัตโนมัติทุกครั้งที่มีลูกค้านำเงินมาสั่งซื้อสินค้าหน้าร้าน
                </p>
              </div>
            </div>

            {/* Sales Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="glass-card rounded-3xl border border-sky-100 bg-white p-6 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ยอดขายรวมทั้งหมด</span>
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">฿{totalRevenue.toLocaleString()}</div>
                <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  รายได้จากออเดอร์ทั้งหมดในร้าน
                </p>
              </div>

              <div className="glass-card rounded-3xl border border-sky-100 bg-white p-6 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">สต็อกพร้อมจัดส่ง</span>
                  <div className="h-10 w-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Boxes className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-sky-600">พร้อมขาย</div>
                <p className="text-[11px] font-semibold text-slate-500">
                  ระบบจัดส่งคีย์ให้อัตโนมัติ 24 ชม.
                </p>
              </div>

              <div className="glass-card rounded-3xl border border-sky-100 bg-white p-6 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">จำนวนออเดอร์ขาย</span>
                  <div className="h-10 w-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{totalOrdersCount} <span className="text-sm font-bold text-slate-500">ออเดอร์</span></div>
                <p className="text-[11px] font-semibold text-sky-600">จัดส่งสินค้าให้ลูกค้าเรียบร้อยแล้ว</p>
              </div>

              <div className="glass-card rounded-3xl border border-sky-100 bg-white p-6 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">สินค้าทั้งหมดในร้าน</span>
                  <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Package className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900">{totalProductsCount} <span className="text-sm font-bold text-slate-500">รายการ</span></div>
                <p className="text-[11px] font-semibold text-slate-500">เปิดวางจำหน่ายหน้าร้าน</p>
              </div>
            </div>

            {/* Recent Products & Stock Quick Status */}
            <div className="rounded-3xl border border-sky-100 bg-white p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-sky-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-sky-600" />
                  สถานะสินค้าและสต็อกในร้าน
                </h3>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="blue-gradient-btn px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  ลงสินค้าใหม่
                </button>
              </div>

              {totalProductsCount === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-slate-500 text-sm">ยังไม่มีรายการสินค้าในร้านค้าของคุณ</p>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="blue-gradient-btn px-5 py-2.5 rounded-xl text-xs font-bold"
                  >
                    + เพิ่มสินค้าชิ้นแรกในร้าน
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {store.products?.map((p: Product) => (
                    <div key={p.id} className="p-4 rounded-2xl border border-sky-100 bg-slate-50/70 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={p.image || "https://placehold.co/100x100"} alt={p.name} className="h-12 w-12 rounded-xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{p.name}</h4>
                          <div className="text-sky-600 font-extrabold text-xs">฿{p.price.toLocaleString()}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProductId(p.id)
                          setActiveTab("stock")
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-sky-600 font-bold text-xs hover:bg-sky-50 shrink-0"
                      >
                        + เติมสต็อก
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Products List */}
        {activeTab === "products" && (
          <div className="space-y-5 animate-fade-in-up">
            
            {/* Tab 2 Guide Box */}
            <div className="p-5 rounded-3xl bg-sky-50/80 border border-sky-200/70 flex items-start gap-3.5 text-xs text-sky-900 shadow-xs">
              <Sparkles className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-sky-950">💡 คำแนะนำการจัดการสินค้าในร้าน (Products Guide)</h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  หน้านี้ใช้สำหรับกดปุ่ม <strong>"+ ลงสินค้าใหม่"</strong> เพื่อวางขายสินค้าในร้านค้าของคุณ สามารถกำหนดชื่อสินค้า ราคา คำอธิบาย และรูปภาพสินค้าได้อิสระ
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">รายการสินค้าเฉพาะของร้านคุณ ({totalProductsCount})</h3>
              <button
                onClick={() => setShowProductModal(true)}
                className="blue-gradient-btn px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                ลงสินค้าใหม่
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {store.products?.map((product: Product) => (
                <div
                  key={product.id}
                  className="glass-card rounded-2xl border border-sky-100 bg-white p-4 space-y-3 shadow-xs flex flex-col justify-between group relative"
                >
                  <div className="space-y-2">
                    <div className="aspect-square rounded-xl overflow-hidden bg-sky-50 relative">
                      <img src={product.image || "https://placehold.co/400x400"} alt={product.name} className="h-full w-full object-cover" />
                      {/* Edit & Delete overlay buttons */}
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => openEditModal(product)}
                          className="h-9 w-9 rounded-xl bg-white/90 hover:bg-white text-sky-600 flex items-center justify-center shadow-md transition-all hover:scale-110"
                          title="แก้ไขสินค้า"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProduct(product)
                            setShowDeleteConfirm(true)
                          }}
                          className="h-9 w-9 rounded-xl bg-white/90 hover:bg-white text-red-500 flex items-center justify-center shadow-md transition-all hover:scale-110"
                          title="ลบสินค้า"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {product.downloadUrl && (
                        <div className="absolute top-1.5 right-1.5 bg-sky-500/90 text-white rounded-lg px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-0.5">
                          <Download className="h-2.5 w-2.5" /> ดาวน์โหลดได้
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <div className="text-base font-black text-sky-600">฿{product.price.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">สต็อก {product.stockCount ?? 0}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold text-xs border border-amber-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Pencil className="h-3 w-3" /> แก้ไข
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProductId(product.id)
                        setActiveTab("stock")
                      }}
                      className="flex-1 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 font-bold text-xs border border-sky-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> เติมสต็อก
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Payment Settings */}
        {activeTab === "payment" && (
          <div className="max-w-2xl rounded-3xl border border-sky-100 bg-white p-8 shadow-sm space-y-6 animate-fade-in-up">
            
            {/* Tab 3 Guide Box */}
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/70 flex items-start gap-3 text-xs text-sky-900 shadow-xs">
              <Sparkles className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-sky-950">💡 คำแนะนำการตั้งค่ารับเงิน (Payment Guide)</h4>
                <p className="text-slate-600 leading-relaxed font-medium text-[11px]">
                  กรอกข้อมูล PromptPay หรือเลขบัญชีธนาคารของคุณที่นี่ ระบบจะนำข้อมูลนี้ไปแสดงหน้าร้านของคุณ เพื่อให้ลูกค้าสแกนจ่ายเงินตรงเข้าบัญชีคุณได้ทันที
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-sky-600" />
                ตั้งค่าช่องทางรับชำระเงินประจำร้านของคุณ
              </h3>
              <p className="text-xs text-slate-500">กรอกข้อมูลบัญชีรับเงินจากลูกค้า เพื่อนำไปแสดงผลที่หน้าร้านของคุณ</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <QrCode className="h-4 w-4 text-sky-600" />
                  เบอร์/เลข PromptPay ประจำร้าน
                </label>
                <input
                  type="text"
                  placeholder="เช่น 0812345678"
                  value={promptPay}
                  onChange={(e) => setPromptPay(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-sky-600" />
                    ชื่อธนาคาร
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น กสิกรไทย (KBANK)"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">เลขที่บัญชี</label>
                  <input
                    type="text"
                    placeholder="เช่น 123-4-56789-0"
                    value={accountNo}
                    onChange={(e) => setAccountNo(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ชื่อบัญชีผู้รับเงิน</label>
                <input
                  type="text"
                  placeholder="เช่น นาย สมชาย ใจดี"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ลิงก์รูปภาพ QR Code สแกนจ่ายเงิน (URL)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={qrImage}
                  onChange={(e) => setQrImage(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                />
              </div>



              <button
                onClick={handleSavePayment}
                disabled={savingPayment}
                className="w-full blue-gradient-btn py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-sky-500/20"
              >
                {savingPayment ? "กำลังบันทึก..." : "บันทึกช่องทางรับเงิน"}
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Theme & Banner Customize */}
        {activeTab === "theme" && (
          <div className="max-w-2xl rounded-3xl border border-sky-100 bg-white p-8 shadow-sm space-y-6 animate-fade-in-up">
            
            {/* Tab 4 Guide Box */}
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/70 flex items-start gap-3 text-xs text-sky-900 shadow-xs">
              <Sparkles className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-sky-950">💡 คำแนะนำการตกแต่งหน้าร้าน (Store Customization Guide)</h4>
                <p className="text-slate-600 leading-relaxed font-medium text-[11px]">
                  ปรับแต่งชื่อร้าน สโลแกน ใส่ลิงก์รูปภาพโลโก้ ภาพแบนเนอร์ปกหน้าร้าน และเลือกโทนสีหลักประจำร้าน (Primary Theme Color) เพื่อสร้างเอกลักษณ์ให้ร้านค้าของคุณดูหรูหราน่าเชื่อถือ
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">ปรับแต่งรูปแบนเนอร์ สีธีม และข้อมูลร้านค้า</h3>
              <p className="text-xs text-slate-500">เลือกรูปภาพแบนเนอร์ร้านค้า สีหลักประจำร้าน และคำอธิบายแนะนำหน้าร้าน</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">ชื่อร้านค้า</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">สโลแกนร้านค้า</label>
                <textarea
                  rows={2}
                  value={storeDesc}
                  onChange={(e) => setStoreDesc(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none resize-none"
                />
              </div>

              {/* Logo URL Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>รูปภาพโลโก้ร้านค้า (Store Logo Image URL)</span>
                  {storeLogo && <span className="text-[11px] font-bold text-emerald-600">✓ มีโลโก้แล้ว</span>}
                </label>
                <div className="flex items-center gap-3 mt-1.5">
                  {storeLogo ? (
                    <img src={storeLogo} alt="Logo" className="h-12 w-12 rounded-2xl object-cover border border-sky-200 shrink-0" />
                  ) : (
                    <div
                      className="h-12 w-12 rounded-2xl text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {storeName ? storeName.charAt(0).toUpperCase() : "S"}
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="https://... (ใส่ลิงก์รูปภาพโลโก้ร้านค้าของคุณ)"
                    value={storeLogo}
                    onChange={(e) => setStoreLogo(e.target.value)}
                    className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Banner Presets */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>รูปภาพแบนเนอร์ร้านค้า (Store Banner Image URL)</span>
                </label>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400">เลือกภาพแบนเนอร์สำเร็จรูป (คลิกเลือกได้ทันที):</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_BANNERS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setStoreBanner(preset.url)}
                        className={cn(
                          "relative h-16 rounded-xl overflow-hidden border-2 transition-all text-left p-1.5 flex items-end",
                          storeBanner === preset.url ? "border-sky-500 ring-2 ring-sky-400/30" : "border-slate-200 opacity-80 hover:opacity-100"
                        )}
                      >
                        <img src={preset.url} alt={preset.name} className="absolute inset-0 w-full h-full object-cover -z-10" />
                        <span className="text-[10px] font-black text-white drop-shadow-md bg-black/40 px-1.5 py-0.5 rounded-md">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="https://..."
                  value={storeBanner}
                  onChange={(e) => setStoreBanner(e.target.value)}
                  className="w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>เลือกสีหลักประจำร้าน (Primary Theme Color)</span>
                  <span className="text-sky-600 font-mono">{primaryColor}</span>
                </label>
                <div className="flex items-center gap-3 mt-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-12 w-20 rounded-xl cursor-pointer border border-sky-100 p-1"
                  />
                  <div
                    className="px-4 py-2.5 rounded-xl text-white text-xs font-bold shadow-sm flex items-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Check className="h-4 w-4" />
                    ตัวอย่างปุ่มในธีมสีของคุณ
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveTheme}
                disabled={savingTheme}
                className="w-full blue-gradient-btn py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-sky-500/20"
              >
                {savingTheme ? "กำลังบันทึก..." : "บันทึกแบนเนอร์และการตั้งค่า"}
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Stock Add */}
        {activeTab === "stock" && (
          <div className="max-w-2xl rounded-3xl border border-sky-100 bg-white p-8 shadow-sm space-y-6 animate-fade-in-up">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Boxes className="h-5 w-5 text-sky-600" />
                เติมคีย์บัญชีสต็อกสินค้าอัตโนมัติ (Automatic Stock Delivery)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ใส่ข้อมูลสินค้าเตรียมไว้ล่วงหน้า เมื่อมีลูกค้ามากดซื้อหน้าร้านของคุณ ระบบจะดึงข้อมูลนี้จัดส่งให้ลูกค้าทันที 24 ชม. โดยที่คุณไม่ต้องคอยนั่งส่งเอง
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 space-y-2 text-xs text-sky-900 font-medium">
              <div className="font-bold flex items-center gap-1.5 text-sky-700">
                <CheckCircle2 className="h-4 w-4" />
                รูปแบบการคีย์ข้อมูลสต็อก (ใส่ 1 บัญชีต่อ 1 บรรทัด):
              </div>
              <div className="font-mono bg-white p-3 rounded-xl border border-sky-100 text-slate-800 text-[11px] leading-relaxed">
                user1@gmail.com:password123<br />
                user2@gmail.com:password456<br />
                user3@gmail.com:password789
              </div>
              <p className="text-[11px] text-slate-500">
                💡 ตัวอย่าง: ใส่ 3 บรรทัด = ระบบจะมีสต็อกพร้อมขายทันที 3 ชิ้น (ลูกค้ารายแรกได้บรรทัดที่ 1, ลูกค้ารายถัดไปได้บรรทัดที่ 2)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">เลือกสินค้าที่ต้องการเติมสต็อก</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 focus:border-sky-500 focus:bg-white outline-none"
                >
                  <option value="">-- เลือกสินค้าในร้านคุณ --</option>
                  {store.products?.map((p: Product) => (
                    <option key={p.id} value={p.id}>{p.name} (฿{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">รายการบัญชีสินค้าของคุณ (คีย์ข้อมูลรูปแบบ email:password แยกบรรทัด)</label>
                <textarea
                  rows={6}
                  placeholder={"user1@email.com:pass123\nuser2@email.com:pass456"}
                  value={stockInput}
                  onChange={(e) => setStockInput(e.target.value)}
                  className="mt-1.5 w-full rounded-2xl border border-sky-100 bg-slate-50 px-4 py-3 text-sm font-mono text-slate-800 focus:border-sky-500 focus:bg-white outline-none resize-none"
                />
              </div>

              <button
                onClick={handleAddStock}
                disabled={savingStock}
                className="w-full blue-gradient-btn py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-sky-500/20"
              >
                {savingStock ? "กำลังเติมสต็อก..." : "ยืนยันคีย์สต็อกเข้าคลังสินค้า"}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-md my-auto rounded-3xl bg-white p-6 sm:p-7 space-y-5 shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">ลงสินค้าใหม่ในร้านของคุณ</h3>
              <button 
                type="button" 
                onClick={() => setShowProductModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">ชื่อสินค้า</label>
                <input
                  type="text"
                  placeholder="เช่น บัญชี Netflix 1 เดือน"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">ราคา (บาท)</label>
                <input
                  type="number"
                  placeholder="150"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">คำอธิบายสินค้า</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดสินค้า..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">ลิงก์รูปภาพสินค้า</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  📥 ลิงก์ดาวน์โหลดสินค้า (ถ้ามี)
                </label>
                <input
                  type="text"
                  placeholder="https://drive.google.com/... หรือ https://mega.nz/..."
                  value={productForm.downloadUrl}
                  onChange={(e) => setProductForm({ ...productForm, downloadUrl: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">สำหรับสินค้าประเภทโปรแกรม/ไฟล์ดาวน์โหลด ลูกค้าจะได้รับลิงก์นี้หลังซื้อสำเร็จ (เว้นว่างไว้ถ้าไม่มี)</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="w-1/2 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="w-1/2 blue-gradient-btn py-3 rounded-xl font-bold text-sm shadow-md"
                >
                  {savingProduct ? "กำลังบันทึก..." : "ลงสินค้า"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <EditProductModal
          editingProduct={editingProduct}
          editForm={editForm}
          setEditForm={setEditForm}
          savingEdit={savingEdit}
          handleSaveEdit={handleSaveEdit}
          onClose={() => { setShowEditModal(false); setEditingProduct(null) }}
          onDelete={() => {
            setShowEditModal(false)
            setDeletingProduct(editingProduct)
            setShowDeleteConfirm(true)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingProduct && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-red-100 animate-fade-in-up">
            <div className="text-center space-y-3">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900">ยืนยันการลบสินค้า</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                คุณต้องการลบสินค้า <strong className="text-slate-800">&quot;{deletingProduct.name}&quot;</strong> ออกจากร้านค้าใช่หรือไม่?
                <br />
                <span className="text-red-500 text-xs">⚠️ การลบจะไม่สามารถกู้คืนได้ รวมถึงสต็อกสินค้าทั้งหมด</span>
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => { setShowDeleteConfirm(false); setDeletingProduct(null) }}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                {deleting ? (
                  "กำลังลบ..."
                ) : (
                  <><Trash2 className="h-4 w-4" /> ยืนยันลบ</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ============================================================
// Edit Product Modal with Stock Management
// ============================================================
interface StockItem {
  id: string
  accountEmail: string
  accountPass: string
  accountData?: string | null
  status: string
  createdAt: string
  order?: { id: number; userId: number; createdAt: string } | null
}

function EditProductModal({
  editingProduct,
  editForm,
  setEditForm,
  savingEdit,
  handleSaveEdit,
  onClose,
  onDelete,
}: {
  editingProduct: Product
  editForm: { name: string; price: string; description: string; image: string; downloadUrl: string }
  setEditForm: (form: any) => void
  savingEdit: boolean
  handleSaveEdit: (e: React.FormEvent) => void
  onClose: () => void
  onDelete: () => void
}) {
  const [activeTab, setActiveTab] = useState<"info" | "stock">("info")
  const [stockItems, setStockItems] = useState<StockItem[]>([])
  const [loadingStock, setLoadingStock] = useState(false)
  const [stockInput, setStockInput] = useState("")
  const [savingStock, setSavingStock] = useState(false)
  const [deletingStockId, setDeletingStockId] = useState<string | null>(null)

  // Fetch stock items when switching to stock tab
  const fetchStock = useCallback(async () => {
    setLoadingStock(true)
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}/stock`)
      if (res.ok) {
        const data = await res.json()
        setStockItems(data)
      }
    } catch (err) {
      console.error("Fetch stock error:", err)
    } finally {
      setLoadingStock(false)
    }
  }, [editingProduct.id])

  useEffect(() => {
    if (activeTab === "stock") {
      fetchStock()
    }
  }, [activeTab, fetchStock])

  // Add stock items (bulk: email:password or email:password:data per line)
  const handleAddStock = async () => {
    if (!stockInput.trim()) return
    setSavingStock(true)
    try {
      const lines = stockInput.trim().split("\n").filter(Boolean)
      const items = lines.map((line) => {
        const parts = line.split(":")
        return {
          email: parts[0]?.trim() || "",
          password: parts[1]?.trim() || "",
          data: parts.slice(2).join(":").trim() || undefined,
        }
      }).filter(item => item.email && item.password)

      if (items.length === 0) return

      const res = await fetch(`/api/admin/products/${editingProduct.id}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      })

      if (res.ok) {
        setStockInput("")
        fetchStock()
      }
    } catch (err) {
      console.error("Add stock error:", err)
    } finally {
      setSavingStock(false)
    }
  }

  // Delete a stock item
  const handleDeleteStock = async (stockId: string) => {
    setDeletingStockId(stockId)
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}/stock?stockId=${stockId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setStockItems((prev) => prev.filter((s) => s.id !== stockId))
      }
    } catch (err) {
      console.error("Delete stock error:", err)
    } finally {
      setDeletingStockId(null)
    }
  }

  const availableCount = stockItems.filter(s => s.status === "AVAILABLE").length
  const soldCount = stockItems.filter(s => s.status === "SOLD").length

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-lg my-auto rounded-3xl bg-white p-6 sm:p-7 space-y-4 shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Pencil className="h-5 w-5 text-amber-500" />
            แก้ไขสินค้า
          </h3>
          <button 
            type="button" 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
              activeTab === "info" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Package className="h-3.5 w-3.5" /> ข้อมูลสินค้า
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stock")}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
              activeTab === "stock" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Boxes className="h-3.5 w-3.5" /> สต็อก
            {stockItems.length > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                {availableCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab: Product Info */}
        {activeTab === "info" && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700">ชื่อสินค้า</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">ราคา (บาท)</label>
              <input
                type="number"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">คำอธิบายสินค้า</label>
              <textarea
                rows={2}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">ลิงก์รูปภาพสินค้า</label>
              <input
                type="text"
                placeholder="https://..."
                value={editForm.image}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                📥 ลิงก์ดาวน์โหลดสินค้า (ถ้ามี)
              </label>
              <input
                type="text"
                placeholder="https://drive.google.com/... หรือ https://mega.nz/..."
                value={editForm.downloadUrl}
                onChange={(e) => setEditForm({ ...editForm, downloadUrl: e.target.value })}
                className="mt-1 w-full rounded-xl border border-sky-100 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="w-1/3 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 border border-red-100 flex items-center justify-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> ลบ
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="w-1/3 blue-gradient-btn py-3 rounded-xl font-bold text-sm shadow-md"
              >
                {savingEdit ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </form>
        )}

        {/* Tab: Stock Management */}
        {activeTab === "stock" && (
          <div className="space-y-4">
            {/* Stock Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-sky-50 rounded-xl p-3 text-center border border-sky-100">
                <div className="text-lg font-black text-sky-700">{stockItems.length}</div>
                <div className="text-[10px] font-bold text-sky-600 uppercase">ทั้งหมด</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                <div className="text-lg font-black text-emerald-700">{availableCount}</div>
                <div className="text-[10px] font-bold text-emerald-600 uppercase">พร้อมขาย</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                <div className="text-lg font-black text-amber-700">{soldCount}</div>
                <div className="text-[10px] font-bold text-amber-600 uppercase">ขายแล้ว</div>
              </div>
            </div>

            {/* Add Stock Input */}
            <div className="space-y-2 p-4 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200/60">
              <label className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5" /> เพิ่มสต็อกสินค้า
              </label>
              <p className="text-[10px] text-sky-600 font-medium">
                กรอก 1 บรรทัดต่อ 1 สต็อก ในรูปแบบ: <strong>อีเมล:รหัสผ่าน:ข้อมูลเพิ่มเติม</strong>
              </p>
              <textarea
                rows={4}
                placeholder={"user@example.com:password123\nuser2@example.com:pass456:หมายเหตุ"}
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
                className="w-full rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-xs font-mono outline-none focus:border-sky-500 resize-none placeholder:text-sky-300"
              />
              <button
                type="button"
                onClick={handleAddStock}
                disabled={savingStock || !stockInput.trim()}
                className="w-full py-2.5 rounded-xl blue-gradient-btn font-bold text-xs shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {savingStock ? (
                  "กำลังเพิ่ม..."
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    เพิ่มสต็อก ({stockInput.trim().split("\n").filter(Boolean).length} รายการ)
                  </>
                )}
              </button>
            </div>

            {/* Stock List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Boxes className="h-3.5 w-3.5 text-sky-600" />
                สต็อกทั้งหมด ({stockItems.length})
              </h4>

              {loadingStock ? (
                <div className="text-center py-6 text-slate-400 text-xs">กำลังโหลด...</div>
              ) : stockItems.length === 0 ? (
                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <Boxes className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-semibold">ยังไม่มีสต็อกสินค้า</p>
                  <p className="text-[10px] text-slate-400">เพิ่มสต็อกด้านบนเพื่อเริ่มขาย</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {stockItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "flex items-center justify-between gap-2 p-2.5 rounded-xl border text-xs",
                        item.status === "AVAILABLE" 
                          ? "bg-emerald-50/50 border-emerald-100" 
                          : "bg-amber-50/50 border-amber-100 opacity-70"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 truncate">{item.accountEmail}</div>
                        <div className="text-slate-500 font-mono text-[10px] truncate">
                          {item.accountPass}
                          {item.accountData && <span className="ml-1 text-sky-600">• {item.accountData}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase",
                          item.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        )}>
                          {item.status === "AVAILABLE" ? "พร้อมขาย" : "ขายแล้ว"}
                        </span>
                        {item.status === "AVAILABLE" && (
                          <button
                            type="button"
                            onClick={() => handleDeleteStock(item.id)}
                            disabled={deletingStockId === item.id}
                            className="p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200"
            >
              ปิด
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

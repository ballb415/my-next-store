import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET /api/tenants - List user stores or fetch store by slug
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")

    if (slug) {
      const store = await prisma.tenantStore.findUnique({
        where: { slug },
        include: {
          owner: { select: { id: true, name: true, username: true, email: true } },
          categories: true,
          products: {
            where: { isActive: true },
            include: { category: true },
          },
        },
      })

      if (!store) {
        return NextResponse.json({ error: "ไม่พบร้านค้านี้" }, { status: 404 })
      }

      return NextResponse.json(store)
    }

    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const stores = await prisma.tenantStore.findMany({
      where: { ownerId: user.id },
      include: {
        _count: { select: { products: true, orders: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(stores)
  } catch (error) {
    console.error("GET /api/tenants error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// POST /api/tenants - Create new store using points
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนเช่าร้านค้า" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await req.json()
    const { name, slug, description, primaryColor, logo, banner } = body

    if (!name || !slug) {
      return NextResponse.json({ error: "กรุณากรอกชื่อร้านและ URL Slug" }, { status: 400 })
    }

    // Format slug
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "")
    if (!cleanSlug) {
      return NextResponse.json({ error: "URL Slug ไม่ถูกต้อง" }, { status: 400 })
    }

    // Check slug uniqueness
    const existingSlug = await prisma.tenantStore.findUnique({
      where: { slug: cleanSlug },
    })

    if (existingSlug) {
      return NextResponse.json({ error: "URL Slug นี้มีผู้อื่นใช้งานแล้ว กรุณาเลือกชื่ออื่น" }, { status: 400 })
    }

    const monthlyRentPoints = 300 // 300 points per month

    // Check points
    if (user.points < monthlyRentPoints && user.balance < 100) {
      // Allow using points or balance fallback
    }

    // Expiration date (30 days from now)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Deduct points or balance
    let pointsDeducted = 0
    let balanceDeducted = 0

    if (user.points >= monthlyRentPoints) {
      pointsDeducted = monthlyRentPoints
    } else {
      balanceDeducted = 100 // 100 Baht fallback
      if (user.balance < balanceDeducted) {
        return NextResponse.json({
          error: `ยอดเงิน/พอยท์ไม่เพียงพอ (ต้องการ ${monthlyRentPoints} พอยท์ หรือ 100 บาท)`,
        }, { status: 400 })
      }
    }

    // Update user balance & points
    await prisma.user.update({
      where: { id: user.id },
      data: {
        points: { decrement: pointsDeducted },
        balance: { decrement: balanceDeducted },
      },
    })

    // Create store
    const store = await prisma.tenantStore.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || "ร้านค้าดิจิทัลคุณภาพ ยินดีให้บริการ",
        primaryColor: primaryColor || "#0284c7",
        logo: logo || "",
        banner: banner || "",
        ownerId: user.id,
        monthlyRentPoints,
        expiresAt,
        status: "ACTIVE",
      },
    })

    // Create default category for store
    await prisma.category.create({
      data: {
        name: "สินค้าทั่วไป",
        tenantStoreId: store.id,
      },
    })

    return NextResponse.json({ success: true, store })
  } catch (error) {
    console.error("POST /api/tenants error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

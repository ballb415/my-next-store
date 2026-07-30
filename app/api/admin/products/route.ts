import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET products
export async function GET() {
  try {
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

    const isSystemAdmin = (user.role || "").toLowerCase() === "admin"

    // If platform admin, fetch all products. If tenant owner, fetch products for their stores
    const products = await prisma.product.findMany({
      where: isSystemAdmin ? {} : {
        tenantStore: { ownerId: user.id }
      },
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        tenantStore: true,
        _count: { 
          select: { 
            orders: true,
            productStock: true,
          } 
        },
      },
    })

    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const availableStock = await prisma.productStock.count({
          where: {
            productId: product.id,
            status: "AVAILABLE",
          },
        })
        return {
          ...product,
          stockCount: availableStock,
        }
      })
    )

    return NextResponse.json(productsWithStock)
  } catch (error) {
    console.error("Admin products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new product
export async function POST(req: NextRequest) {
  try {
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

    const body = await req.json()
    const { tenantStoreId } = body
    const isSystemAdmin = (user.role || "").toLowerCase() === "admin"

    // Check permissions
    if (tenantStoreId) {
      const store = await prisma.tenantStore.findUnique({ where: { id: tenantStoreId } })
      if (!store || (store.ownerId !== user.id && !isSystemAdmin)) {
        return NextResponse.json({ error: "ไม่มีสิทธิ์ลงสินค้าในร้านค้านี้" }, { status: 403 })
      }
    } else if (!isSystemAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description || "",
        price: parseFloat(body.price),
        discount: body.discount ? parseFloat(body.discount) : 0,
        image: body.image || null,
        categoryId: body.categoryId,
        tenantStoreId: tenantStoreId || null,
        isUnlimited: body.isUnlimited || false,
        pointsEarn: parseInt(body.pointsEarn) || 0,
        isHot: body.isHot || false,
        badge: body.badge || null,
        isActive: body.isActive !== false,
        downloadUrl: body.downloadUrl || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

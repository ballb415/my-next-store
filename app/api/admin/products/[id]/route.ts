import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET single product with stock
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const isSystemAdmin = (user.role || "").toLowerCase() === "admin"
    const { id } = await params

    const product = await prisma.product.findUnique({ 
      where: { id },
      include: {
        category: true,
        tenantStore: true,
        _count: {
          select: {
            orders: true,
            productStock: true,
          }
        }
      }
    })
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check permission: admin or tenant store owner
    if (!isSystemAdmin && product.tenantStore?.ownerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get available stock count
    const availableStock = await prisma.productStock.count({
      where: {
        productId: id,
        status: "AVAILABLE",
      }
    })

    return NextResponse.json({
      ...product,
      stockCount: availableStock,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update product
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const isSystemAdmin = (user.role || "").toLowerCase() === "admin"
    const { id } = await params

    // Verify ownership
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { tenantStore: true },
    })
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 })
    if (!isSystemAdmin && existing.tenantStore?.ownerId !== user.id) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไขสินค้านี้" }, { status: 403 })
    }

    const body = await req.json()

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.price !== undefined && { price: parseFloat(body.price) }),
        ...(body.discount !== undefined && { discount: parseFloat(body.discount) }),
        ...(body.image !== undefined && { image: body.image || null }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
        ...(body.isUnlimited !== undefined && { isUnlimited: body.isUnlimited }),
        ...(body.pointsEarn !== undefined && { pointsEarn: parseInt(body.pointsEarn) }),
        ...(body.isHot !== undefined && { isHot: body.isHot }),
        ...(body.badge !== undefined && { badge: body.badge || null }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.downloadUrl !== undefined && { downloadUrl: body.downloadUrl || null }),
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const isSystemAdmin = (user.role || "").toLowerCase() === "admin"
    const { id } = await params

    // Verify ownership
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { tenantStore: true },
    })
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 })
    if (!isSystemAdmin && existing.tenantStore?.ownerId !== user.id) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์ลบสินค้านี้" }, { status: 403 })
    }

    // Delete all stock items first
    await prisma.productStock.deleteMany({
      where: { productId: id }
    })
    
    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

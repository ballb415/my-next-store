import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// PUT /api/tenants/[id] - Update store settings, payment details & theme colors
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const store = await prisma.tenantStore.findUnique({
      where: { id },
    })

    if (!store || (store.ownerId !== user.id && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "ไม่มีสิทธิ์จัดการร้านค้านี้" }, { status: 403 })
    }

    const body = await req.json()
    const {
      name,
      description,
      primaryColor,
      accentColor,
      logo,
      banner,
      paymentPromptPay,
      paymentBankName,
      paymentAccountNo,
      paymentAccountName,
      paymentQrImage,
      profitMargin,
    } = body

    const updated = await prisma.tenantStore.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(primaryColor && { primaryColor }),
        ...(accentColor && { accentColor }),
        ...(logo !== undefined && { logo }),
        ...(banner !== undefined && { banner }),
        ...(paymentPromptPay !== undefined && { paymentPromptPay }),
        ...(paymentBankName !== undefined && { paymentBankName }),
        ...(paymentAccountNo !== undefined && { paymentAccountNo }),
        ...(paymentAccountName !== undefined && { paymentAccountName }),
        ...(paymentQrImage !== undefined && { paymentQrImage }),
        ...(profitMargin !== undefined && { profitMargin: parseFloat(profitMargin) || 100 }),
      },
    })

    return NextResponse.json({ success: true, store: updated })
  } catch (error) {
    console.error("PUT /api/tenants/[id] error:", error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

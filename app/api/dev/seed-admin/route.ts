import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash("admin1234", 10)

    const admin = await prisma.user.upsert({
      where: { username: "admin" },
      update: {
        role: "ADMIN",
        password: hashedPassword,
        balance: 99999,
      },
      create: {
        username: "admin",
        name: "Admin Master",
        email: "admin@webshop.local",
        password: hashedPassword,
        role: "ADMIN",
        balance: 99999,
      },
    })

    return NextResponse.json({
      success: true,
      message: "สร้าง/อัปเกรดบัญชี Admin สำเร็จ",
      credentials: {
        username: "admin",
        password: "admin1234",
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Seed admin error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

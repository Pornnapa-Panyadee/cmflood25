import { NextResponse } from "next/server"
import { createSessionValue, getSessionCookieName, getSessionMaxAge, isValidLogin } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, passwordHash } = await request.json()

    if (typeof username !== "string" || typeof passwordHash !== "string") {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 })
    }

    if (!isValidLogin(username, passwordHash)) {
      return NextResponse.json({ error: "Username หรือ Password ไม่ถูกต้อง" }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set({
      name: getSessionCookieName(),
      value: createSessionValue(username),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getSessionMaxAge(),
    })

    return response
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" }, { status: 500 })
  }
}

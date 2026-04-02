import { NextResponse } from "next/server"
import {
  createFloodForecastSessionValue,
  getFloodForecastSessionCookieName,
  getFloodForecastSessionMaxAge,
  isValidFloodForecastLogin,
} from "@/lib/floodforecast-auth"

export async function POST(request: Request) {
  try {
    const { username, passwordHash } = await request.json()

    if (typeof username !== "string" || typeof passwordHash !== "string") {
      return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 })
    }

    if (!isValidFloodForecastLogin(username.trim(), passwordHash)) {
      return NextResponse.json({ error: "Username หรือ Password ไม่ถูกต้อง" }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set({
      name: getFloodForecastSessionCookieName(),
      value: createFloodForecastSessionValue(username.trim()),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getFloodForecastSessionMaxAge(),
    })

    return response
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" }, { status: 500 })
  }
}

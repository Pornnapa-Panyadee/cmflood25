import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import {
  getFloodForecastSessionCookieName,
  verifyFloodForecastSessionValue,
} from "@/lib/floodforecast-auth"

export async function GET() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(getFloodForecastSessionCookieName())?.value

  return NextResponse.json({
    authenticated: verifyFloodForecastSessionValue(sessionValue),
  })
}

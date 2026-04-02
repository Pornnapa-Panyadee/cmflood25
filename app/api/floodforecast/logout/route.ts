import { NextResponse } from "next/server"
import { getFloodForecastSessionCookieName } from "@/lib/floodforecast-auth"

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/chiangmai/cmflood/floodforecast", request.url))
  response.cookies.set({
    name: getFloodForecastSessionCookieName(),
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })

  return response
}

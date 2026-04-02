import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import FloodForecastLoginClient from "./LoginClient"
import {
  getFloodForecastSessionCookieName,
  verifyFloodForecastSessionValue,
} from "@/lib/floodforecast-auth"

export default async function FloodForecastLoginPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(getFloodForecastSessionCookieName())?.value

  if (verifyFloodForecastSessionValue(sessionValue)) {
    redirect("/cmflood/floodforecast")
  }

  return <FloodForecastLoginClient />
}

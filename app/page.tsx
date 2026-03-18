import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionCookieName, verifySessionValue } from "@/lib/auth"

export default async function RootRedirect() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(getSessionCookieName())?.value

  redirect(verifySessionValue(sessionValue) ? "/home" : "/login")
}

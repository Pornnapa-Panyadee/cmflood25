import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LoginClient from "./LoginClient"
import { getSessionCookieName, verifySessionValue } from "@/lib/auth"

export default async function LoginPage() {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(getSessionCookieName())?.value

  if (verifySessionValue(sessionValue)) {
    redirect("/home")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoginClient />
    </div>
  )
}

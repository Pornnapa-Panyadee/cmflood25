import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { getSessionCookieName, verifySessionValue } from "@/lib/auth"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sessionValue = cookieStore.get(getSessionCookieName())?.value

  if (!verifySessionValue(sessionValue)) {
    redirect("/login")
  }

  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}

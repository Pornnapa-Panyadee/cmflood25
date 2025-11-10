"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/navigation"
import { Mitr, Prompt } from "next/font/google"

// ✅ โหลด Footer แบบ dynamic ป้องกัน SSR mismatch
const Footer = dynamic(() => import("@/components/footer").then(mod => mod.default), { ssr: false })

const mitr = Mitr({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-mitr",
})

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
})


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token === "cmflood2025_token") {
      setAuthorized(true)
    } else {
      router.replace("/login")
    }
    setChecked(true)
  }, [router])

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        กำลังตรวจสอบสิทธิ์การเข้าถึง...
      </div>
    )
  }

  if (!authorized) return null

  return (
    <>
      <Navigation />
      <body className={`${prompt.variable} ${mitr.variable} font-sans antialiased`}>
        {children}
      </body>
      <Footer /> {/* ✅ เพิ่ม Footer ที่นี่ */}
    </>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginClient from "./LoginClient"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // ถ้า login แล้ว ไม่ต้องเข้า login อีก
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/floodmap")
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <LoginClient />
    </div>
  )
}
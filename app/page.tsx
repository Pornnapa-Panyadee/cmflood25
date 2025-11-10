"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    router.replace(token === "cmflood2025_token" ? "/home" : "/login")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center text-gray-500">
      กำลังโหลด...
    </div>
  )
}

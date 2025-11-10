"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Droplets, Map, Flag, Ruler, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  // ✅ ตรวจ token หลัง mount (ฝั่ง client เท่านั้น)
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(token === "cmflood2025_token")
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("username")
    setIsLoggedIn(false)
    router.replace("/login")
  }

  const navItems = [
    { title: "แผนที่เสี่ยงภัยน้ำท่วม", href: "/floodmap", icon: Map },
    { title: "หลักระดับน้ำท่วม", href: "/pole2025", icon: Flag },
    { title: "เครื่องหมายระดับน้ำท่วมเมืองเชียงใหม่", href: "/floodmark", icon: Ruler },
    { title: "แผนที่ประมาณการระดับน้ำท่วม", href: "/floodInterpolation", icon: TrendingUp },
  ]

  return (
    <nav className="border-b border-border bg-blue-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Droplets className="h-6 w-6 text-blue-600" />
            <Link href="/home" className="text-lg font-bold text-blue-600">
              CM Flood
            </Link>
          </div>

          {/* Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-2 text-blue-600">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-200 text-blue-800"
                      : "hover:bg-blue-50 hover:text-blue-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>

          {/* ✅ ปุ่ม Login/Logout */}
          {isLoggedIn === null ? (
            // ยังไม่เช็ค token เสร็จ
            <div className="text-gray-400 text-sm">...</div>
          ) : isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-red-700"
            >
              ออกจากระบบ
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

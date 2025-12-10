"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Droplets, Map, Flag, Ruler, TrendingUp, LineChart } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

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
    { title: "แผนที่ประมาณความลึกน้ำท่วม", href: "/floodInterpolation", icon: TrendingUp },
    { title: "พยากรณ์ระดับน้ำ P.1", href: "/prediction", icon: LineChart },
  ]

  return (
    <nav className="border-b border-border bg-blue-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <Droplets className="h-5 w-5 text-blue-600" />
            <Link href="/home" className="text-base font-bold text-blue-600">
              CM Flood
            </Link>
          </div>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-1.5 text-blue-600">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
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

          {/* Login/Logout */}
          {isLoggedIn === null ? (
            <div className="text-gray-400 text-xs">...</div>
          ) : isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white rounded-md px-3 py-1.5 text-xs font-medium hover:bg-red-700 whitespace-nowrap"
            >
              ออกจากระบบ
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white rounded-md px-3 py-1.5 text-xs font-medium hover:bg-blue-700 whitespace-nowrap"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

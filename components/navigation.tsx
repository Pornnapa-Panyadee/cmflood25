"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Waves, Map, Flag, Ruler, TrendingUp, Home,Droplets } from "lucide-react"



const navItems = [
  // {
  //   title: "หน้าหลัก",
  //   href: "/",
  //   icon: Home,
  // },
  {
    title: "แผนที่เสี่ยงภัยน้ำท่วม",
    href: "/floodmap",
    icon: Map,
  },
  {
    title: "หลักระดับน้ำท่วม",
    href: "/pole2025",
    icon: Flag,
  },
  {
    title: "เครื่องหมายระดับน้ำท่วมเมืองเชียงใหม่",
    href: "/floodmark",
    icon: Ruler,
  },
  {
    title: "แผนที่ประมาณการระดับน้ำท่วม",
    href: "/floodInterpolation",
    icon: TrendingUp,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-card1">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-primary" />
           <Link href="/" className="text-xl font-semibold text-primary hover:underline">
            CM Flood
          </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-1 text-primary">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        isActive ? "text-primary-foreground" : "text-primary"
                      )}
                    />
                    <span
                      className={cn(
                        isActive
                          ? "text-primary-foreground" 
                          : "text-primary" 
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md p-2 text-xs transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 text-primary" />
                <span
                  className={cn(
                    isActive
                      ? "text-primary-foreground" 
                      : "text-primary" 
                  )}
                >
                  {item.title}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Droplets, Map, Flag, Ruler, TrendingUp, LineChart, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { title: "แผนที่เสี่ยงภัยน้ำท่วม", href: "/chiangmai/cmflood/floodmap", icon: Map },
    { title: "หลักระดับน้ำท่วม", href: "/chiangmai/cmflood/pole2025", icon: Flag },
    { title: "เครื่องหมายระดับน้ำท่วมเมืองเชียงใหม่", href: "/chiangmai/cmflood/floodmark", icon: Ruler },
    { title: "แผนที่ประมาณความลึกน้ำท่วม", href: "/chiangmai/cmflood/flooddepth", icon: TrendingUp },
    { title: "พยากรณ์ระดับน้ำ P.1", href: "/chiangmai/cmflood/floodforecast", icon: LineChart },
  ]

  return (
    <nav className="border-b border-border bg-blue-100">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
        <div className="flex min-h-14 items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-1.5">
            <Droplets className="h-5 w-5 text-blue-600" />
            <Link href="/chiangmai/cmflood" className="text-base font-bold text-blue-600 sm:text-lg">
              CM Flood
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-start gap-2 text-blue-600 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap lg:text-sm",
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

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-blue-700 hover:bg-blue-200 hover:text-blue-900"
                aria-label="เปิดเมนูนำทาง"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm border-l-blue-200 bg-gradient-to-b from-blue-50 to-white p-0">
              <SheetHeader className="border-b border-blue-100 bg-white/80 px-5 py-4 text-left backdrop-blur">
                <SheetTitle className="flex items-center gap-2 text-blue-800">
                  <Droplets className="h-5 w-5" />
                  CM Flood
                </SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2 px-3 py-4">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-start gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-blue-700 transition-colors",
                          isActive
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white/80 hover:bg-blue-100 hover:text-blue-900"
                        )}
                      >
                        <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="leading-5">{item.title}</span>
                      </Link>
                    </SheetClose>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

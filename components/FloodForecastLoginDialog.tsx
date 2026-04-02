"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type FloodForecastLoginDialogProps = {
  onSuccess: () => void
}

export function FloodForecastLoginDialog({ onSuccess }: FloodForecastLoginDialogProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const normalizedUsername = username.trim()
      const passwordHash = await hashPassword(password)
      const response = await fetch("/api/floodforecast/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: normalizedUsername, passwordHash }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        setError(data?.error ?? "Username หรือ Password ไม่ถูกต้อง")
        setIsLoading(false)
        return
      }

      onSuccess()
    } catch {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ")
    }

    setIsLoading(false)
  }

  async function hashPassword(passwordValue: string) {
    const encoder = new TextEncoder()
    const data = encoder.encode(passwordValue)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md bg-white p-8 shadow-xl">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
            <p className="mt-2 text-gray-500">กรุณาเข้าสู่ระบบก่อนใช้งานระบบพยากรณ์ระดับน้ำ P1</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <div className="space-y-2">
              <label htmlFor="forecast-username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="forecast-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="watercenter"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="forecast-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="forecast-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

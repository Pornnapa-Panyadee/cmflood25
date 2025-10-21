"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { AlertTriangle, Droplets, Info, ImageIcon, X, MapPin,Download } from "lucide-react"


export default function Floodmap() {
  
  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h3 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-2xl text-balance">
            แผนที่เสี่ยงภัยน้ำท่วม (Flood Hazard Map)
          </h3>
        </div>
        
      </main>
    </div>
  )
}

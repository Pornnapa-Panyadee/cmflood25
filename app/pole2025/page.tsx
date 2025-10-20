"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, MapPin, RefreshCw, TrendingUp, TrendingDown, Minus, Waves } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import LeafletMap from "@/components/pole"
import { useRouter } from "next/navigation"
import Image from "next/image"




export default function WaterDashboard() {

  const router = useRouter()
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-10xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h3 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-2xl text-balance">
           หลักเตือนระดับน้ำท่วมเขตเมือง จังหวัดเชียงใหม่ (CM Flood Poles)
          </h3>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            โดย มหาวิทยาลัยเชียงใหม่
          </p>
        </div>

        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-12 gap-6">
            {/* 📘 วิธีใช้งาน (3 ส่วน) */}
            <div className="col-span-12 md:col-span-3">
                <Card className="h-full border border-blue-100 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex flex-col items-center justify-center text-center text-blue-500 text-xl">
                    หลักเตือนระดับน้ำท่วมเขตเมือง <br /> จังหวัดเชียงใหม่
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2">
                       <Image
                          src="/images/pole/polecnx.jpg"
                          alt="City flood map"
                          width={1000}
                          height={600}
                          className="rounded-xl object-cover shadow-md w-full h-auto"
                        />
                        </div>
                    </CardContent>
                <CardContent>
                    <p className="list-disc list-inside space-y-2 text-sm text-gray-700">
                    หลักเตือนระดับน้ำท่วมเพื่อการเตือนภัยสำหรับชุมชนในพื้นที่เสี่ยงภัย จำนวนมากกว่า 220 หลัก เป็นหลักที่แสดงค่าระดับน้ำที่จะท่วมแต่ละพื้นที่ซึ่งหลักติดตั้งอยู่ หลักระดับน้ำท่วมเป็นเสาคอนกรีตสูง 1.40 เมตร ติดตั้งกระจายทั่วพื้นที่เคยเกิดน้ำท่วมในเขตตัวเมืองเชียงใหม่ โดยที่เสาของหลักเขียนบอกค่าตัวเลขระดับน้ำต่างๆที่น้ำจะเข้าท่วมบนพื้นผิวโดยเปรียบเทียบกับค่าระดับน้ำที่สถานี P.1 เชิงสะพานนวรัฐ การใช้หลักเตือนระดับน้ำท่วมนั้น ให้รับฟังข่าวและผลการพยากรณ์ระดับน้ำปิงล่วงหน้าที่สถานีวัดน้ำ P.1 สะพานนวรัฐ โดยหน่วยงานที่เกี่ยวข้องจะรายงานให้ทราบตลอดในช่วงการเกิดภาวะน้ำท่วม เมื่อทราบค่าระดับน้ำที่จะเกิดที่สถานีวัดน้ำดังกล่าวแล้วให้นำตัวเลขค่าระดับน้ำของแม่น้ำปิงนั้นมาเทียบกับตัวเลขที่อยู่ที่เสาแสดงระดับน้ำ ก็จะทราบความสูงของระดับน้ำที่จะท่วมบริเวณที่มีหลักวางอยู่ ทำให้ประชาชนสามารถวางแผนป้องกันน้ำท่วมบ้านเรือนได้ล่วงหน้าอย่างทันท่วงที
                    </p>
                    
                </CardContent>
                </Card>
            </div>
            
            {/* 🗺️ แผนที่ (9 ส่วน) */}
            <div className="col-span-12 md:col-span-9">
                <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    แผนที่การประมาณค่าระดับน้ำเชิงพื้นที่
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LeafletMap />
                </CardContent>
                </Card>
            </div>

            
            </div>
        </div>
      </main>
    </div>
  )
}

"use client"

import { useState, useCallback, useEffect } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Droplets, MapPin, BookImage, TrendingDown, Minus, Waves } from "lucide-react"
import LeafletMap from "@/components/floodmap2025"
import { useRouter } from "next/navigation"


export default function WaterDashboard() {

  const router = useRouter()
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")


  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-10xl px-10 py-10 sm:px-10 lg:px-10">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <h3 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-2xl text-balance">
           แผนที่แสดงขอบเขตน้ำท่วม 5 ระดับ ในเขตตัวเมืองเชียงใหม่ 
          </h3>
          {/* <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            มีการออกแบบแผนที่โดยใช้ข้อมูลขอบเขตน้ำท่วม ที่ได้ทำการปรับปรุงข้อมูลแล้ว มาวิเคราะห์ร่วมกับข้อมูลขอบเขตพื้นที่ท่วม 5 ระดับ เพื่อเปรียบเทียบและแสดงให้เห็นขอบเขตพื้นที่ที่น้ำท่วม
          </p> */}
        </div>

        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-12 gap-6">
           
            {/* 🗺️ แผนที่ (9 ส่วน) */}
            <div className="col-span-12 md:col-span-12 ">
              <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    แผนที่แสดงขอบเขตน้ำท่วม 5 ระดับ ในเขตตัวเมืองเชียงใหม่ 
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-primary">มีการออกแบบแผนที่โดยใช้ข้อมูลขอบเขตน้ำท่วม ที่ได้ทำการปรับปรุงข้อมูลแล้ว มาวิเคราะห์ร่วมกับข้อมูลขอบเขตพื้นที่ท่วม 5 ระดับ เพื่อเปรียบเทียบและแสดงให้เห็นขอบเขตพื้นที่ที่น้ำท่วม</p>
                </CardContent>
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

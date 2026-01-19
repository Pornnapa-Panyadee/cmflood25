"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, MapPin, RefreshCw, TrendingUp, TrendingDown, Minus, Waves } from "lucide-react"
import { ImageIcon, Download, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import LeafletMap from "@/components/flooddepth"
import { useRouter } from "next/navigation"


export default function WaterDashboard() {

  const router = useRouter()
 
  const handleDownload = useCallback((imageUrl: string, imageTitle: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `${imageTitle}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {/* <Navigation /> */}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* แผนที่ (9 ส่วน) */}
          <div className="col-span-12 md:col-span-9">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  แผนที่ความลึกของน้ำท่วมในพื้นที่เขตเมือง จ.เชียงใหม่ (Chiang Mai Flood Depth Map)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeafletMap />
              </CardContent>
              
            </Card>
          </div>

          {/* วิธีใช้งาน (3 ส่วน) */}
          <div className="col-span-12 md:col-span-3">
            <Card className="h-full border border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  แผนที่ความลึกของน้ำท่วมในพื้นที่เขตเมือง จ.เชียงใหม่ (Chiang Mai Flood Depth Map)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="list-disc list-inside space-y-2 text-sm text-black-500">
                {/* (กรณีเหตุการณ์น้ำท่วมใหญ่ในเดือนตุลาคม พ.ศ. 2567 โดยที่ค่าระดับน้ำของแม่น้ำปิงที่สถานี P.1 = 5.30 เมตร)
                การประมาณการค่าความสูงของระดับน้ำในพื้นที่น้ำท่วม ใช้ข้อมูลที่ได้จากการเก็บข้อมูลและวัดค่าระดับคราบน้ำท่วม(Flood Marks) 
                ในพื้นที่จำนวน 5,000 จุด แล้วใช้เทคนิคการประมาณค่าในช่วงโดยการใช้ข้อมูลที่ได้จากการเก็บจุดตัวอย่างกระจายไปตามพื้นที่และประมาณการค่าที่เป็นไปได้ให้กับตำแหน่งที่ไม่ได้เก็บค่า โดยการแสดงความลึกในแต่ละพื้นที่ด้วยการใช้สีตามระดับความลึกของระดับน้ำท่วม ซึ่งในบริเวณที่มีความลึกมากจะแทนด้วยสีเข้มขึ้น
                 */}
                 (กรณี ระดับน้ำแม่น้ำปิงที่สถานี P.1 = 5.30 เมตร)
                </p>
                <p className="list-disc list-inside space-y-2 text-sm text-gray-700 mt-[5px] ">
                  การประมาณค่าระดับความลึกของน้ำท่วมในพื้นที่น้ำท่วมเขตเมือง จังหวัดเชียงใหม่ โดยใช้ข้อมูลสภาพกายภาพของพื้นที่และค่าระดับคราบน้ำท่วม (Flood Marks) ที่เคยเกิดขึ้นในพื้นที่ แล้วนำมาประมวลผลด้วยเทคนิคการประมาณค่าเชิงพื้นที่แบบ 
                
                  "Inverse Distance Weighting (IDW)"
                
                  ซึ่งเป็นวิธีการถ่วงน้ำหนักตามระยะทางระหว่างจุดข้อมูล ช่วยให้สามารถสร้างค่าความลึกของน้ำท่วมในบริเวณที่ไม่มีข้อมูลจริงให้มีความต่อเนื่องและสอดคล้องกับลักษณะทางภูมิประเทศ สำหรับแผนที่ความลึกน้ำท่วมแบ่งเป็น 2 แบบ ได้แก่
                </p>
                <p className="list-disc list-inside space-y-2 text-sm text-gray-700"> 
                  1) แผนที่ความลึกของน้ำท่วม โดยการแสดงความลึกในแต่ละพื้นที่ด้วยการใช้สีตามระดับความลึกของระดับน้ำท่วม ซึ่งในบริเวณที่มีความลึกมากจะแทนด้วยสีเข้ม
                </p>
                <p className="list-disc list-inside space-y-2 text-sm text-gray-700"> 
                  2) แผนที่ช่วงความลึกน้ำท่วม โดยการแสดงความลึกของน้ำท่วมเป็นช่วงความลึก และใช้สีที่แตกต่างกันในแต่ละช่วงความลึก </p>
                
              </CardContent>
            
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 mt-5">
                  วิธีใช้งาน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  1) คลิกที่จุดใดก็ได้บนแผนที่ <br />
                  2) ดูค่าความลึกน้ำท่วมที่จุดนั้น <br />
                  3)ซูมและเลื่อนแผนที่ได้ตามต้องการ
                </p>
              </CardContent>

              
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  )
}

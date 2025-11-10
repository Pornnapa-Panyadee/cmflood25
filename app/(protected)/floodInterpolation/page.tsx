"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, MapPin, RefreshCw, TrendingUp, TrendingDown, Minus, Waves } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import LeafletMap from "@/components/cnx_tif"
import { useRouter } from "next/navigation"




export default function WaterDashboard() {

  const router = useRouter()
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
                  แผนที่แสดงระดับความลึกของน้ำท่วมเชิงพื้นที่ (ระดับน้ำปิง P.1 = 5.30 ม.)
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
                  แผนที่แสดงขอบเขตและระดับความลึกของน้ำท่วมเชิงพื้นที่
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="list-disc list-inside space-y-2 text-sm text-black-500">
                {/* (กรณีเหตุการณ์น้ำท่วมใหญ่ในเดือนตุลาคม พ.ศ. 2567 โดยที่ค่าระดับน้ำของแม่น้ำปิงที่สถานี P.1 = 5.30 เมตร)
                การประมาณการค่าความสูงของระดับน้ำในพื้นที่น้ำท่วม ใช้ข้อมูลที่ได้จากการเก็บข้อมูลและวัดค่าระดับคราบน้ำท่วม(Flood Marks) 
                ในพื้นที่จำนวน 5,000 จุด แล้วใช้เทคนิคการประมาณค่าในช่วงโดยการใช้ข้อมูลที่ได้จากการเก็บจุดตัวอย่างกระจายไปตามพื้นที่และประมาณการค่าที่เป็นไปได้ให้กับตำแหน่งที่ไม่ได้เก็บค่า โดยการแสดงความลึกในแต่ละพื้นที่ด้วยการใช้สีตามระดับความลึกของระดับน้ำท่วม ซึ่งในบริเวณที่มีความลึกมากจะแทนด้วยสีเข้มขึ้น
                 */}
                 (กรณีเหตุการณ์น้ำท่วมใหญ่ในเดือนตุลาคม พ.ศ. 2567 โดยที่ระดับน้ำแม่น้ำปิงที่สถานี P.1 = 5.30 เมตร)
                </p>
                <p className="list-disc list-inside space-y-2 text-sm text-gray-700 mt-[5px] ">
                  การประมาณค่าระดับความลึกของน้ำท่วมดำเนินการโดยใช้ข้อมูลการวัดคราบน้ำท่วม (Flood Marks) จำนวน 5,000 จุดที่กระจายทั่วพื้นที่ แล้วนำมาประมวลผลด้วยเทคนิคการประมาณค่าเชิงพื้นที่แบบ 
                </p>
                <p className="list-disc list-inside space-y-2 text-sm text-blue-500 font-semibold">
                  "Inverse Distance Weighting (IDW)"
                </p>
                <p className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  ซึ่งเป็นวิธีการถ่วงน้ำหนักตามระยะทางระหว่างจุดข้อมูล กล่าวคือ จุดที่อยู่ใกล้ตำแหน่งที่ต้องการประมาณค่าจะมีอิทธิพลต่อผลลัพธ์มากกว่าจุดที่อยู่ไกล วิธีนี้ช่วยให้สามารถสร้างค่าความลึกของน้ำท่วมในบริเวณที่ไม่มีข้อมูลจริงให้มีความต่อเนื่องและสอดคล้องกับลักษณะทางภูมิประเทศ โดยบริเวณที่มีความลึกมากจะแสดงด้วยสีเข้มขึ้นบนแผนที่
                </p>
              </CardContent>
            
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 mt-5">
                  วิธีใช้งาน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                  <li>คลิกที่จุดใดก็ได้บนแผนที่</li>
                  <li>ดูค่าระดับน้ำที่จุดนั้น</li>
                  <li>ซูมและเลื่อนแผนที่ได้ตามต้องการ</li>
                </ul>
              </CardContent>
             
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

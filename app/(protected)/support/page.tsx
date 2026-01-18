"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ImageIcon, Download, X } from "lucide-react"
import LeafletMap from "@/components/support"

export default function WaterDashboard() {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)

  const galleries = [
    {
      id: 1,
      name: "แผนที่เสี่ยงภัยน้ำท่วมเขตเมือง จังหวัดเชียงใหม่ 5 ระดับ",
      description:
        "แสดงขอบเขตของพื้นที่น้ำท่วม 5 ระดับ เทียบกับค่าระดับน้ำของแม่น้ำปิงที่สถานี P.1 เท่ากับ 4.30, 4.50, 4.70, 5.00 และ 5.30 เมตร ตามลำดับ โดยน้ำจะเริ่มล้นตลิ่งเมื่อ P.1 มากกว่า 4.20 เมตร",
      images: [
        { id: 1, url: "/images/flood/levelflood2025/level1v3.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 1" },
        { id: 2, url: "/images/flood/levelflood2025/level2v3.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 2" },
        { id: 3, url: "/images/flood/levelflood2025/level3v3.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 3" },
        { id: 4, url: "/images/flood/levelflood2025/level4v3.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 4" },
        { id: 5, url: "/images/flood/levelflood2025/level5v3.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 5" },
        { id: 6, url: "/images/flood/levelflood2025/sum5Levelv3.jpg", title: "แผนที่พื้นที่น้ำท่วมรวม 5 ระดับ" },
      ],
    },
  ]

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
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        {/* Hero */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            แผนที่แสดงข้อมูลสนับสนุนเจ้าหน้าที่
            <br />
            (Operations Support Map)
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  แผนที่แสดงข้อมูลสนับสนุนเจ้าหน้าที่ 
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div className="rounded-xl border bg-card p-2 sm:p-3">
                  <LeafletMap />
                </div>
              </CardContent>

            
            </Card>
          </div>
        </div>

      </main>
    </div>
  )
}

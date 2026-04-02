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
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const galleries = [
    {
      id: 1,
      name: "แผนที่ระดับความลึกของน้ำท่วมเชิงพื้นที่",
      description:
        "(กรณี ระดับน้ำแม่น้ำปิงที่สถานี P.1 = 5.30 เมตร) การประมาณค่าระดับความลึกของน้ำท่วมในพื้นที่น้ำท่วมเขตเมือง จังหวัดเชียงใหม่ โดยใช้ข้อมูลสภาพกายภาพของพื้นที่และค่าระดับคราบน้ำท่วม (Flood Marks) ที่เคยเกิดขึ้นในพื้นที่ แล้วนำมาประมวลผลด้วยเทคนิคการประมาณค่าเชิงพื้นที่แบบ \"Inverse Distance Weighting (IDW)\" ซึ่งเป็นวิธีการถ่วงน้ำหนักตามระยะทางระหว่างจุดข้อมูล ช่วยให้สามารถสร้างค่าความลึกของน้ำท่วมในบริเวณที่ไม่มีข้อมูลจริงให้มีความต่อเนื่องและสอดคล้องกับลักษณะทางภูมิประเทศ",
      link: "/cmflood/flooddepth",
      images: [
        { id: 1, url: "/images/flood/levelflood2025/flooddepth_blue.jpg", title: "แผนที่ความลึกของน้ำท่วม" },
        { id: 2, url: "/images/flood/levelflood2025/flooddepth_intervel_v2.jpg", title: "แผนที่ช่วงความลึกน้ำท่วม" },
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

              {/* Galleries */}
               <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 mt-5">
                  แผนที่ระดับความลึกของน้ำท่วมเชิงพื้นที่
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mt-2">
                  {galleries.map((gallery) => (
                    <div key={gallery.id} className="sm:p-2 ">
                      {/* ✅ รูปบรรทัดละ 3 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-2">
                        {gallery.images.map((image) => (
                          <div
                            key={image.id}
                            className="group relative w-full h-full  rounded-xl overflow-hidden border bg-muted cursor-pointer hover:shadow-md transition"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={image.title}
                              className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                              loading="lazy"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white text-sm font-medium line-clamp-2">{image.title}</p>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDownload(image.url, image.title)
                              }}
                              className="absolute top-3 right-3 inline-flex items-center justify-center rounded-lg bg-black/55 hover:bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition"
                              title="ดาวน์โหลดภาพ"
                            >
                              <Download className="h-4 w-4 text-white" />
                            </button>

                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <ImageIcon className="h-9 w-9 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              
            </Card>
          </div>
           {/* Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-9950 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-12 right-0 flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedImage.url, selectedImage.title)}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 p-2 transition-colors"
                  title="ดาวน์โหลดภาพ"
                >
                  <Download className="h-5 w-5 text-white" />
                </button>
                <button
                  className="rounded-full bg-white/10 hover:bg-white/20 p-2 transition-colors"
                  onClick={() => setSelectedImage(null)}
                  title="ปิด"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/30">
                <img
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.title}
                  className="w-full max-h-[78vh] object-contain"
                />
              </div>

              <p className="text-white text-center mt-4 text-base sm:text-lg font-medium">
                {selectedImage.title}
              </p>
            </div>
          </div>
        )}
          
        </div>
      </div>
    </div>
  )
}

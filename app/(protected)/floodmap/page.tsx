"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { AlertTriangle, Droplets, Info, ImageIcon, X, MapPin,Download } from "lucide-react"

const riskZones = [
  { id: 1, name: "Downtown District", risk: "high", x: 30, y: 40, width: 25, height: 20 },
  { id: 2, name: "Riverside Area", risk: "critical", x: 15, y: 55, width: 30, height: 25 },
  { id: 3, name: "North Quarter", risk: "medium", x: 50, y: 20, width: 30, height: 25 },
  { id: 4, name: "East Side", risk: "low", x: 65, y: 50, width: 25, height: 30 },
  { id: 5, name: "West Hills", risk: "low", x: 10, y: 15, width: 20, height: 20 },
  { id: 6, name: "South Bay", risk: "high", x: 40, y: 70, width: 35, height: 20 },
]

const galleries = [
  {
    id: 1,
    name: "แผนที่ระดับความลึกของน้ำในแต่ละพื้นที่",
    description: "เป็นการพยากรณ์และคาดการณ์ความสูงของระดับน้ำในพื้นที่น้ำท่วมแต่ละบริเวณโดยใช้ข้อมูลที่ได้จากการเก็บข้อมูลและวัดค่าระดับคราบน้ำท่วมที่เกิดขึ้นในพื้นที่แล้วใช้เทคนิคการประมาณค่าในช่วงโดยการใช้ข้อมูลที่ได้จากการเก็บจุดตัวอย่างกระจายไปตามพื้นที่และทำนายค่าที่เป็นไปได้ให้กับตำแหน่งที่ไม่ได้เก็บค่า แล้วจึงนำมาจัดทำแผนที่แสดงความลึกของระดับน้ำในพื้นที่น้ำท่วม โดยการแสดงความลึกในแต่ละพื้นที่ด้วยการใช้สีตามระดับความลึกของระดับน้ำท่วม ซึ่งในบริเวณที่มีความลึกมากจะแทนด้วยสีเข้ม",
    images: [
      { id: 1, url: "/images/flood/floodmap/1_crossection/Interpolate_map_Crosssection.jpg", title: "แผนที่ภาพตัดขวางความลึกของน้ำท่วม" },
      { id: 2, url: "/images/flood/floodmap/2_Interpolate_Hillshade/Interpolate_map_Hillshade.jpg", title: "แผนที่ประมาณการระดับความลึกของน้ำท่วม" },
      { id: 3, url: "/images/flood/floodmap/3_interpolate_ortho/Interpolate_map_ortho.jpg", title: "แผนที่ภาพถ่ายทางอากาศซ้อนทับประมาณการระดับความลึกของน้ำท่วม" },
      { id: 4, url: "/images/flood/floodmap/4_interpolate/Interpolate_map.jpg", title: "แผนที่ฐานซ้อนทับประมาณการระดับความลึกของน้ำท่วม" },
    ],
  },
  {
    id: 2,
    name: "แผนที่เส้นทางการอพยพจากพื้นที่เสี่ยงภัยน้ำท่วม",
    description: "การออกแบบแผนที่มีดำเนินการวิเคราะห์หาเส้นทางที่เหมาะสมที่สุดในการกำหนดเส้นทางที่จะใช้ในการอพยพกรณีเกิดภัยพิบัติน้ำท่วมในเขตเทศบาลนครเชียงใหม่นั้นได้ทำการแบ่งพื้นที่ที่ได้รับผลจากน้ำที่ไหลเข้าท่วมออกเป็นทั้งสิ้น 7 โซนหลักๆ ตามระดับความสูงของน้ำ ณ จุด P.1 สะพานนวรัตน์ ทำให้สามารถกำหนดลำดับการท่วมของน้ำเข้าสู่พื้นที่ได้ แล้ววิธี Network Analysis โดยใช้ข้อมูลพื้นฐานต่าง ๆ เช่น พื้นที่น้ำท่วม เส้นทางการสัญจร สิ่งกีดขวางต่าง ๆ มาทำการวิเคราะห์พื้นที่เหมาะสมต่อการตั้งศูนย์อพยพ เส้นทางอพยพ รวมทั้งการแสดงจุดอันตรายในเส้นทางการอพยพ ช่องทางการสื่อสาร เกณฑ์การอพยพ สถานพยาบาลต่างๆ ในพื้นที่ และยังประกอบไปด้วยข้อมูลทิศทางการเดินรถ จำนวนช่องทาง ประเภทหรือชนิดของถนน ความเร็วที่กำหนด รวมไปถึงแยกไฟแดงและจุดห้ามกลับรถ เพื่อใช้เป็นข้อกำหนดหรือเงื่อนไขในการสั่งให้โปรแกรมประมวลผลของเส้นทางที่เหมาะสมที่สุดในการกำหนดเส้นทางที่จะใช้ในการอพยพกรณีเกิดภัยพิบัติน้ำท่วมในเขตเทศบาลนครเชียงใหม่นั้น",
    images: [
      { id: 5, url: "/images/flood/floodmap/5_Final_Evaculate/Final_Evaculate_map.jpg", title: "แผนที่เส้นทางการอพยพจากพื้นที่เสี่ยงภัยน้ำท่วม" },
      { id: 6, url: "/images/flood/floodmap/6_Final_Ortho_Evaculate/Final_Ortho_Evaculate.jpg", title: "แผนที่เส้นทางการอพยพจากพื้นที่เสี่ยงภัยน้ำท่วม" },
      { id: 7, url: "/images/flood/floodmap/7_Final_Depth_Evacuate/Final_Depth_Evacuate.jpg", title: "แผนที่เส้นทางการอพยพจากพื้นที่เสี่ยงภัยน้ำท่วม" },
    ],
  },
  {
    id: 3,
    name: "แผนที่แสดงพื้นที่เสี่ยงภัย 7 ระดับ",
    description: "แผนที่เสี่ยงภัยน้ำท่วมแยกตามระดับความรุนแรง 7 ระดับ ข้อมูลทีใช้ในการวิเคราะห์และจัดทำแผนที่ คือ ข้อมูลขอบเขตพื้นที่น้ำท่วม 7 ระดับ, เส้นทางน้ำ, ข้อมูลหลักระดับน้ำท่วม, ข้อมูลภาพถ่ายทางอากาศ และข้อมูลพื้นผิวดิน",
    images: [
      { id: 8, url: "/images/flood/floodmap/9_riskmap/MXD_TypeA_area1.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 1" },
      { id: 9, url: "/images/flood/floodmap/9_riskmap/MXD_TypeA_area2.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 2" },
      { id: 10, url: "/images/flood/floodmap/9_riskmap/MXD_TypeA_area3.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 3" },
      { id: 11, url: "/images/flood/floodmap/9_riskmap/MXD_TypeA_area4.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 4" },
      { id: 12, url: "/images/flood/floodmap/9_riskmap/MXD_TypeA_area5.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 5" },
      { id: 13, url: "/images/flood/floodmap/9_riskmap/MXD_TypeA_area6.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 6" },
      { id: 14, url: "/images/flood/floodmap/9_riskmap/MXD_TypeA_area7.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 7" },
    ],
  },
  {
    id: 4,
    name: "แผนที่ภาพภ่ายทางอากาศ แสดงพื้นที่เสี่ยงภัย 7 ระดับ",
    description: "แผนที่เสี่ยงภัยน้ำท่วมแยกตามระดับความรุนแรง 7 ระดับนั้น ข้อมูลหลักที่นำมาใช้ในการวิเคราะห์และจัดทำแผนที่ คือ ข้อมูลขอบเขตพื้นที่น้ำท่วม 7 ระดับ และมีข้อมูลต่างๆ ที่ใช้ในการประกอบแผนที่ ได้แก่ เส้นทางน้ำ, หมุดระดับน้ำท่วม และข้อมูลภาพถ่ายทางอากาศ",
    images: [
      { id: 15, url: "/images/flood/floodmap/10_risk_satellite/MXD_TypeA_ortho_area1.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 1" },
      { id: 16, url: "/images/flood/floodmap/10_risk_satellite/MXD_TypeA_ortho_area2.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 2" },
      { id: 17, url: "/images/flood/floodmap/10_risk_satellite/MXD_TypeA_ortho_area3.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 3" },
      { id: 18, url: "/images/flood/floodmap/10_risk_satellite/MXD_TypeA_ortho_area4.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 4" },
      { id: 19, url: "/images/flood/floodmap/10_risk_satellite/MXD_TypeA_ortho_area5.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 5" },
      { id: 20, url: "/images/flood/floodmap/10_risk_satellite/MXD_TypeA_ortho_area6.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 6" },
      { id: 21, url: "/images/flood/floodmap/10_risk_satellite/MXD_TypeA_ortho_area7.jpg", title: "แผนที่พื้นที่น้ำท่วมลำดับที่ 7" },
    ],
  },
  {
    id: 5,
    name: "แผนที่แสดงขอบเขตน้ำท่วมปี 2554",
    description: "มีการออกแบบแผนที่โดยใช้ข้อมูลขอบเขตน้ำท่วมปี พ.ศ. 2554 ที่ได้ทำการปรับปรุงข้อมูลแล้ว มาวิเคราะห์ร่วมกับข้อมูลขอบเขตพื้นที่ท่วม 7 ระดับ เพื่อเปรียบเทียบและแสดงให้เห็นขอบเขตพื้นที่ที่น้ำท่วม",
    images: [{ id: 22, url: "/images/flood/floodmap/12_Type_A_MAP/Type_A_MAP.jpg", title: "แผนที่แสดงขอบเขตน้ำท่วมปี 2554" }],
  },
  {
    id: 6,
    name: "แผนที่แสดงพื้นที่เสี่ยงภัย 7 ระดับในรูปแบบ 3 มิติ",
    description: "ข้อมูลภาพแสดงการขึ้นของน้ำท่วมตามลำดับทั้ง 7 พื้นที่ในรูปแบบ 3 มิติ โดยแสดงถึงพื้นที่และชุมชนที่จะได้รับผลกระทบจากน้ำในแต่ละลำดับ",
    images: [{ id: 23, url: "/images/flood/floodmap/11_3D/Sequence_3D.jpg", title: "พื้นที่เสี่ยงภัย 7 ระดับในรูปแบบ 3 มิติ" }],
  },
  {
    id: 7,
    name: "แอนิเมชั่นการขึ้นลงของน้ำในพื้นที่เสี่ยงภัยน้ำท่วม",
    description: "ภาพแอนิเมชั่นแสดงการเพิ่มขึ้นของน้ำท่วมในพื้นที่เสี่ยงภัยทั้ง 7 ลำดับ โดยเป็นการประมาณการจากความสูงของระดับน้ำที่สถานีวัดน้ำ P.1 เชิงสะพานนวรัฐ และภาพแอนิเมชั่นการลดลงของน้ำโดยโดยใช้ข้อมูลที่ได้จากการสำรวจระดับน้ำท่วมในพื้นที่เมืองเชียงใหม่เมื่อปี 2554",
    images: [
      { id: 24, url: "/images/flood/floodmap/13_flooding/Type1_rez.gif", title: "การเพิ่มขึ้นและลดลงของน้ำในพื้นที่เสี่ยงภัยน้ำท่วม" },
      { id: 25, url: "/images/flood/floodmap/13_flooding/Type2_rez.gif", title: "การลดลงของน้ำในพื้นที่เสี่ยงภัยน้ำท่วม" },
      { id: 26, url: "/images/flood/floodmap/13_flooding/Type3_rez.gif", title: "การลดลงของน้ำในพื้นที่เสี่ยงภัยน้ำท่วม" },
    ],
  },
]

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "critical":
      return "fill-red-600 hover:fill-red-700"
    case "high":
      return "fill-orange-500 hover:fill-orange-600"
    case "medium":
      return "fill-yellow-500 hover:fill-yellow-600"
    case "low":
      return "fill-green-500 hover:fill-green-600"
    default:
      return "fill-gray-400"
  }
}

const getRiskBadgeVariant = (risk: string) => {
  switch (risk) {
    case "critical":
      return "destructive"
    case "high":
      return "default"
    case "medium":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "outline"
  }
}

export default function Floodmap() {
    const [selectedZone, setSelectedZone] = useState<(typeof riskZones)[0] | null>(null)
    const [filter, setFilter] = useState<string>("all")
    const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
    const handleDownload = (imageUrl: string, imageTitle: string) => {
    const link = document.createElement("a")
        link.href = imageUrl
        link.download = `${imageTitle}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }
    
  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h3 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-2xl text-balance">
            แผนที่เสี่ยงภัยน้ำท่วม (Flood Hazard Map)
          </h3>
        </div>

       {/* Info Section */}
        <Card className="mb-4 grid gap-20 bg-muted/50">
            <CardContent className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-3 text-muted-foreground leading-relaxed space-y-4">
                <p className="indent-8">
                    สร้างแผนที่เสี่ยงภัยน้ำท่วมของเหตุการณ์น้ำท่วมใหญ่ที่ผ่านมาในอดีตและเหตุการณ์โดยการจำลองขนาดน้ำท่วมเป้าหมาย 
                    ซึ่งเป็นแผนที่แสดงสภาพและข้อมูลการท่วม ได้แก่พื้นที่ที่คาดการณ์ว่าน้ำจะท่วม ความลึกของน้ำที่ท่วม รวมทั้งข้อมูลสำหรับการอพยพ 
                    เช่น จุดอพยพ เส้นทางการอพยพ จุดอันตรายในเส้นทางอพยพ เป็นต้น ข้อมูลเหล่านี้จะแสดงในรูปแบบของรูปภาพที่เข้าใจง่าย 
                    โดยมีเป้าหมายหลักเพื่อให้สามารถอพยพประชาชนไปอยู่ในที่ปลอดภัยได้อย่างเหมาะสม ทันเวลา ในกรณีที่เกิดเหตุการณ์น้ำท่วมขึ้น
                </p>
                </div>
                <div className="md:col-span-9">
                <Image
                    src="/images/flood/flood.jpg"
                    alt="City flood map"
                    width={1000}
                    height={600}
                    className="rounded-xl object-cover shadow-md w-full h-auto"
                />
                </div>

            </CardContent>
        </Card>

          
        {/* Galleries */}
        <div className="space-y-8 mt-6">
          {galleries.map((gallery) => (
            <Card key={gallery.id} className="p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{gallery.name}</h2>
                <p className="text-gray-600">{gallery.description}</p>
                <Badge variant="outline" className="mt-2">
                  {gallery.images.length} ภาพ
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(image.url, image.title)
                      }}
                      className="absolute top-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      title="ดาวน์โหลดภาพ"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white text-sm font-medium">{image.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
            <div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedImage(null)}
            >
                {/* ปุ่มปิด */}
                <button
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                onClick={() => setSelectedImage(null)}
                >
                <X className="h-6 w-6 text-white" />
                </button>
                <button
                    onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(selectedImage.url, selectedImage.title)
                    }}
                    className="absolute top-4 right-20 p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                    title="ดาวน์โหลดภาพ"
                >
                    <Download className="h-6 w-6 text-white" />
                </button>

                {/* รูปภาพเต็มจอ */}
                <div className="w-full h-full flex flex-col justify-center items-center">
                <img
                    src={selectedImage.url || "/placeholder.svg"}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
                <p className="text-white text-center mt-4 text-lg font-medium">
                    {selectedImage.title}
                </p>
                </div>
            </div>
        )}


        
      </main>
    </div>
  )
}

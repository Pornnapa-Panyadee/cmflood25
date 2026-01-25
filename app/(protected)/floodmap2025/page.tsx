"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ImageIcon, Download, X } from "lucide-react"
import LeafletMap from "@/components/floodmap2025"

export default function WaterDashboard() {
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)

  const galleries = [
    {
      id: 1,
      name: "แผนที่เสี่ยงภัยน้ำท่วมเขตเมือง จังหวัดเชียงใหม่ 5 ระดับ",
      description:
        "แสดงขอบเขตของพื้นที่น้ำท่วม 5 ระดับ เทียบกับค่าระดับน้ำของแม่น้ำปิงที่สถานี P.1 เท่ากับ 4.30, 4.50, 4.70, 5.00 และ 5.30 เมตร ตามลำดับ โดยน้ำจะเริ่มล้นตลิ่งเมื่อ P.1 มากกว่า 4.20 เมตร",
      link: "#",
      images: [
        { id: 1, url: "/images/flood/levelflood2025/final/level1.jpg", title: " แผนที่พื้นที่น้ำท่วมลำดับที่ 1" },
        { id: 2, url: "/images/flood/levelflood2025/final/level2.jpg", title: " แผนที่พื้นที่น้ำท่วมลำดับที่ 2" },
        { id: 3, url: "/images/flood/levelflood2025/final/level3.jpg", title: " แผนที่พื้นที่น้ำท่วมลำดับที่ 3" },
        { id: 4, url: "/images/flood/levelflood2025/final/level4.jpg", title: " แผนที่พื้นที่น้ำท่วมลำดับที่ 4" },
        { id: 5, url: "/images/flood/levelflood2025/final/level5.jpg", title: " แผนที่พื้นที่น้ำท่วมลำดับที่ 5" },
        { id: 6, url: "/images/flood/levelflood2025/final/sum5level.jpg", title: " แผนที่พื้นที่น้ำท่วมรวม 5 ระดับ" },
      ],
    },
    {
      id: 2,
      name: "แผนที่ความลึกของน้ำท่วมเชิงพื้นที่",
      description:
        "(กรณี ระดับน้ำแม่น้ำปิงที่สถานี P.1 = 5.30 เมตร) การประมาณค่าระดับความลึกของน้ำท่วมในพื้นที่น้ำท่วมเขตเมือง จังหวัดเชียงใหม่ โดยใช้ข้อมูลสภาพกายภาพของพื้นที่และค่าระดับคราบน้ำท่วม (Flood Marks) ที่เคยเกิดขึ้นในพื้นที่ แล้วนำมาประมวลผลด้วยเทคนิคการประมาณค่าเชิงพื้นที่แบบ \"Inverse Distance Weighting (IDW)\" ซึ่งเป็นวิธีการถ่วงน้ำหนักตามระยะทางระหว่างจุดข้อมูล ช่วยให้สามารถสร้างค่าความลึกของน้ำท่วมในบริเวณที่ไม่มีข้อมูลจริงให้มีความต่อเนื่องและสอดคล้องกับลักษณะทางภูมิประเทศ",
      link: "/flooddepth",
      images: [
        { id: 1, url: "/images/flood/levelflood2025/final/flooddepth.jpg", title: " แผนที่ความลึกของน้ำท่วม" },
        { id: 2, url: "/images/flood/levelflood2025/final/floodinterval.jpg", title: " แผนที่ช่วงความลึกน้ำท่วม" },
        { id: 3, url: "/images/flood/levelflood2025/floodDepth2024_v2.png", title: " แผนที่แสดงความลึกของน้ำท่วมเชิงพื้นที่ " }
      ],
    },
    {
      id: 3,
      name: "แผนที่ศูนย์พักพิงและที่จอดรถ กรณีเกิดอุทกภัย",
      description:
        "แสดงตำแหน่งศูนย์พักพิงและที่จอดรถชั่วคราวทั้งของภาครัฐและเอกชน ที่ได้จัดเตรียมไว้รองรับผู้ประสบภัยในพื้นที่เสี่ยงภัยน้ำท่วมเขตเมือง จังหวัดเชียงใหม่",
      link: "#",
      images: [
        { id: 1, url: "/images/flood/levelflood2025/final/shelterandparking.jpg", title: " แผนที่ศูนย์พักพิง+ที่จอดรถ" },
        { id: 2, url: "/images/flood/levelflood2025/final/shelter.jpg", title: " แผนที่ศูนย์พักพิง" },
        { id: 3, url: "/images/flood/levelflood2025/final/parking.jpg", title: " แผนที่ที่จอดรถ " }
      ],
    },
    {
      id: 4,
      name: "หลักเตือนระดับน้ำท่วมเขตเมืองเชียงใหม่",
      description:
        "เสาหลักมีช่องบอกค่าตัวเลขระดับน้ำต่างๆ ที่จะเข้าท่วมพื้นที่ โดยเทียบกับค่าระดับน้ำปิงที่สถานี P.1 สะพานนวรัฐ เมื่อทราบค่าพยากรณ์ระดับน้ำปิงที่ P.1 ให้นำตัวเลขนั้นมาเทียบกับตัวเลขบนหลัก ก็จะทราบความสูงระดับน้ำที่จะท่วมบริวณที่มีหลักวางอยู่",
      link: "/pole2025",
      images: [
        { id: 1, url: "/images/flood/levelflood2025/floodpole.jpg", title: "หลักเตือนระดับน้ำท่วมเขตเมืองเชียงใหม่" }
      ],
    },
    {
      id: 5,
      name: "เครื่องหมายระดับน้ำท่วมเขตเมือง จ.เชียงใหม่ ปี 2567",
      description:
        "FLOOD MARKS OCT. 2024 เครื่องหมายแสดงระดับน้ำท่วม เดือนตุลาคม 2567 โดยระดับน้ำปิงที่สถานี P.1 = 5.3 เมตร เพื่อการเตือนภัยสำหรับชุมชนในพื้นที่เสี่ยงภัย จำนวน 5,000 จุด ติดตั้งกระจายทั่วพื้นที่เคยเกิดน้ำท่วมในเขตเมือง จ.เชียงใหม่ และ จ.ลำพูน โดยแสดงระดับน้ำท่วมสูงสุดวัดจากผิวถนน โดยเปรียบเทียบกับค่าระดับน้ำของแม่น้ำปิงที่สถานี P.1 เชิงสะพานนวรัฐ ซึ่งเกิดน้ำท่วมใหญ่ในเดือนตุลาคม พ.ศ. 2567 โดยที่ P.1 = 5.30 เมตร",
      link: "/floodmark",
      images: [
        { id: 1, url: "/images/flood/levelflood2025/floodmark.jpg", title: "ครื่องหมายระดับน้ำท่วมเขตเมือง" }
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
            แผนที่เสี่ยงภัยน้ำท่วมเขตเมือง จังหวัดเชียงใหม่
            <br />
            (Chiang Mai Flood Hazard Map)
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12">
            <Card className="overflow-hidden">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  แผนที่เสี่ยงภัยน้ำท่วมเขตเมือง จังหวัดเชียงใหม่
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  พื้นที่เสี่ยงภัยน้ำท่วมเขตเมืองเชียงใหม่ที่เกิดจากการล้นตลิ่งของน้ำในแม่น้ำปิง โดยแสดงขอบเขตของพื้นที่น้ำท่วม
                  5 ระดับ เทียบกับค่าระดับน้ำของแม่น้ำปิงที่สถานี P.1 เท่ากับ 4.30, 4.50, 4.70, 5.00 และ 5.30 เมตร ตามลำดับ
                  ซึ่งน้ำจะเริ่มล้นตลิ่งเมื่อ P.1 มากกว่า 4.20 เมตร
                </p>

                <div className="rounded-xl border bg-card p-2 sm:p-3">
                  <LeafletMap />
                </div>
              </CardContent>

              {/* Galleries */}
              <CardContent className="pt-0 pb-8">
                <div className="space-y-8 mt-6">
                  {galleries.map((gallery) => (
                    <Card key={gallery.id} className="p-5 sm:p-6 shadow-sm">
                      <div className="mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                          <a target="_blank"
                            href={gallery.link}
                            className="text-lg sm:text-xl font-semibold text-foreground hover:text-blue-800 transition"
                          >
                            {gallery.name} <a
                              target="_blank"
                              rel="noopener noreferrer"
                              href={gallery.link}
                              className="inline-flex items-center justify-center px-2 py-1 text-sm rounded-md border hover:bg-muted transition"
                              title="Open link in new tab"
                            >
                               ดูรายละเอียด
                            </a>
                          </a>
                          {/* ✅ ปุ่มลิงก์ข้างๆ */}
                            
                          {/* <h2 className="text-lg sm:text-xl font-semibold text-foreground">{gallery.name}</h2> */}
                          <Badge variant="outline" className="w-fit">
                            {gallery.images.length} ภาพ
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {gallery.description}
                        </p>
                      </div>

                      {/* ✅ รูปบรรทัดละ 3 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
                        {gallery.images.map((image) => (
                          <div
                            key={image.id}
                            className="group relative aspect-[16/9] rounded-xl overflow-hidden border bg-muted cursor-pointer hover:shadow-md transition"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={ image.title}
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
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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
      </main>
    </div>
  )
}

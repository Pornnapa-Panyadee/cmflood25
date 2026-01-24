"use client"

import { useState, useCallback, useEffect } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, MapPin, BookImage, TrendingDown, Minus, Waves } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import LeafletMap from "@/components/floodmark"
import { useRouter } from "next/navigation"
import Image from "next/image"



type Pole = {
  id: number
  code: string
  place_detail: string
  base_level: number
  water_level: number
  flood_max: number
  pix: string
  latitude: number
  longitude: number
  tool: string
}


export default function WaterDashboard() {

  const router = useRouter()
  const [data, setData] = useState<Pole[]>([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")

  useEffect(() => {
    async function loadGeoJSON() {
      const res = await fetch("/data/New_floodMark_2025_fixed_like_pole.geojson")
      const geojson = await res.json()
      const features = geojson.features.map((f: any) => f.properties)
      setData(features)
      setPending(false)
    }
    loadGeoJSON()
  }, [])

  // ✅ Filter data
  const filteredData = data.filter((item) =>
    item.place_detail.toLowerCase().includes(filterText.toLowerCase()) ||
    item.code.toLowerCase().includes(filterText.toLowerCase())
  )

  // ✅ Define columns
  const columns: TableColumn<Pole>[] = [
  {
    name: "#",
    width: "50px",
    cell: (_row, index) => (
      <div className="flex justify-center items-center w-full">
        {index + 1}
      </div>
    ),
  },
  {
    name: "รหัส",
    selector: (row) => row.code,
    sortable: true,
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.code}
      </div>
    ),
  },
  {
    name: <>โครงสร้างที่ทำ<br/>เครื่องหมาย</>,
    width: "160px",
    selector: (row) => row.tool,
    sortable: true,
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.tool}
      </div>
    ),
  },
  {
    name: "ตำแหน่งที่ตั้ง",
    width: "260px",
    selector: (row) => row.place_detail,
    sortable: true,
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.place_detail}
      </div>
    ),
  },
  {
    name: "พิกัด",
    width: "200px",
    selector: (row) => row.latitude,
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.latitude}, {row.longitude}
      </div>
    ),
  },
  {
    name: <>ระดับน้ำท่วม<br />(ซม.)</>,
    selector: (row) => row.water_level,
    sortable: true,
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.water_level.toFixed(2)}
      </div>
    ),
  },
  {
    name: "ภาพประกอบ",
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        <Button
          variant="outline"
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 flex items-center gap-1"
          onClick={() => window.open(`/`, "_blank")}
        >
          <BookImage className="w-4 h-4" /> ภาพประกอบ
        </Button>
      </div>
    ),
  },
  {
    name: "เส้นทาง",
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        <Button
          variant="default"
          size="sm"
          className="bg-primary text-white hover:bg-primary/90 flex items-center gap-1"
          onClick={() =>
            window.open(
              `https://www.google.com/maps?q=${row.latitude},${row.longitude}`,"_blank"
            )
          }
        >
          <MapPin className="h-4 w-4" /> เส้นทาง
        </Button>
      </div>
    ),
  },
]

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-10xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h3 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-2xl text-balance">
           เครื่องหมายระดับน้ำท่วมเขตตัวเมืองเชียงใหม่ ปี 2567 (CM Flood Mark 2024)
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
                      <CardTitle className="flex flex-col items-center justify-center text-center text-blue-700 text-sm">
                      เครื่องหมายระดับน้ำท่วม <br /> (Flood Mark)
                      </CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex items-baseline gap-2 mt-[10px] mb-[40px]">
                        <Image
                            src="/images/floodmark/floodmark.jpg"
                            alt="City flood map"
                            width={1000}
                            height={600}
                            className="rounded-xl object-cover shadow-md w-full h-auto"
                          />
                      </div>
                  </CardContent>
                  <CardContent>
                      <p className="list-disc list-inside space-y-2 text-sm text-gray-700">
                          เพื่อการเตือนภัยสำหรับชุมชนในพื้นที่เสี่ยงภัย จำนวน 5,000 จุด ติดตั้งกระจายทั่วพื้นที่เคยเกิดน้ำท่วมในเขตเมือง จ.เชียงใหม่ และ จ.ลำพูน โดยแสดงระดับน้ำท่วมสูงสุดวัดจากผิวถนน โดยเปรียบเทียบกับค่าระดับน้ำของแม่น้ำปิงที่สถานี P.1 เชิงสะพานนวรัฐ ซึ่งเกิดน้ำท่วมใหญ่ในเดือนตุลาคม พ.ศ. 2567 โดยที่ P.1 = 5.30 เมตร 
                          <a 
                            href="/data/floodmark/hydro.jpg" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            (อ้างอิง : Hydrograph)
                          </a>
                      </p>
                     
                  </CardContent>
                  
                  {/* <CardContent>
                      <div className="flex items-baseline gap-2">
                        <Image
                            src="/images/floodmark/flood_ref1.png"
                            alt="City flood map"
                            width={1000}
                            height={600}
                            className="rounded-xl object-cover shadow-md w-full h-auto"
                          />
                      </div>
                  </CardContent> */}
                  <CardContent>
                    <div className="flex flex-col items-center text-center mt-6 -mt-[20px]">
                      <h3 className="text-base font-semibold text-blue-700 mb-6">
                        สัญลักษณ์เครื่องหมายระดับน้ำท่วม
                      </h3>

                      <div className="bg-white rounded-xl shadow-md px-6 py-3 border border-gray-200 w-full">
                        <div className="flex justify-between items-center w-full">
                          {/* flood icons */}
                          <div className="flex flex-col items-center">
                            <Image src="/images/floodmark/flood_green.png" alt="ต่ำมาก" width={50} height={50} />
                            <span className="text-xs text-gray-800 mt-1">0 - 40</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image src="/images/floodmark/flood_yellow.png" alt="ปานกลาง" width={50} height={50} />
                            <span className="text-xs text-gray-800 mt-1">41 - 80</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image src="/images/floodmark/flood_orange.png" alt="สูง" width={50} height={50} />
                            <span className="text-xs text-gray-800 mt-1">81 - 120</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image src="/images/floodmark/flood_red.png" alt="รุนแรง" width={50} height={50} />
                            <span className="text-xs text-gray-800 mt-1">121 - 160</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <Image src="/images/floodmark/flood_purple.png" alt="สูงมาก" width={50} height={50} />
                            <span className="text-xs text-gray-800 mt-1">&gt; 160</span>
                          </div>
                          
                        </div>
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          ระดับน้ำ (เซนติเมตร)
                          </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardContent>
                      <div className="flex flex-col items-center text-center mt-6 -mt-[20px]">
                        <Image
                            src="/images/floodmark/refflood24.png"
                            alt="City flood map"
                            width={1000}
                            height={600}
                            className="rounded-xl object-cover shadow-md w-full h-auto"
                          />
                      </div>
                  </CardContent>


                </Card>
            </div>
            
            {/* 🗺️ แผนที่ (9 ส่วน) */}
            <div className="col-span-12 md:col-span-9 ">
              <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    เครื่องหมายระดับน้ำท่วมเขตตัวเมืองเชียงใหม่ ปี 2567 (CM Flood Mark 2024)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-primary">FLOOD MARKS OCT. 2024 เครื่องหมายแสดงระดับน้ำท่วม เดือนตุลาคม 2567 โดยระดับน้ำปิงที่สถานี P.1 = 5.3 เมตร</p>
                </CardContent>
                <CardContent>
                    <LeafletMap />
                </CardContent>
                
              </Card>
                
            </div>

            
            </div>
        </div>

        {/* table */}
        <div className="p-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-semibold text-blue-700">
                ตารางแสดงรายละเอียดหลักระดับน้ำท่วมในพื้นที่เขตเมืองเชียงใหม่
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* ✅ Search box */}
              <div className="flex justify-between items-center mb-4">
                <div></div>
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="border rounded-md px-3 py-1 text-sm"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>

              {/* ✅ DataTable */}
              <div className="max-w-6xl mx-auto">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    progressPending={pending}
                    pagination
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    highlightOnHover
                    striped
                    responsive
                    dense
                    paginationPerPage={10}
                    paginationComponentOptions={{
                        rowsPerPageText: "จำนวนแถวต่อหน้า:",
                        rangeSeparatorText: "จาก",
                    }}
                    customStyles={{
                        headCells: {
                        style: {
                            display: "flex",
                            justifyContent: "center",  // ✅ จัดแนวนอนกลาง
                            alignItems: "center",      // ✅ จัดแนวตั้งกลาง
                            textAlign: "center",
                            whiteSpace: "normal",      // ✅ อนุญาตขึ้นบรรทัดใหม่
                            wordBreak: "break-word",   // ✅ ตัดคำได้ถ้ายาวเกิน
                            lineHeight: "1.3rem",      // ✅ ระยะบรรทัดพอดี
                            fontWeight: "bold",
                            backgroundColor: "#ecf0f8ff",
                            fontSize: "15px",
                            minHeight: "55px",
                            padding: "8px 10px",
                            color: "#1e3a8a",
                        },
                        },
                        rows: {
                        style: {
                            minHeight: "55px",
                            fontSize: "15px",
                        },
                        },
                        cells: {
                        style: {
                            padding: "12px 16px",
                            fontSize: "15px",
                            justifyContent: "center",
                            alignItems: "center",
                        },
                        },
                    }}
                    />

              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

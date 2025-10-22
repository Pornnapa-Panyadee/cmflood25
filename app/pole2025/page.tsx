"use client"

import { useState, useCallback, useEffect } from "react"
import DataTable, { TableColumn } from "react-data-table-component"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Droplets, MapPin, BookImage, TrendingDown, Minus, Waves } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import LeafletMap from "@/components/pole"
import { useRouter } from "next/navigation"
import Image from "next/image"



type Pole = {
  id: number
  pole_id: string
  pole_name: string
  base_level: number
  flood_level: number
  flood_max: number
  pix: string
  lat: number
  long: number
}

export default function WaterDashboard() {

  const router = useRouter()
  const [data, setData] = useState<Pole[]>([])
  const [pending, setPending] = useState(true)
  const [filterText, setFilterText] = useState("")

  useEffect(() => {
    async function loadGeoJSON() {
      const res = await fetch("/data/PoleCNX2025_v2.geojson")
      const geojson = await res.json()
      const features = geojson.features.map((f: any) => f.properties)
      setData(features)
      setPending(false)
    }
    loadGeoJSON()
  }, [])

  // ✅ Filter data
  const filteredData = data.filter((item) =>
    item.pole_name.toLowerCase().includes(filterText.toLowerCase()) ||
    item.pole_id.toLowerCase().includes(filterText.toLowerCase())
  )

  // ✅ Define columns
  const columns: TableColumn<Pole>[] = [
  {
    name: "#",
    width: "60px",
    cell: (_row, index) => (
      <div className="flex justify-center items-center w-full">
        {index + 1}
      </div>
    ),
  },
  {
    name: "รหัส",
    selector: (row) => row.pole_id,
    sortable: true,
    width: "80px",
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.pole_id}
      </div>
    ),
  },
  {
    name: "บริเวณที่ตั้ง",
    selector: (row) => row.pole_name,
    sortable: true,
    grow: 2,
    cell: (row) => (
      <div className="flex justify-start items-center w-full">
        {row.pole_name}
      </div>
    ),
  },
  {
    name: "ระดับฐานหลัก",
    selector: (row) => row.base_level,
    sortable: true,
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.base_level.toFixed(3)}
      </div>
    ),
  },
  {
    name: <>ระดับน้ำท่วม<br />สูงสุด</>,
    selector: (row) => row.flood_level,
    sortable: true,
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.flood_level.toFixed(3)}
      </div>
    ),
  },
  {
    name: <>ระดับน้ำท่วม<br />จากฐานหลัก</>,
    selector: (row) => row.flood_max,
    sortable: true,
    cell: (row) => (
      <div className="flex justify-center items-center w-full">
        {row.flood_max.toFixed(2)}
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
          onClick={() => window.open(`https://watercenter.scmc.cmu.ac.th/cmflood/images/originals2025/${row.pix}`, "_blank")}
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
              `https://www.google.com/maps?q=${row.lat},${row.long}`,
              "_blank"
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
                       หลักเตือนระดับน้ำท่วมเขตเมือง จังหวัดเชียงใหม่ (CM Flood Poles)
                    </CardTitle>
                </CardHeader>
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
              <div className="w-[90%] max-w-6xl mx-auto">
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

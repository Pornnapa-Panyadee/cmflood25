import fs from "fs"
import path from "path"
import WaterReportClient from "./WaterReportClient"

// ✅ สร้าง static paths จาก GeoJSON
export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "public/data/pole.geojson")
  const file = fs.readFileSync(filePath, "utf-8")
  const geojson = JSON.parse(file)

  // ✅ แปลง id เป็น string
  return geojson.features.map((f: any) => ({
    id: String(f.properties.id),
  }))
}

// ✅ ต้อง async และ await params ก่อนใช้
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params
  return <WaterReportClient id={resolved.id} />
}

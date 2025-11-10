"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import NextImage from "next/image"
import dynamic from "next/dynamic"
import html2canvas from "html2canvas"
import domtoimage from "dom-to-image-more"
const LeafletMap = dynamic(() => import("@/components/pole"), { ssr: false })

export default function WaterReportClient({ id }: { id: string }) {
  const [feature, setFeature] = useState<any>(null)
  const [img1, setImg1] = useState("")
  const [img2, setImg2] = useState("")
  const captureRef = useRef<HTMLDivElement>(null)

  // โหลดข้อมูลจาก GeoJSON
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/data/pole.geojson")
        const geo = await res.json()
        const found = geo.features.find(
          (f: any) => String(f.properties.id) === id
        )
        setFeature(found || null)
      } catch (err) {
        console.error("โหลดข้อมูลไม่ได้:", err)
      }
    }
    loadData()
  }, [id])

  // โหลดรูปจาก code (.jpeg → fallback .jpg)
  useEffect(() => {
    if (!feature) return
    const p = feature.properties
    const base = "https://watercenter.scmc.cmu.ac.th/cmflood/flood_mark_2024/"

    const tryLoad = (jpeg: string, jpg: string, setFn: any) => {
      const testImg = new window.Image()
      testImg.src = jpeg
      testImg.onload = () => setFn(jpeg)
      testImg.onerror = () => setFn(jpg)
    }

    tryLoad(`${base}${p.code}_1.jpeg`, `${base}${p.code}_1.jpg`, setImg1)
    tryLoad(`${base}${p.code}_2.jpeg`, `${base}${p.code}_2.jpg`, setImg2)
  }, [feature])

  if (!feature)
    return (
      <p className="text-center text-gray-500 mt-12">
        ไม่พบข้อมูลสำหรับรหัส {id}
      </p>
    )

  const p = feature.properties

  // ปุ่มดาวน์โหลด JPG
  const handleDownload = async () => {
    if (!captureRef.current) return
    const canvas = await html2canvas(captureRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    })
    const link = document.createElement("a")
    link.download = `${p.code}.jpg`
    link.href = canvas.toDataURL("image/jpeg", 1.0)
    link.click()
  }

  const levelIcon =
    p.water_level <= 40
      ? "flood_green.png"
      : p.water_level <= 80
      ? "flood_yellow.png"
      : p.water_level <= 120
      ? "flood_orange.png"
      : "flood_red.png"


  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center px-2 py-6">
        <div className="text-center mb-10">
          <h3 className="mb-3 text-xl  tracking-tight text-foreground">
            เครื่องหมายระดับน้ำท่วมเขตตัวเมืองเชียงใหม่ ปี 2567 (Chiang Mai Flood Mark 2024)
          </h3>
          <div className="flex justify-center items-center gap-2 mt-4">
            <h4 className="text-xl">รหัส : {p.code} </h4>
            <NextImage
              src={`/images/floodmark/${levelIcon}`}
              alt="ระดับน้ำ"
              width={28}
              height={60}
            />
          </div>
        </div>
      <main
        ref={captureRef}
        className="bg-white border border-black max-w-[900px] w-full p-2 sm:p-4"
        style={{ minWidth: "800px", backgroundColor: "#ffffff" }}
      >
        {/* 🔹 รูป 2 ภาพด้านบน */}
        <div className="flex justify-center border-b border-black">
          <div className="w-1/2 border-r border-black">
            {img1 && (
              <NextImage
                src={img1}
                alt="Flood Mark 1"
                width={800}
                height={600}
                className="object-cover w-full h-[300px]"
              />
            )}
          </div>
          <div className="w-1/2">
            {img2 && (
              <NextImage
                src={img2}
                alt="Flood Mark 2"
                width={800}
                height={600}
                className="object-cover w-full h-[300px]"
              />
            )}
          </div>
        </div>

        {/* 🔹 รายละเอียด */}
        <div className="bg-[#cce5ff] border-t border-black p-4 sm:p-6">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              เครื่องหมายระดับน้ำท่วมตัวเมืองเชียงใหม่ เดือนตุลาคม พ.ศ. 2567
            </h3>
            <p className="text-base sm:text-lg font-medium text-gray-700">
              Chiangmai Flood Mark Oct. 2024
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-12 gap-4 items-center">
            {/* โลโก้ CMU */}
            <div className="col-span-3 flex justify-center">
              <NextImage
                src="/images/logo/cmu01.png"
                alt="CMU Logo"
                width={160}
                height={160}
                className="object-contain"
              />
            </div>

            {/* รายละเอียดฝั่งซ้าย */}
            <div className="col-span-5 text-gray-800 text-sm leading-relaxed">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  หมายเลขพิกัด <b>{p.code}</b>
                </li>
                <li>โครงสร้างที่ทำเครื่องหมาย : {p.tool}</li>
                <li>ที่ติดตั้ง : {p.place_detail}</li>
                <li>
                  พิกัด : {p.latitude}, {p.longitude}
                </li>
              </ul>
            </div>

            {/* รายละเอียดฝั่งขวา */}
            <div className="col-span-4 text-gray-800 text-sm leading-relaxed">
              <ul className="list-disc list-inside space-y-1">
                <li>เทียบกับระดับน้ำปิงสถานี P.1 = 5.30 ม.</li>
                <li>ระดับน้ำท่วมสูงจากผิวถนน</li>
              </ul>
              <div className="flex items-baseline mt-2">
                <span className="text-5xl font-extrabold text-gray-900">
                  {p.water_level}
                </span>
                <span className="ml-2 text-lg text-gray-800">ซม.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 🔹 ปุ่มดาวน์โหลด */}
      <button
        onClick={handleDownload}
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
      >
        Download as JPG
      </button>
    </div>
  )
}

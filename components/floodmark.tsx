"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import { MapPin, BookImage } from "lucide-react"

export default function CnxTif() {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    async function initMap() {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const L = (await import("leaflet")).default

      // 🗺️ พื้นหลัง
      const map = L.map("map", { center: [18.787563, 99.003968], zoom: 13 })
      mapRef.current = map

      const googleSat = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=YOUR_API_KEY",
        { maxZoom: 20, attribution: "&copy; Google Satellite" }
      )
      const googleTerrain = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=YOUR_API_KEY",
        { maxZoom: 20, attribution: "&copy; Google Terrain" }
      )

      const googleRoad = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        { maxZoom: 20, attribution: "&copy; Google Map" }
      )
      

      const osm = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19, attribution: "&copy; OpenStreetMap contributors" }
      )

      googleRoad.addTo(map)

      // --------------------------------------------------
      // ✅ โหลด GeoJSON จุด (Pole)
      // --------------------------------------------------
      try {
        const poleRes = await fetch("/data/pole.geojson")
        const poleData = await poleRes.json()

        // 🟢 ฟังก์ชันเลือก icon ตามระดับน้ำ
        const getFloodIcon = (level: number) => {
          if (level === 1) return "flood_green.png"
          if (level === 2) return "flood_yellow.png"
          if (level === 3) return "flood_orange.png"
          if (level === 4) return "flood_red.png"
          return "flood_purple.png"
        }

        const poleLayer = L.geoJSON(poleData, {
          pointToLayer: (feature, latlng) => {
            const poleName = feature.properties?.place_detail || "จุดตรวจวัด"
            const tool = feature.properties?.tool || "-"
            const floodLevel = feature.properties?.water_level || 0
            const poleId = feature.properties?.code || "-"
            const class_flood = feature.properties?.class || 0
            const imgUrl = `https://watercenter.scmc.cmu.ac.th/cmflood/images/originals2025/${feature.properties?.pix}`
            const lat = latlng.lat
            const lng = latlng.lng
            const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

            const iconUrl = `/images/floodmark/${getFloodIcon(class_flood)}`
            const poleIcon = L.icon({
              iconUrl,
              iconSize: [25, 30],
              iconAnchor: [14, 36],
              popupAnchor: [0, -30],
            })

            const popupContent = `
              <div style="text-align:left;font-family:'Prompt',sans-serif;">
                <h2 style="margin:6px 0;color:#0070f3;">
                  <b>หมายเลขหลัก: ${poleId}</b>
                </h2>
                <h3 style="margin:4px 0;">บริเวณที่ตั้ง: ${poleName}</h3>
                <p style="margin:4px 0;">ระดับน้ำท่วม: ${floodLevel} ซม.</p>
                <p style="margin:4px 0;">โครงสร้างที่ทำเครื่องหมาย: ${tool}</p>
                
                <div style="display:flex;justify-content:center;gap:10px;margin-top:8px;">
                  <a href="${imgUrl}" target="_blank"
                    style="background:#1d4ed8;color:white;padding:6px 12px;border-radius:6px;text-decoration:none;">
                    🔍 ดูภาพประกอบ
                  </a>
                  <a href="${gmapUrl}" target="_blank"
                    style="background:#1d4ed8;color:white;padding:6px 12px;border-radius:6px;text-decoration:none;">
                    📍 ขอเส้นทาง
                  </a>
                </div>
              </div>
            `
            return L.marker(latlng, { icon: poleIcon }).bindPopup(popupContent, {
              maxWidth: 360,
              minWidth: 360,
              className: "custom-popup",
            })
          },
        }).addTo(map)

        // --------------------------------------------------
        // ✅ Layer Control
        // --------------------------------------------------
        const baseLayers = {
          "🛰️ Google Satellite": googleSat,
          "🏔️ Google Terrain": googleTerrain,
        }

        const overlays: Record<string, L.Layer> = {
          "หลักเตือนระดับน้ำท่วมเขตเมือง": poleLayer,
        }

        L.control.layers(baseLayers, overlays, { collapsed: true }).addTo(map)
      } catch (err) {
        console.error("❌ โหลด pole.geojson ไม่สำเร็จ:", err)
      }
    }

    initMap()
  }, [])

  return <div id="map" className="w-full h-[80vh]" />
}

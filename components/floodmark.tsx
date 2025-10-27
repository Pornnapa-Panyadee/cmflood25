"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import { tr } from "date-fns/locale"

export default function CnxTif() {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    async function initMap() {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const L = (await import("leaflet")).default
      const map = L.map("map", { center: [18.787563, 99.003968], zoom: 13 })
      mapRef.current = map

      const googleRoad = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        { maxZoom: 20, attribution: "&copy; Google Map" }
      ).addTo(map)

      const googleSat = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=YOUR_API_KEY",
        { maxZoom: 20, attribution: "&copy; Google Satellite" }
      )

      const googleTerrain = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=YOUR_API_KEY",
        { maxZoom: 20, attribution: "&copy; Google Terrain" }
      )

      // 🟢 กำหนด icon ตามสี
      const getFloodIcon = (level: number) => {
        if (level <= 40) return "flood_green.png"
        if (level <= 80) return "flood_yellow.png"
        if (level <= 120) return "flood_orange.png"
        if (level <= 160) return "flood_red.png"
        return "flood_purple.png"
      }

      const createMarker = (feature: any, latlng: L.LatLng) => {
        const floodLevel = feature.properties?.water_level || 0
        const iconUrl = `/images/floodmark/${getFloodIcon(floodLevel)}`
        const poleIcon = L.icon({
          iconUrl,
          iconSize: [25, 30],
          iconAnchor: [14, 36],
          popupAnchor: [0, -30],
        })

        const poleId = feature.properties?.code || "-"
        const poleName = feature.properties?.place_detail || "-"
        const tool = feature.properties?.tool || "-"
        const imgUrl = `https://watercenter.scmc.cmu.ac.th/cmflood/images/originals2025/${feature.properties?.pix}`
        const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${latlng.lat},${latlng.lng}`

        const popupContent = `
          <div style="text-align:left;font-family:'Prompt',sans-serif;">
            <h2 style="margin:6px 0;color:#0070f3;"><b>หมายเลขหลัก: ${poleId}</b></h2>
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
      }

      // --------------------------------------------------
      // ✅ โหลด GeoJSON
      // --------------------------------------------------
      try {
        const res = await fetch("/data/pole.geojson")
        const data = await res.json()

        // 🔹 แบ่ง Layer ตามระดับน้ำ
        const greenLayer = L.geoJSON(data, {
          filter: (f) => (f.properties?.water_level || 0) <= 40,
          pointToLayer: createMarker,
        })

        const yellowLayer = L.geoJSON(data, {
          filter: (f) => (f.properties?.water_level || 0) > 40 && (f.properties?.water_level || 0) <= 80,
          pointToLayer: createMarker,
        })

        const orangeLayer = L.geoJSON(data, {
          filter: (f) => (f.properties?.water_level || 0) > 80 && (f.properties?.water_level || 0) <= 120,
          pointToLayer: createMarker,
        })

        const redLayer = L.geoJSON(data, {
          filter: (f) => (f.properties?.water_level || 0) > 120 && (f.properties?.water_level || 0) <= 160,
          pointToLayer: createMarker,
        })

        const purpleLayer = L.geoJSON(data, {
          filter: (f) => (f.properties?.water_level || 0) > 160,
          pointToLayer: createMarker,
        })

        // --------------------------------------------------
        // ✅ Layer Control
        // --------------------------------------------------
        const baseLayers = {
          "ถนน (Google Road)": googleRoad,
          "ดาวเทียม (Satellite)": googleSat,
          "ภูมิประเทศ (Terrain)": googleTerrain,
        }

        const overlays: Record<string, L.Layer> = {
          "🟢 ระดับน้ำ 0 - 40 ซม. ": greenLayer,
          "🟡 ระดับน้ำ 41 - 80 ซม.": yellowLayer,
          "🟠 ระดับน้ำ 81 - 120 ซม.": orangeLayer,
          "🔴 ระดับน้ำ 121 - 160 ซม.": redLayer,
          "🟣 ระดับน้ำ > 160 ซม.": purpleLayer,
        }

        // เพิ่มทุก layer เข้า map เริ่มต้น
        const styleEl = document.createElement("style")
        styleEl.innerHTML = `
          .leaflet-container, .leaflet-popup-content, .leaflet-control {
            font-family: 'Prompt', sans-serif !important;
          }
        `
        document.head.appendChild(styleEl)
        Object.values(overlays).forEach((layer) => layer.addTo(map))

        L.control.layers(baseLayers, overlays, { collapsed: true, position: "topright" }).addTo(map)
      } catch (err) {
        console.error("❌ โหลด pole.geojson ไม่สำเร็จ:", err)
      }
    }

    initMap()
  }, [])

  return <div id="map" className="w-full h-[100vh]" />
}

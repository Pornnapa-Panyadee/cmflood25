"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import { fromArrayBuffer } from "geotiff"
import { kml } from "togeojson"
import {  MapPin, BookImage} from "lucide-react"

type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array

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
      const map = L.map("map", { center: [18.781, 99.006], zoom: 14 })
      mapRef.current = map

      const googleSat = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}&key=YOUR_API_KEY",
        { maxZoom: 20, attribution: "&copy; Google Satellite" }
      )

      const googleTerrain = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}&key=YOUR_API_KEY",
        { maxZoom: 20, attribution: "&copy; Google Terrain" }
      )


      googleTerrain.addTo(map)

      // --------------------------------------------------
      // ✅ โหลด KML (River / Road)
      // --------------------------------------------------
      
      let poleLayer: L.GeoJSON | null = null

     
      // --------------------------------------------------
      // ✅ โหลด GeoJSON จุด (Pole)
      // --------------------------------------------------
      try {
        const poleRes = await fetch("/data/PoleCNX2025_v2.geojson")
        const poleData = await poleRes.json()

         const poleIcon = L.icon({
          iconUrl: "/images/pole/pole3.png",
          iconSize: [16, 44],
          iconAnchor: [20, 0],
          popupAnchor: [-10, 0]
        })

        poleLayer = L.geoJSON(poleData, {
        pointToLayer: (feature, latlng) => {
          const poleName = feature.properties?.pole_name || "จุดตรวจวัด"
          const floodLevel = feature.properties?.flood_level
            ? `${feature.properties.flood_level} ซม.`
            : "ไม่มีข้อมูล"
          const imgUrl = `https://watercenter.scmc.cmu.ac.th/cmflood/images/originals2025/${feature.properties?.pix}`
          const lat = latlng.lat
          const lng = latlng.lng
          const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`

          const popupContent = `
            <div style="
              width: 450px;
              text-align: center;
              font-family: 'Prompt', sans-serif;
            ">
              <h2 style="margin: 6px 0; color: #0070f3;"> <b> หมายเลขหลัก : ${feature.properties?.pole_id} ( ${poleName} ) </b></h2>
              <p style="margin: 4px 0;">ระดับน้ำ: ${floodLevel}</p>
              <img src="${imgUrl}"
                  alt="${poleName}"
                  style="width: 100%; height: auto; border-radius: 8px; margin: 8px 0; object-fit: cover;">
              <div style="display: flex; justify-content: center; gap: 10px; margin-top: 8px;">
                <a href="${imgUrl}" target="_blank" 
                  style="background: #1d4ed8; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none;">
                  <BookImage className="h-4 w-4" /> ดูภาพประกอบ
                </a>
                <a href="${gmapUrl}" target="_blank"
                  style="background: #1d4ed8; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none;">
                  <MapPin className="h-4 w-4" /> ขอเส้นทาง
                </a>
              </div>
            </div>
          `

          return L.marker(latlng, { icon: poleIcon }).bindPopup(popupContent, {
            maxWidth: 460,
            minWidth: 460,
            className: "custom-popup"
          })
        },
      }).addTo(map)


      } catch (err) {
        console.error("❌ โหลด PoleCNX.geojson ไม่สำเร็จ:", err)
      }


      // --------------------------------------------------
      // ✅ Layer Control
      // --------------------------------------------------
      const baseLayers = {
        "🛰️ Google Satellite": googleSat,
        "🏔️ Google Terrain": googleTerrain,
      }

  const overlays: Record<string, L.Layer> = {}
  if (poleLayer) {
    overlays["ฝั่งตะวันตก"] = poleLayer
    poleLayer.addTo(map)
  }
  
  L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map)


    }

    initMap()
  }, [])

  return <div id="map" className="w-full h-[80vh]" />
}

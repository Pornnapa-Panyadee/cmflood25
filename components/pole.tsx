"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import { fromArrayBuffer } from "geotiff"
import { kml } from "togeojson"

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
          iconSize: [18, 48],
          iconAnchor: [20, 0],
          popupAnchor: [-10, 0]
        })

        poleLayer = L.geoJSON(poleData, {
          pointToLayer: (feature, latlng) =>
            L.marker(latlng, { icon: poleIcon }).bindPopup(
              `📍 <b>${feature.properties?.pole_name || "จุดตรวจวัด"}</b><br>` +
                (feature.properties?.flood_level ? `ระดับน้ำ: ${feature.properties.flood_level} ซม.` : "")
            ),
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

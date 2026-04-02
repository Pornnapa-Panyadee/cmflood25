"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import "leaflet-groupedlayercontrol/dist/leaflet.groupedlayercontrol.min.css"
import { kml as toGeoJSONKml } from "togeojson"

export default function CnxTif() {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    async function initMap() {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const L = (await import("leaflet")).default
      await import("leaflet-groupedlayercontrol")

      const map = L.map("map", { center: [18.787563, 99.003968], zoom: 12 })
      mapRef.current = map

      // --------------------------------------------------
      //  Base maps
      // --------------------------------------------------
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

      // --------------------------------------------------
      // 🧩 Flood icons
      // --------------------------------------------------
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
        const pix = feature.properties?.code || "-"
        const id = feature.properties?.id|| "-"
        // console.log("Pole ID:", poleId)
        //const imgUrl = `https://watercenter.scmc.cmu.ac.th/cmflood/flood24/image/${pix}`
        // const imgUrl = `https://watercenter.scmc.cmu.ac.th/cmflood/flood_mark_2024/${pix}_1.jpg`
        const imgUrl = `/report/${id}`
        const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${latlng.lat},${latlng.lng}`

        const popupContent = `
          <div style="text-align:left;font-family:'Prompt',sans-serif;">
            <h2 style="margin:6px 0;color:#0070f3;"><b>หมายเลขหลัก: ${poleId} </b></h2>
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
        return L.marker(latlng, { icon: poleIcon }).bindPopup(popupContent)
      }

      // --------------------------------------------------
      // ✅ โหลด GeoJSON
      // --------------------------------------------------
      const res = await fetch("/data/New_floodMark_2025_fixed_like_pole.geojson")
      const data = await res.json()

      const greenLayer = L.geoJSON(data, {
        filter: (f) => (f.properties?.water_level || 0) <= 40,
        pointToLayer: createMarker,
      })
      const yellowLayer = L.geoJSON(data, {
        filter: (f) =>
          (f.properties?.water_level || 0) > 40 && (f.properties?.water_level || 0) <= 80,
        pointToLayer: createMarker,
      })
      const orangeLayer = L.geoJSON(data, {
        filter: (f) =>
          (f.properties?.water_level || 0) > 80 && (f.properties?.water_level || 0) <= 120,
        pointToLayer: createMarker,
      })
      const redLayer = L.geoJSON(data, {
        filter: (f) =>
          (f.properties?.water_level || 0) > 120 && (f.properties?.water_level || 0) <= 160,
        pointToLayer: createMarker,
      })
      const purpleLayer = L.geoJSON(data, {
        filter: (f) => (f.properties?.water_level || 0) > 160,
        pointToLayer: createMarker,
      })

      // --------------------------------------------------
      // โหลด KML → GeoJSON
      // --------------------------------------------------
      const loadKmlAsLayer = async (url: string, color: string) => {
        const xmlText = await fetch(url).then((r) => r.text())
        const xmlDom = new DOMParser().parseFromString(xmlText, "text/xml")
        const geojson = toGeoJSONKml(xmlDom)
        const layer = L.geoJSON(geojson, {
          style: {
            stroke: false,
            fillColor: color,
            fillOpacity: 0.5,
          },
        })
        return layer
      }

      const loadKml = async (url: string, color: string, weight = 1) => {
        const res = await fetch(url)
        const text = await res.text()
        const xml = new DOMParser().parseFromString(text, "text/xml")
        const geo = toGeoJSONKml(xml)
        return L.geoJSON(geo, { style: { color, weight, opacity: 0.8 } })
      }

      const cnxLayer = await loadKmlAsLayer("/data/KML5Layer/L5.kml", "#0070f3")
      // const lpnLayer = await loadKmlAsLayer("/data/KML/LPN_b.kml", "#0070f3")
      const pingLayer = await loadKml("/data/KML/Ping_main.kml", "#94c6ffff", 2)

      // --------------------------------------------------
      // Grouped Layer Control
      // --------------------------------------------------
      const baseLayers = {
        "ถนน (Google Road)": googleRoad,
        "ดาวเทียม (Satellite)": googleSat,
        "ภูมิประเทศ (Terrain)": googleTerrain,
      }

      const groupedOverlays = {
        "ช่วงความสูงระดับน้ำท่วม": {
          "🟢 0 - 40 ซม.": greenLayer,
          "🟡 41 - 80 ซม.": yellowLayer,
          "🟠 81 - 120 ซม.": orangeLayer,
          "🔴 121 - 160 ซม.": redLayer,
          "🟣 > 160 ซม.": purpleLayer,
        },
        "พื้นที่น้ำท่วม (ต.ค. 2567)": {
          "จ.เชียงใหม่": cnxLayer,
          // "จ.ลำพูน": lpnLayer,
          "น้ำปิง": pingLayer,
        },
      }

   
      // @ts-ignore
      const groupedControl = L.control
        // @ts-ignore
        .groupedLayers(baseLayers, groupedOverlays, {
          collapsed: true,
          position: "topright",
        })
        .addTo(map)

      Object.values(groupedOverlays).forEach((group: any) => {
        Object.values(group).forEach((layer: any) => {
          layer.addTo(map)
        })
      })

      // --------------------------------------------------
      // Style
      // --------------------------------------------------
      const styleEl = document.createElement("style")
      styleEl.innerHTML = `
        .leaflet-control-layers {
          font-family: 'Prompt', sans-serif !important;
          font-size: 13px;
        }
        .leaflet-control-layers-group-name {
          font-weight: 600;
          color: #1d4ed8;
          background: #eef3ff;
          border-radius: 6px;
          padding: 4px 6px;
          margin: 3px 0;
        }
      `
      document.head.appendChild(styleEl)
    }

    initMap()
  }, [])

  return <div id="map" className="w-full h-[100vh]" />
}

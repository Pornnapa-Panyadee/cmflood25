"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import "leaflet-groupedlayercontrol/dist/leaflet.groupedlayercontrol.min.css"
import { kml as toGeoJSONKml } from "togeojson"
import type * as LType from "leaflet"

export default function CnxTif() {
  const mapRef = useRef<LType.Map | null>(null)

  useEffect(() => {
    async function initMap() {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const L = (await import("leaflet")).default
      await import("leaflet-groupedlayercontrol")

      const map = L.map("map", { center: [18.787563, 99.003968], zoom: 15 })
      mapRef.current = map

      map.whenReady(() => {
        map.invalidateSize(true)
      })

      // --------------------------------------------------
      // Base maps
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
      const darkBase = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { maxZoom: 20, attribution: " Dark Matter" }
      )

      // --------------------------------------------------
      // Load KML as filled flood boundary (polygon)
      // --------------------------------------------------
      const loadKmlAsFillLayer = async (url: string, fillColor: string) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`)
      const xmlText = await res.text()

      const xmlDom = new DOMParser().parseFromString(xmlText, "text/xml")
      const geojson = toGeoJSONKml(xmlDom)

      return L.geoJSON(geojson, {
        style: {
          color: fillColor,
          weight: 0.4,
          opacity: 0.8,
          fillColor,
          fillOpacity: 0.60,
        },
      })
    }

    // โหลดแบบ parallel เร็วขึ้น + ลด timing issue
    // const [FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer] = await Promise.all([
    //   loadKmlAsFillLayer("/data/KML5Layer/L5.kml", "#1d4ed8cc"),
    //   loadKmlAsFillLayer("/data/KML5Layer/L4.kml", "#1d4ed8"),
    //   loadKmlAsFillLayer("/data/KML5Layer/L3.kml", "#1d4ed8"),
    //   loadKmlAsFillLayer("/data/KML5Layer/L2.kml", "#1d4ed8"),
    //   loadKmlAsFillLayer("/data/KML5Layer/L1.kml", "#1d4ed8"),
    // ])
    // const [FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer] = await Promise.all([
    //   loadKmlAsFillLayer("/data/KML5Layer/L5.kml", "#7c3aedcc"), // ม่วง (อันตรายมาก)
    //   loadKmlAsFillLayer("/data/KML5Layer/L4new.kml", "#dc2626cc"), // แดง
    //   loadKmlAsFillLayer("/data/KML5Layer/L3.kml", "#f97316cc"), // ส้ม
    //   loadKmlAsFillLayer("/data/KML5Layer/L2.kml", "#eab308cc"), // เหลือง
    //   loadKmlAsFillLayer("/data/KML5Layer/L1.kml", "#22c55ecc"), // เขียว
    // ])

    // const [FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer] = await Promise.all([
    //   loadKmlAsFillLayer("/data/KML5Layer/L5.kml", "#34ccfacc"),
    //   loadKmlAsFillLayer("/data/KML5Layer/L4.kml", "#5de769cc"),
    //   loadKmlAsFillLayer("/data/KML5Layer/L3.kml", "#cdec1ccc"),
    //   loadKmlAsFillLayer("/data/KML5Layer/L2.kml", "#f36ce6cc"),
    //   loadKmlAsFillLayer("/data/KML5Layer/L1.kml", "#580d6ccc"),
    // ])

    // const [FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer] = await Promise.all([
    //   loadKmlAsFillLayer("/data/KML5Layer/L5.kml", "#fb0000cc"), // ม่วง (อันตรายมาก)
    //   loadKmlAsFillLayer("/data/KML5Layer/L4new.kml", "#fb8200cc"), // แดง
    //   loadKmlAsFillLayer("/data/KML5Layer/L3.kml", "#f97316cc"), // ส้ม
    //   loadKmlAsFillLayer("/data/KML5Layer/L2.kml", "#f3b03bff"), // เหลือง
    //   loadKmlAsFillLayer("/data/KML5Layer/L1.kml", "#ffee00ff"), // เขียว
    // ])

    const [FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer] = await Promise.all([
      loadKmlAsFillLayer("/data/KML5Layer/L5.kml", "#ffee00e2"), // ม่วง (อันตรายมาก)
      loadKmlAsFillLayer("/data/KML5Layer/L4new.kml", "#f3b03bff"), // แดง
      loadKmlAsFillLayer("/data/KML5Layer/L3.kml", "#f97316cc"), // ส้ม
      loadKmlAsFillLayer("/data/KML5Layer/L2.kml", "#fb8200cc"), // เหลือง
      loadKmlAsFillLayer("/data/KML5Layer/L1.kml", "#fb0000cc"), // เขียว
    ])
   
   
    
      // --------------------------------------------------
      // Grouped Layer Control (only flood boundaries)
      // ------------------------------------------------
      const baseLayers = {
        "ถนน (Google Road)": googleRoad,
        "ดาวเทียม (Satellite)": googleSat,
        "ภูมิประเทศ (Terrain)": googleTerrain,
        "แผนที่มืด (Dark Matter)": darkBase,
      }

      const groupedOverlays = {
        "ขอบเขตพื้นที่น้ำท่วม (ต.ค. 2567)": {
          
          "ลำดับที่ 1 4.30 เมตร": OneLayer,
          "ลำดับที่ 2 4.50 เมตร": TwoLayer,
          "ลำดับที่ 3 4.70 เมตร": ThreeLayer,
          "ลำดับที่ 4 5.00 เมตร": FourLayer,
          "ลำดับที่ 5 5.30 เมตร": FiveLayer,
        },
      }

      // @ts-ignore
      L.control
        // @ts-ignore
        .groupedLayers(baseLayers, groupedOverlays, {
          collapsed: true,
          position: "topright",
        })
        .addTo(map)

      // show all by default
      ;[FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer].forEach((lyr) => lyr.addTo(map))

      // ✅ fitBounds แบบ “ชัวร์” (หลัง invalidateSize)
      const fg = L.featureGroup([FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer])

      setTimeout(() => {
        map.invalidateSize(true)
        const b = fg.getBounds()
        if (b.isValid()) {
          map.fitBounds(b.pad(0.05))
        } else {
          map.setView([18.787563, 99.003968], 15)
          console.warn("Bounds invalid (unexpected). Check geometries.")
        }
      }, 250)

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

    return () => {
      
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  return <div id="map" className="w-full h-[100vh]" />
}

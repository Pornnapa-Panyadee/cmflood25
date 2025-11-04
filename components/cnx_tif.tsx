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
      const map = L.map("map", { center: [18.75, 98.99], zoom: 12 })
      mapRef.current = map

      // ---------------- Base Layers ----------------
      const googleSat = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        { maxZoom: 20, attribution: "&copy; Google Satellite" }
      )
      const googleTerrain = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
        { maxZoom: 20, attribution: "&copy; Google Terrain" }
      )
      const darkBase = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 20,
          attribution:
            "&copy; <a href='https://carto.com/attributions'>CARTO</a> | Dark Matter",
        }
      )
      googleTerrain.addTo(map)

      // ---------------- Load KML/GeoJSON ----------------
      const loadKml = async (url: string, color: string, weight = 1) => {
        const res = await fetch(url)
        const text = await res.text()
        const xml = new DOMParser().parseFromString(text, "text/xml")
        const geo = kml(xml)
        return L.geoJSON(geo, { style: { color, weight, opacity: 0.8 } })
      }

      let pingRiver: L.GeoJSON | null = null
      let roadLayer: L.GeoJSON | null = null
      let poleLayer: L.GeoJSON | null = null

      try {
        pingRiver = await loadKml("/data/KML/stream.kml", "#00bfff", 1)
        roadLayer = await loadKml("/data/KML/road.kml", "#ffffff", 1)
        pingRiver.addTo(map)
        roadLayer.addTo(map)
      } catch {}

      try {
        const poleRes = await fetch("/data/pole.geojson")
        const poleData = await poleRes.json()
        poleLayer = L.geoJSON(poleData, {
          pointToLayer: (f, latlng) =>
            L.circleMarker(latlng, {
              radius: 2,
              fillColor: "#3c3c3c",
              color: "#ffffff",
              weight: 1,
              opacity: 0.6,
              fillOpacity: 1,
            }).bindPopup(
              `<div style="font-family:'Prompt',sans-serif;line-height:1.4;">
                 📍 <b>จุดวัด:</b> ${f.properties.place_detail}<br>
                 <center><span style="color:blue;font-size:16px;font-weight:500;">
                   ระดับน้ำ: ${f.properties.water_level} ซม.
                 </span></center>
               </div>`
            ),
        }).addTo(map)
      } catch {}

      // ---------------- Load TIFF ----------------
      async function loadRaster(url: string, type: "blue" | "zone") {
        const res = await fetch(url)
        const buf = await res.arrayBuffer()
        const tiff = await fromArrayBuffer(buf)
        const img = await tiff.getImage()
        const data = (await img.readRasters())[0] as TypedArray
        const w = img.getWidth()
        const h = img.getHeight()
        const [minX, minY, maxX, maxY] = img.getBoundingBox()

        const getColor = (val: number, norm: number): [number, number, number] => {
          if (type === "blue") {
            if (norm < 0.33) {
              const t = norm / 0.33
              return [100 * (1 - t) + 20 * t, 160 * (1 - t) + 80 * t, 255]
            } else if (norm < 0.66) {
              const t = (norm - 0.33) / 0.33
              return [20 * (1 - t), 60 * (1 - t) + 30 * t, 200 * (1 - t) + 130 * t]
            } else {
              const t = (norm - 0.66) / 0.34
              return [0, 30 * (1 - t) + 20 * t, 130 * (1 - t) + 80 * t]
            }
          } else {
            if (val <= 40) return [51, 255, 55]
            if (val <= 80) return [255, 255, 51]
            if (val <= 120) return [255, 165, 0]
            if (val <= 160) return [255, 0, 0]
            return [153, 0, 204]
          }
        }

        let min = Infinity,
          max = -Infinity
        for (const v of data) {
          if (v > -1e30 && !isNaN(v)) {
            if (v < min) min = v
            if (v > max) max = v
          }
        }

        const canvas = document.createElement("canvas")
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext("2d")!
        const imgData = ctx.createImageData(w, h)

        for (let i = 0; i < data.length; i++) {
          const v = data[i]
          const idx = i * 4
          if (v < -1e30 || isNaN(v)) {
            imgData.data[idx + 3] = 0
          } else {
            const norm = (v - min) / (max - min)
            const [r, g, b] = getColor(v, norm)
            imgData.data[idx] = r
            imgData.data[idx + 1] = g
            imgData.data[idx + 2] = b
            imgData.data[idx + 3] = 200
          }
        }

        ctx.putImageData(imgData, 0, 0)
        const bounds: L.LatLngBoundsExpression = [
          [minY, minX],
          [maxY, maxX],
        ]
        return L.imageOverlay(canvas.toDataURL(), bounds, { opacity: 0.85 })
      }

      const [blueMap, zoneMap] = await Promise.all([
        loadRaster("/data/Idw_Fl2clip.tif", "blue"),
        loadRaster("/data/Idw_Fl2clip.tif", "zone"),
      ])
      if (!blueMap || !zoneMap) return

      blueMap.addTo(map)

      // ---------------- Controls ----------------
      const baseLayers = {
        "Dark Matter": darkBase,
        "Google Satellite": googleSat,
        "Google Terrain": googleTerrain,
      }

      const overlays = {
        "แผนที่ระดับน้ำท่วม": blueMap,
        "แผนที่โซนน้ำท่วม": zoneMap,
      }

      const infra: Record<string, L.Layer> = {}
      if (pingRiver) infra["เส้นทางน้ำ"] = pingRiver
      if (roadLayer) infra["เส้นทางถนน"] = roadLayer
      if (poleLayer) infra["จุดระดับน้ำท่วม"] = poleLayer

      L.control.layers(baseLayers, {}, { collapsed: true, position: "topright" }).addTo(map)
      L.control.layers(overlays, {}, { collapsed: true, position: "topright" }).addTo(map)
      L.control.layers({}, infra, { collapsed: true, position: "topright" }).addTo(map)

      // ---------------- Legend (always show both) ----------------
      const legend = (L as any).control({ position: "bottomright" })
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "info legend bg-white p-2 rounded shadow")
        div.innerHTML = `
          <b>ระดับน้ำ (ซม.)</b><br/>
          <canvas id="grad" width="120" height="10"></canvas><br/>
          <div style="display:flex;justify-content:space-between;font-size:10px;margin-top:-20px;">
            <span>0</span><span>150</span><span>300</span>
          </div>
          <b>แผนที่ระดับโซนน้ำท่วม</b>
          <div style="display:flex;flex-direction:column;gap:2px;font-size:11px;">
            <div><span style="background:#33ff33;width:20px;height:8px;display:inline-block;margin-right:4px;"></span>0–40</div>
            <div><span style="background:#ffff33;width:20px;height:8px;display:inline-block;margin-right:4px;"></span>40–80</div>
            <div><span style="background:#ffa500;width:20px;height:8px;display:inline-block;margin-right:4px;"></span>80–120</div>
            <div><span style="background:#ff0000;width:20px;height:8px;display:inline-block;margin-right:4px;"></span>120–160</div>
            <div><span style="background:#9900cc;width:20px;height:8px;display:inline-block;margin-right:4px;"></span>>160</div>
          </div>
        `
        return div
      }
      legend.addTo(map)

      // วาด Gradient
      const drawGradient = () => {
        const c = document.getElementById("grad") as HTMLCanvasElement
        if (!c) return
        const ctx2 = c.getContext("2d")!
        const grad = ctx2.createLinearGradient(0, 0, 120, 0)
        grad.addColorStop(0, "#A8D8FF")
        grad.addColorStop(0.33, "#3399FF")
        grad.addColorStop(0.66, "#0044CC")
        grad.addColorStop(1, "#001133")
        ctx2.fillStyle = grad
        ctx2.fillRect(0, 0, 120, 10)
      }
      drawGradient()
    }

    initMap()
  }, [])

  return <div id="map" className="w-full h-[80vh]" />
}

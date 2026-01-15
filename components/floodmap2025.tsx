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
      // cleanup old map (HMR / re-render safety)
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
      const googleRoad = L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        attribution: "&copy; Google Map",
      }).addTo(map)

      // ✅ Satellite + Labels (Hybrid)
      const googleHybrid = L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        attribution: "&copy; Google Hybrid",
      })

      const googleTerrain = L.tileLayer("https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        attribution: "&copy; Google Terrain",
      })

      const darkBase = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 20,
        attribution: " Dark Matter",
      })

      // --------------------------------------------------
      // ✅ Panes: lock overlay stacking order forever
      // higher zIndex = on top
      // requirement: "ลำดับน้อยสุดอยู่บน" => OneLayer top, FiveLayer bottom
      // --------------------------------------------------
      map.createPane("flood5") // ล่างสุด
      map.createPane("flood4")
      map.createPane("flood3")
      map.createPane("flood2")
      map.createPane("flood1") // บนสุด

      map.getPane("flood5")!.style.zIndex = "401"
      map.getPane("flood4")!.style.zIndex = "402"
      map.getPane("flood3")!.style.zIndex = "403"
      map.getPane("flood2")!.style.zIndex = "404"
      map.getPane("flood1")!.style.zIndex = "405"

      // --------------------------------------------------
      // ✅ Pane for rivers / streams (on top of flood)
      // --------------------------------------------------
      map.createPane("riverPane")
      map.getPane("riverPane")!.style.zIndex = "460" // 🔥 สูงกว่า flood ทุกชั้น
      map.getPane("riverPane")!.style.pointerEvents = "none"

      // --------------------------------------------------
      // ✅ Pane for point services (parking/shelter) on top
      // --------------------------------------------------
      map.createPane("poiPane")
      map.getPane("poiPane")!.style.zIndex = "520" // สูงกว่า river
      map.getPane("poiPane")!.style.pointerEvents = "auto"

      // --------------------------------------------------
      // Load KML as filled flood boundary (polygon)
      // --------------------------------------------------
      const loadKmlAsFillLayer = async (url: string, fillColor: string, paneName: string) => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`)
        const xmlText = await res.text()

        const xmlDom = new DOMParser().parseFromString(xmlText, "text/xml")
        const geojson = toGeoJSONKml(xmlDom)

        return L.geoJSON(geojson, {
          pane: paneName,
          style: {
            color: fillColor,
            weight: 0.4,
            opacity: 0.8,
            fillColor,
            fillOpacity: 0.6,
          },
        })
      }

      // --------------------------------------------------
      // Load KML as line layer (river/stream)
      // --------------------------------------------------
      const loadKmlAsLineLayer = async (url: string, color: string, weight: number) => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`)
        const xmlText = await res.text()
        const xmlDom = new DOMParser().parseFromString(xmlText, "text/xml")
        const geojson = toGeoJSONKml(xmlDom)

        return L.geoJSON(geojson, {
          pane: "riverPane",
          style: {
            color,
            weight,
            opacity: 1.0, // ✅ ทึบ 100%
            lineCap: "round",
            lineJoin: "round",
          },
        })
      }

      // --------------------------------------------------
      // Load GeoJSON as point layer (parking / shelter)
      // popup + Google Maps navigation button (new tab)
      // --------------------------------------------------
      const escapeHtml = (s: any) =>
        String(s ?? "")
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;")

      type PointStyle = {
        radius?: number
        weight?: number
        opacity?: number
        fillOpacity?: number
        color: string
        fillColor: string
      }

      // --------------------------------------------------
      const parkingIcon = L.icon({
        iconUrl: "/images/icons/parking_v3.png",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -26],
      })

      const shelterIcon = L.icon({
        iconUrl: "/images/icons/shelter_v1.png",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30],
      })

      const loadGeoJsonPointsLayer = async (url: string, layerName: string, style: PointStyle) => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`)
        const geojson = await res.json()

        const layer = L.geoJSON(geojson, {
          pane: "poiPane",
          pointToLayer: (_feature, latlng) => {
            return L.marker(latlng, {
              icon: layerName.includes("ที่จอดรถ")
                ? parkingIcon
                : shelterIcon,
            })
          },
          onEachFeature: (feature, lyr) => {
            const props: any = feature?.properties ?? {}

            const locationText = props.Location ?? props.location ?? null
            const place = props.Place ?? props.place ?? "-"
            const desc = props.Description ?? props.description ?? "-"
            const count = props.Count ?? props.count ?? null

            const ll = (lyr as any).getLatLng?.()
            const lat = ll?.lat
            const lng = ll?.lng

            // Google Maps directions: origin = current location (implicit)
            const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
            const headerHtml =
            layerName.includes("ที่จอดรถ")
              ? `<div class="popup-header parking">🚗 ที่จอดรถ</div>`
              : `<div class="popup-header shelter">🏠 ศูนย์พักพิงชั่วคราว</div>`

          const popupHtml = `
            <div class="popup-wrap">
              <div class="popup-title">${headerHtml}</div> <hr>

              <div class="popup-title">${escapeHtml(place)}</div>

              

              <div class="popup-row">
                <b>รายละเอียด:</b> ${escapeHtml(desc)}
              </div>

              ${
                count !== null && count !== undefined && String(count).trim() !== ""
                  ? `<div class="popup-row"><b>รองรับ:</b> ${escapeHtml(count)}</div>`
                  : ""
              }

              <div class="popup-actions">
                <a class="popup-btn" href="${gmapUrl}" target="_blank" rel="noopener noreferrer">
                  📍 Google Maps
                </a>
              </div>
            </div>
          `



            lyr.bindPopup(popupHtml, { maxWidth: 340 })
          },
        })

        ;(layer as any).name = layerName
        return layer
      }

      // --------------------------------------------------
      // Flood layers (✅ ชุดสีตามที่คุณเลือก)
      // --------------------------------------------------
      const [FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer] = await Promise.all([
        loadKmlAsFillLayer("/data/KML5Layer/L5.kml", "#fde007e2", "flood5"), // ลำดับที่ 5 5.30 เมตร (ล่างสุด)
        loadKmlAsFillLayer("/data/KML5Layer/L4new.kml", "#fdbb84cc", "flood4"), // ลำดับที่ 4 5.00 เมตร
        loadKmlAsFillLayer("/data/KML5Layer/L3.kml", "#e34a33cc", "flood3"), // ลำดับที่ 3 4.70 เมตร
        loadKmlAsFillLayer("/data/KML5Layer/L2.kml", "#b30000cc", "flood2"), // ลำดับที่ 2 4.50 เมตร
        loadKmlAsFillLayer("/data/KML5Layer/L1.kml", "#7f0000cc", "flood1"), // ลำดับที่ 1 4.30 เมตร (บนสุด)
      ])

      // --------------------------------------------------
      // Rivers / Streams (เพิ่มเส้นทางน้ำ)
      // --------------------------------------------------
      const pingRiver_New = await loadKmlAsLineLayer("/data/KML/river_main.kml", "#1d4ed8", 2.6)

      // --------------------------------------------------
      // ✅ Parking / Shelter (GeoJSON points)
      // --------------------------------------------------
      // ปรับ path ให้ตรงกับที่วางไฟล์ใน public/
      const parkingLayer = await loadGeoJsonPointsLayer(
        "/data/parking_flood.geojson",
        "ที่จอดรถ",
        { color: "#1d4ed8", fillColor: "#60a5fa" }
      )

      const shelterLayer = await loadGeoJsonPointsLayer(
        "/data/Shelter.geojson",
        "ศูนย์พักพิงชั่วคราว",
        { color: "#15803d", fillColor: "#86efac" }
      )

      // --------------------------------------------------
      // Grouped Layer Control
      // --------------------------------------------------
      const baseLayers = {
        "ถนน (Google Road)": googleRoad,
        "ดาวเทียม + ชื่อสถานที่ (Hybrid)": googleHybrid,
        "ภูมิประเทศ (Terrain)": googleTerrain,
        "แผนที่มืด (Dark Matter)": darkBase,
      }

      const groupedOverlays = {
        "จุดบริการ": {
          "ที่จอดรถ (Parking)": parkingLayer,
          "ศูนย์พักพิงชั่วคราว (Shelter)": shelterLayer,
        },
        "เส้นทางน้ำ": {
          "แม่น้ำ/ลำน้ำ (CNX Stream)": pingRiver_New,
        },
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

      // --------------------------------------------------
      // Show default layers
      // --------------------------------------------------
      ;[FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer].forEach((lyr) => lyr.addTo(map))
      pingRiver_New.addTo(map)

      // ✅ show points by default
      parkingLayer.addTo(map)
      shelterLayer.addTo(map)

      // ✅ fitBounds แบบ “ชัวร์” (หลัง invalidateSize)
      const fg = L.featureGroup([
        FiveLayer,
        FourLayer,
        ThreeLayer,
        TwoLayer,
        OneLayer,
        pingRiver_New,
        parkingLayer,
        shelterLayer,
      ])

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

        /* Popup styles */
        .popup-wrap{
          font-family:'Prompt', sans-serif;
          font-size:13px;
          line-height:1.35;
        }
        .popup-title{
          font-weight:700;
          font-size:14px;
          margin-bottom:6px;
        }
        .popup-row{ margin: 2px 0; }
        .popup-actions{ margin-top: 10px; }
        .popup-btn{
          display:inline-block;
          background:#c8d5faff;
          color:#fff;
          padding:6px 10px;
          border-radius:10px;
          text-decoration:none;
          font-weight:600;
        }
        .popup-btn:hover{ opacity:0.92; }

        /* Leaflet popup close button align */
        .leaflet-popup-content{
          margin: 12px 14px;
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

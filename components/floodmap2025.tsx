"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import "leaflet-groupedlayercontrol/dist/leaflet.groupedlayercontrol.min.css"
import { kml as toGeoJSONKml } from "togeojson"
import type * as LType from "leaflet"

export default function CnxTif() {
  const mapRef = useRef<LType.Map | null>(null)
  const mapElRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false

    async function initMap() {
      if (!mapElRef.current) return

      // ✅ Fix: React StrictMode/Hot reload ทำให้ container ค้าง _leaflet_id
      // ต้องเคลียร์ก่อนสร้าง map ใหม่เสมอ
      const elAny = mapElRef.current as any
      if (elAny._leaflet_id) {
        try {
          delete elAny._leaflet_id
        } catch {
          elAny._leaflet_id = undefined
        }
      }

      // cleanup old map (HMR / re-render safety)
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const L = (await import("leaflet")).default
      await import("leaflet-groupedlayercontrol")

      if (cancelled) return

      // ✅ Fix: สร้าง map จาก element ref (ไม่ใช้ string id)
      const map = L.map(mapElRef.current, { center: [18.787563, 99.003968], zoom: 15 })
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
      // Panes
      // --------------------------------------------------
      map.createPane("flood5")
      map.createPane("flood4")
      map.createPane("flood3")
      map.createPane("flood2")
      map.createPane("flood1")

      map.getPane("flood5")!.style.zIndex = "401"
      map.getPane("flood4")!.style.zIndex = "402"
      map.getPane("flood3")!.style.zIndex = "403"
      map.getPane("flood2")!.style.zIndex = "404"
      map.getPane("flood1")!.style.zIndex = "405"

      map.createPane("riverPane")
      map.getPane("riverPane")!.style.zIndex = "460"
      map.getPane("riverPane")!.style.pointerEvents = "none"

      map.createPane("poiPane")
      map.getPane("poiPane")!.style.zIndex = "520"
      map.getPane("poiPane")!.style.pointerEvents = "auto"

      // --------------------------------------------------
      // Loaders
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

      const loadKmlAsLineLayer = async (url: string, color: string, weight: number) => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`)
        const xmlText = await res.text()
        const xmlDom = new DOMParser().parseFromString(xmlText, "text/xml")
        const geojson = toGeoJSONKml(xmlDom)

        return L.geoJSON(geojson, {
          pane: "riverPane",
          style: { color, weight, opacity: 1.0, lineCap: "round", lineJoin: "round" },
        })
      }

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
      // Icons
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

      const pumpIcon = L.icon({
        iconUrl: "/images/icons/pump.png",
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -26],
      })

      const stationIcon = L.icon({
        iconUrl: "/images/icons/station.png",
        iconSize: [50, 50],
        iconAnchor: [25, 30],
        popupAnchor: [0, -28],
      })

      // --------------------------------------------------
      // ✅ P.1 Station (ใช้ marker + featureGroup)
      // --------------------------------------------------
      const p1LatLng: [number, number] = [18.787579, 99.004484]
      const p1PopupHtml = `
        <div class="popup-wrap">
          <div class="popup-title">📡 สถานีวัดน้ำ P.1 สะพานนวรัฐ</div>
          <div class="popup-row"><b>พิกัด:</b> 18.787579, 99.004484</div>
          <div class="popup-actions">
            <a class="popup-btn" href="https://www.google.com/maps?q=18.787579,99.004484" target="_blank" rel="noopener noreferrer">
              📍 Google Maps
            </a>
          </div>
        </div>
      `
      const p1StationMarker = L.marker(p1LatLng, { pane: "poiPane", icon: stationIcon }).bindPopup(p1PopupHtml, {
        maxWidth: 340,
      })
      const p1StationLayer = L.featureGroup([p1StationMarker])

      // --------------------------------------------------
      // GeoJSON points
      // --------------------------------------------------
      const loadGeoJsonPointsLayer = async (url: string, layerName: string, _style: PointStyle) => {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`)
        const geojson = await res.json()

        const layer = L.geoJSON(geojson, {
          pane: "poiPane",
          pointToLayer: (_feature, latlng) =>
            L.marker(latlng, { icon: layerName.includes("ที่จอดรถ") ? parkingIcon : shelterIcon }),
          onEachFeature: (_feature, lyr) => {
            const props: any = (_feature as any)?.properties ?? {}
            const place = props.Place ?? props.place ?? "-"
            const desc = props.Description ?? props.description ?? "-"
            const count = props.Count ?? props.count ?? null

            const ll = (lyr as any).getLatLng?.()
            const lat = ll?.lat
            const lng = ll?.lng
            const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`

            const headerHtml = layerName.includes("ที่จอดรถ")
              ? `<div class="popup-header parking">🚗 ที่จอดรถ</div>`
              : `<div class="popup-header shelter">🏠 ศูนย์พักพิงชั่วคราว</div>`

            const popupHtml = `
              <div class="popup-wrap">
                <div class="popup-title">${headerHtml}</div> <hr>
                <div class="popup-title">${escapeHtml(place)}</div>
                <div class="popup-row"><b>รายละเอียด:</b> ${escapeHtml(desc)}</div>
                ${
                  count !== null && count !== undefined && String(count).trim() !== ""
                    ? `<div class="popup-row"><b>รองรับ:</b> ${escapeHtml(count)}</div>`
                    : ""
                }
                <div class="popup-actions">
                  <a class="popup-btn" href="${gmapUrl}" target="_blank" rel="noopener noreferrer">📍 Google Maps</a>
                </div>
              </div>
            `
            ;(lyr as any).bindPopup(popupHtml, { maxWidth: 340 })
          },
        })

        return layer
      }

      const loadPumpPointsLayer = async (url: string) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`)
      const geojson = await res.json()

      const layer = L.geoJSON(geojson, {
        pane: "poiPane",
        pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: pumpIcon }),
        onEachFeature: (feature, lyr) => {
          const props: any = (feature as any)?.properties ?? {}

          // รองรับชื่อคอลัมน์หลายแบบ (เผื่อ excel แปลก)
          const agency = props.agency ?? props.Agency ?? props["หน่วยงาน"] ?? "-"
          const pid = props.id ?? props.ID ?? props["รหัส"] ?? props["จุด"] ?? "-"
          const location = props.location ?? props.Location ?? props["สถานที่ตั้ง"] ?? "-"
          const area = props.area ?? props.Area ?? props["พื้นที่"] ?? "-"
          const machine = props.machine_count ?? props["จำนวนเครื่อง"] ?? props.count ?? props.Count ?? null
          const capacity = props.capacity ?? props["อัตราการสูบ"] ?? null

          const ll = (lyr as any).getLatLng?.()
          const lat = ll?.lat
          const lng = ll?.lng
          const gmapUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`

          const headerHtml = `<div class="popup-header pump">🚰 จุดเครื่องสูบน้ำ</div>`

          const popupHtml = `
            <div class="popup-wrap">
              ${headerHtml}
              <div class="popup-title">${escapeHtml(String(pid))}</div>

              <div class="popup-row"><b>หน่วยงาน:</b> ${escapeHtml(agency)}</div>
              <div class="popup-row"><b>สถานที่:</b> ${escapeHtml(location)}</div>
              ${area && area !== "-" ? `<div class="popup-row"><b>พื้นที่:</b> ${escapeHtml(area)}</div>` : ""}

              ${machine ? `<div class="popup-row"><b>จำนวน:</b> ${escapeHtml(machine)}</div>` : ""}
              ${capacity ? `<div class="popup-row"><b>อัตราการสูบ:</b> ${escapeHtml(capacity)}</div>` : ""}

              <div class="popup-actions">
                <a class="popup-btn" href="${gmapUrl}" target="_blank" rel="noopener noreferrer">
                  📍 Google Maps
                </a>
              </div>
            </div>
          `
          ;(lyr as any).bindPopup(popupHtml, { maxWidth: 360 })
        },
      })

      return layer
    }


      // --------------------------------------------------
      // Flood layers
      // --------------------------------------------------
      const [FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer] = await Promise.all([
        loadKmlAsFillLayer("/data/KML5Layer/L5.kml", "#fde007e2", "flood5"),
        loadKmlAsFillLayer("/data/KML5Layer/L4new.kml", "#fdbb84cc", "flood4"),
        loadKmlAsFillLayer("/data/KML5Layer/L3new.kml", "#e34a33cc", "flood3"),
        loadKmlAsFillLayer("/data/KML5Layer/L2.kml", "#b30000cc", "flood2"),
        loadKmlAsFillLayer("/data/KML5Layer/L1.kml", "#7f0000cc", "flood1"),
      ])

      const pingRiver_New = await loadKmlAsLineLayer("/data/KML/river_main.kml", "#1d4ed8", 2.6)

      const parkingLayer = await loadGeoJsonPointsLayer("/data/parking_flood.geojson", "ที่จอดรถ", {
        color: "#1d4ed8",
        fillColor: "#60a5fa",
      })


      const shelterLayer = await loadGeoJsonPointsLayer("/data/Shelter.geojson", "ศูนย์พักพิงชั่วคราว", {
        color: "#15803d",
        fillColor: "#86efac",
      })

      const pumpLayer = await loadPumpPointsLayer("/data/pumping_points.geojson")

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
          "จุดเครื่องสูบน้ำ (Pump)": pumpLayer,
          "P.1 สะพานนวรัฐ": p1StationLayer,
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
        .groupedLayers(baseLayers, groupedOverlays, { collapsed: true, position: "topright" })
        .addTo(map)

      // --------------------------------------------------
      // Show default layers (หลัง control)
      // --------------------------------------------------
      ;[FiveLayer, FourLayer, ThreeLayer, TwoLayer, OneLayer].forEach((lyr) => lyr.addTo(map))
      pingRiver_New.addTo(map)
      p1StationLayer.addTo(map) // ✅ default show

      // --------------------------------------------------
      // ✅ Safe fitBounds (กัน layer.getLatLng not a function)
      // --------------------------------------------------
      const bounds = L.latLngBounds([])

      const addLayerToBounds = (lyr: any) => {
        if (!lyr) return
        if (typeof lyr.getBounds === "function") {
          const b = lyr.getBounds()
          if (b && b.isValid && b.isValid()) bounds.extend(b)
          return
        }
        if (typeof lyr.getLatLng === "function") {
          const p = lyr.getLatLng()
          if (p) bounds.extend(p)
          return
        }
        if (typeof lyr.eachLayer === "function") {
          lyr.eachLayer((child: any) => addLayerToBounds(child))
        }
      }

      ;[
        FiveLayer,
        FourLayer,
        ThreeLayer,
        TwoLayer,
        OneLayer,
        pingRiver_New,
        parkingLayer,
        shelterLayer,
        pumpLayer,
        p1StationLayer,
      ].forEach(addLayerToBounds)

      setTimeout(() => {
        map.invalidateSize(true)
        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.05))
        } else {
          map.setView([18.787563, 99.003968], 15)
        }
      }, 250)

      // --------------------------------------------------
      // Style (รวม fix marker หายจาก global css)
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

        /* ✅ กัน global css ทำให้ marker img หาย */
        .leaflet-marker-icon,
        .leaflet-marker-shadow {
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          max-width: none !important;
        }

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
        .leaflet-popup-content{
          margin: 12px 14px;
        }
      `
      document.head.appendChild(styleEl)
    }

    initMap()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      // ✅ เคลียร์ _leaflet_id ตอน unmount ด้วย (กัน StrictMode)
      if (mapElRef.current) {
        const elAny = mapElRef.current as any
        if (elAny._leaflet_id) {
          try {
            delete elAny._leaflet_id
          } catch {
            elAny._leaflet_id = undefined
          }
        }
      }
    }
  }, [])

  return <div ref={mapElRef} className="w-full h-[100vh]" />
}

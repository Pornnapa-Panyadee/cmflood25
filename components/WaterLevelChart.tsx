"use client"

import { useMemo, useState } from "react"
import {
  Area,
  Brush,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Legend,
  XAxis,
  YAxis,
} from "recharts"
import { WaterLevelData } from "@/lib/csvParser"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut } from "lucide-react"

interface WaterLevelChartProps {
  data: WaterLevelData[] // p1_68 (actual)
  b9Data?: WaterLevelData[] // P1_B9
  c9Data?: WaterLevelData[] // P1_C9
  c12Data?: WaterLevelData[] // P1_C12
  b12Data?: WaterLevelData[] // P1_B12
  realData?: WaterLevelData[] // P1_real
  prediction?: { label: string; value: number; hours: number } | null
}

type ChartRow = {
  index: number
  label: string
  date: string
  hour: number
  timestamp: number

  level: number | null // actual
  b9Level: number | null
  c9Level: number | null
  c12Level: number | null
  b12Level: number | null
  realLevel: number | null

  predictionLevel: number | null // on-click prediction (single point + connect)
  isPrediction: boolean // for on-click prediction point
  isFuture: boolean // for B9/C9 future-only points
}

const makeKey = (date: string, hour: number) => `${date}|${hour}`

export function WaterLevelChart({
  data,
  b9Data = [],
  c9Data = [],
  c12Data = [],
  b12Data = [],
  realData = [],  
  prediction,
}: WaterLevelChartProps) {
  const [brushRange, setBrushRange] = useState<{
    startIndex?: number
    endIndex?: number
  }>({})

  const chartData: ChartRow[] = useMemo(() => {
    // Build lookup maps for B9 and C9 by date|hour
    const b9Map = new Map<string, WaterLevelData>()
    const c9Map = new Map<string, WaterLevelData>()
    const c12Map = new Map<string, WaterLevelData>()
    const b12Map = new Map<string, WaterLevelData>()
    const realMap = new Map<string, WaterLevelData>()

    for (const r of b9Data) b9Map.set(makeKey(r.date, r.hour), r)
    for (const r of c9Data) c9Map.set(makeKey(r.date, r.hour), r)
    for (const r of c12Data) c12Map.set(makeKey(r.date, r.hour), r)
    for (const r of b12Data) b12Map.set(makeKey(r.date, r.hour), r)
    for (const r of realData) realMap.set(makeKey(r.date, r.hour), r)

    // 1) Base: actual data timeline
    const baseRows: Omit<ChartRow, "index">[] = data.map((item) => {
      const k = makeKey(item.date, item.hour)
      const b9 = b9Map.get(k)?.level ?? null
      const c9 = c9Map.get(k)?.level ?? null
      const c12 = c12Map.get(k)?.level ?? null
      const b12 = b12Map.get(k)?.level ?? null
      const real = realMap.get(k)?.level ?? null

      return {
        label: `${item.date} ${item.hour}:00`,
        date: item.date,
        hour: item.hour,
        timestamp: new Date(item.timestamp).getTime(),

        level: item.level ?? null,
        b9Level: b9,
        c9Level: c9,
        c12Level: c12,
        b12Level: b12,
        realLevel: real,

        predictionLevel: null,
        isPrediction: false,
        isFuture: false,
      }
    })

    const seen = new Set(baseRows.map((r) => makeKey(r.date, r.hour)))

    // 2) Append extra points that exist only in B9/C9 (future-only)
    const extraCandidates = [...b9Data, ...c9Data, ...c12Data, ...b12Data, ...realData]
      .map((r) => ({
        date: r.date,
        hour: r.hour,
        timestamp: new Date(r.timestamp).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp)

    for (const t of extraCandidates) {
      const k = makeKey(t.date, t.hour)
      if (seen.has(k)) continue

      const b9 = b9Map.get(k)?.level ?? null
      const c9 = c9Map.get(k)?.level ?? null
      const c12 = c12Map.get(k)?.level ?? null
      const b12 = b12Map.get(k)?.level ?? null
      const real = realMap.get(k)?.level ?? null


      baseRows.push({
        label: `${t.date} ${t.hour}:00`,
        date: t.date,
        hour: t.hour,
        timestamp: t.timestamp,

        level: null,
        b9Level: b9,
        c9Level: c9,
        c12Level: c12,
        b12Level: b12,
        realLevel: real,

        predictionLevel: null,
        isPrediction: false,
        isFuture: true,
      })

      seen.add(k)
    }

    // 3) Sort and re-index
    baseRows.sort((a, b) => a.timestamp - b.timestamp)
    const rows: ChartRow[] = baseRows.map((r, i) => ({ ...r, index: i }))

    // 4) Keep existing "prediction" feature (single point after last actual)
    if (prediction && data.length > 0) {
      const lastActual = data[data.length - 1]
      const predictionDate = new Date(lastActual.timestamp)
      predictionDate.setHours(predictionDate.getHours() + prediction.hours)

      // connect from last displayed point to prediction:
      // find row of last actual timepoint by key
      const lastKey = makeKey(lastActual.date, lastActual.hour)
      const lastRowIndex = rows.findIndex((r) => makeKey(r.date, r.hour) === lastKey)
      if (lastRowIndex >= 0) {
        // set predictionLevel at last actual point to draw dashed connection
        rows[lastRowIndex].predictionLevel = rows[lastRowIndex].level
      }

      const predDay = predictionDate.getDate()
      const predMonth = predictionDate.getMonth() + 1
      const predYear = predictionDate.getFullYear()
      const predHour = predictionDate.getHours()

      rows.push({
        index: rows.length,
        level: null,
        b9Level: null,
        c9Level: null,
        c12Level: null,
        b12Level: null,
        realLevel: null,
        predictionLevel: prediction.value,
        label: `${predDay}/${predMonth}/${predYear} ${predHour}:00`,
        date: `${predDay}/${predMonth}/${predYear}`,
        hour: predHour,
        timestamp: predictionDate.getTime(),
        isPrediction: true,
        isFuture: true,
      })
    }

    // final sort again (in case prediction timestamp falls inside)
    rows.sort((a, b) => a.timestamp - b.timestamp)
    return rows.map((r, i) => ({ ...r, index: i }))
  }, [data, b9Data, c9Data, c12Data, b12Data, realData, prediction])

  const handleZoomIn = () => {
    const dataLength = chartData.length
    const currentStart = brushRange.startIndex ?? 0
    const currentEnd = brushRange.endIndex ?? dataLength - 1
    const range = currentEnd - currentStart
    const newRange = Math.max(Math.floor(range * 0.5), 24) // min 24 hours
    const center = Math.floor((currentStart + currentEnd) / 2)
    const newStart = Math.max(0, center - Math.floor(newRange / 2))
    const newEnd = Math.min(dataLength - 1, newStart + newRange)
    setBrushRange({ startIndex: newStart, endIndex: newEnd })
  }

  const handleZoomOut = () => {
    const dataLength = chartData.length
    const currentStart = brushRange.startIndex ?? 0
    const currentEnd = brushRange.endIndex ?? dataLength - 1
    const range = currentEnd - currentStart
    const newRange = Math.min(range * 2, dataLength - 1)
    const center = Math.floor((currentStart + currentEnd) / 2)
    const newStart = Math.max(0, center - Math.floor(newRange / 2))
    const newEnd = Math.min(dataLength - 1, newStart + newRange)
    setBrushRange({ startIndex: newStart, endIndex: newEnd })
  }

  return (
    <div className="w-full space-y-3">
      {/* Zoom Controls */}
      <div className="flex items-center gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={handleZoomIn} className="gap-1.5">
          <ZoomIn className="w-4 h-4" />
          ขยาย
        </Button>
        <Button variant="outline" size="sm" onClick={handleZoomOut} className="gap-1.5">
          <ZoomOut className="w-4 h-4" />
          ย่อ
        </Button>
      </div>

      {/* Chart */}
      <div className="h-[450px] chart-container bg-card p-4 rounded-xl border border-border">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 75%, 50%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(200, 75%, 50%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--chart-grid))" vertical={false} />

            <XAxis
              dataKey="index"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickFormatter={(i) => {
                const item = chartData[i]
                if (!item) return ""
                if (i % 24 === 0 || item.isPrediction || item.isFuture) return item.date
                return ""
              }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />

            <YAxis
              domain={[0, "auto"]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              label={{
                value: "ระดับน้ำ (ม.)",
                angle: -90,
                position: "insideLeft",
                fill: "hsl(var(--muted-foreground))",
                fontSize: 12,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
              formatter={(value: number, name: string) => {
                if (value === null || value === undefined) return ["-", ""]
                const label =
                  name === "level"
                    ? "ระดับน้ำจริง"
                    : name === "b9Level"
                      ? "พยากรณ์ (B9)"
                      : name === "c9Level"
                        ? "พยากรณ์ (C9)"
                        : name === "c12Level"
                          ? "พยากรณ์ (C12)"
                          : name === "b12Level"
                            ? "พยากรณ์ (B12)"
                            : name === "realLevel"
                              ? "ระดับน้ำจริง (Real)"
                        : "ค่าพยากรณ์ (กดปุ่ม)"
                return [`${Number(value).toFixed(2)} ม.`, label]
              }}
              labelFormatter={(i) => {
                const item = chartData[i]
                if (!item) return ""
                const prefix = item.isPrediction ? "พยากรณ์: " : item.isFuture ? "อนาคต: " : ""
                return `${prefix}${item.date} เวลา ${item.hour}:00 น.`
              }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                if (value === "level") return "ระดับน้ำจริง"
                if (value === "b9Level") return "พยากรณ์ (B9)"
                if (value === "c9Level") return "พยากรณ์ (C9)"
                if (value === "c12Level") return "พยากรณ์ (C12)"
                if (value === "b12Level") return "พยากรณ์ (B12)"
                if (value === "realLevel") return "ระดับน้ำจริง (Real)"
                if (value === "predictionLevel") return "ค่าพยากรณ์ (กดปุ่ม)"
                return value
              }}
            />

            {/* Actual water level */}
            <Area
              type="monotone"
              dataKey="level"
              stroke="#1E90FF"
              strokeWidth={2}
              fill="url(#waterGradient)"
              animationDuration={900}
              connectNulls={false}
            />

            {/* B9 prediction line */}
            <Line
              type="monotone"
              dataKey="b9Level"
              stroke="hsl(var(--chart-prediction))"
              strokeWidth={3}
              strokeDasharray="8 4"
              connectNulls
              dot={false}
              animationDuration={500}
            />

            {/* C9 prediction line */}
            <Line
              type="monotone"
              dataKey="c9Level"
              stroke="hsl(var(--chart-c9))"   // ← สีใหม่
              strokeWidth={3}
              strokeDasharray="8 4"          
              connectNulls
              dot={false}
              animationDuration={500}
            />
            {/* C12 prediction line */}
            <Line
              type="monotone"
              dataKey="c12Level"
              stroke="hsl(var(--chart-c12))"  
              strokeWidth={3}
              strokeDasharray="8 4"        
              connectNulls
              dot={false}
              animationDuration={500}
            />
            {/* B12 prediction line */}
            <Line
              type="monotone"
              dataKey="b12Level"
              stroke="hsl(var(--chart-b12))"  
              strokeWidth={3}
              strokeDasharray="8 4"          
              connectNulls
              dot={false}
              animationDuration={500}
            />  

            {/* Real water level */}
            <Line
              type="monotone"
              dataKey="realLevel"
              stroke="hsl(var(--chart-water))"
              strokeWidth={2}
              strokeDasharray="4 2"
              connectNulls
              dot={false}
              animationDuration={500}
            />  

            {/* Existing button-generated prediction line (single-point connect) */}
            <Line
              type="monotone"
              dataKey="predictionLevel"
              stroke="hsl(var(--chart-prediction))"
              strokeWidth={3}
              strokeDasharray="8 4"
              connectNulls
              animationDuration={500}
              dot={(props: any) => {
                const { cx, cy, payload } = props
                if (payload.isPrediction && cy) {
                  return (
                    <g>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="hsl(var(--chart-prediction))"
                        stroke="hsl(var(--background))"
                        strokeWidth={3}
                      />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="none"
                        stroke="hsl(var(--chart-prediction))"
                        strokeWidth={2}
                        opacity={0.5}
                      />
                    </g>
                  )
                }
                return <></>
              }}
            />

            {/* Brush */}
            <Brush
              dataKey="index"
              height={35}
              stroke="#1E90FF"
              fill="rgba(30, 144, 255, 0.15)"
              travellerWidth={10}
              startIndex={brushRange.startIndex}
              endIndex={brushRange.endIndex}
              onChange={(range) => {
                if (range) {
                  setBrushRange({
                    startIndex: range.startIndex,
                    endIndex: range.endIndex,
                  })
                }
              }}
              tickFormatter={(i) => chartData[i]?.date ?? ""}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Info */}
      {/* <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-chart-water rounded" />
          <span>ระดับน้ำจริง</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 rounded bg-chart-prediction" style={{ borderStyle: "dashed" }} />
          <span>พยากรณ์ (B9)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 rounded bg-chart-warning" style={{ borderStyle: "dashed" }} />
          <span>พยากรณ์ (C9)</span>
        </div>
        {prediction && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 rounded bg-chart-prediction" style={{ borderStyle: "dashed" }} />
            <span>ค่าพยากรณ์ (กดปุ่ม)</span>
          </div>
        )}
      </div> */}
    </div>
  )
}

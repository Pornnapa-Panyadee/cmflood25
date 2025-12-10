"use client"

import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  Line,
  ComposedChart,
  Scatter,
  Legend,
} from 'recharts';
import { WaterLevelData } from '@/lib/csvParser';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface WaterLevelChartProps {
  data: WaterLevelData[];
  prediction?: { label: string; value: number; hours: number } | null;
}

export function WaterLevelChart({ data, prediction }: WaterLevelChartProps) {
  const [brushRange, setBrushRange] = useState<{ startIndex?: number; endIndex?: number }>({});
  

  const chartData = useMemo(() => {
    const baseData = data.map((item, index) => ({
      index,
      level: item.level,
      predictionLevel: null as number | null,
      label: `${item.date} ${item.hour}:00`,
      date: item.date,
      hour: item.hour,
      isPrediction: false,
    }));

    // Add prediction point if exists
    if (prediction && data.length > 0) {
      const lastItem = data[data.length - 1];
      const predictionDate = new Date(lastItem.timestamp);
      predictionDate.setHours(predictionDate.getHours() + prediction.hours);
      
      // Update last point to have prediction connection
      if (baseData.length > 0) {
        baseData[baseData.length - 1].predictionLevel = baseData[baseData.length - 1].level;
      }

      const predDay = predictionDate.getDate();
      const predMonth = predictionDate.getMonth() + 1;
      const predYear = predictionDate.getFullYear();
      const predHour = predictionDate.getHours();

      baseData.push({
        index: data.length,
        level: null as any,
        predictionLevel: prediction.value,
        label: `${predDay}/${predMonth}/${predYear} ${predHour}:00`,
        date: `${predDay}/${predMonth}/${predYear}`,
        hour: predHour,
        isPrediction: true,
      });
    }

    return baseData;
  }, [data, prediction]);

  const handleZoomIn = () => {
    const dataLength = chartData.length;
    const currentStart = brushRange.startIndex ?? 0;
    const currentEnd = brushRange.endIndex ?? dataLength - 1;
    const range = currentEnd - currentStart;
    const newRange = Math.max(Math.floor(range * 0.5), 24); // Min 24 hours
    const center = Math.floor((currentStart + currentEnd) / 2);
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(dataLength - 1, newStart + newRange);
    setBrushRange({ startIndex: newStart, endIndex: newEnd });
  };

  const handleZoomOut = () => {
    const dataLength = chartData.length;
    const currentStart = brushRange.startIndex ?? 0;
    const currentEnd = brushRange.endIndex ?? dataLength - 1;
    const range = currentEnd - currentStart;
    const newRange = Math.min(range * 2, dataLength - 1);
    const center = Math.floor((currentStart + currentEnd) / 2);
    const newStart = Math.max(0, center - Math.floor(newRange / 2));
    const newEnd = Math.min(dataLength - 1, newStart + newRange);
    setBrushRange({ startIndex: newStart, endIndex: newEnd });
  };

  const handleReset = () => {
    setBrushRange({});
  };

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
        {/* <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
          <Maximize2 className="w-4 h-4" />
          รีเซ็ต
        </Button> */}
      </div>

      {/* Chart */}
      <div className="h-[450px] chart-container bg-card p-4 rounded-xl border border-border">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 75%, 50%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(200, 75%, 50%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(30, 90%, 55%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(30, 90%, 55%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--chart-grid))"
              vertical={false}
            />
            <XAxis
              dataKey="index"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              tickFormatter={(index) => {
                const item = chartData[index];
                if (!item) return '';
                if (index % 24 === 0 || item.isPrediction) {
                  return item.date;
                }
                return '';
              }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={{ stroke: 'hsl(var(--border))' }}
              label={{
                value: 'ระดับน้ำ (ม.)',
                angle: -90,
                position: 'insideLeft',
                fill: 'hsl(var(--muted-foreground))',
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              formatter={(value: number, name: string) => {
                if (value === null) return ['-', ''];
                const label = name === 'level' ? 'ระดับน้ำ' : 'ค่าพยากรณ์';
                return [`${value.toFixed(2)} ม.`, label];
              }}
              labelFormatter={(index) => {
                const item = chartData[index];
                if (!item) return '';
                const prefix = item.isPrediction ? 'พยากรณ์: ' : '';
                return `${prefix}${item.date} เวลา ${item.hour}:00 น.`;
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                if (value === 'level') return 'ระดับน้ำจริง';
                if (value === 'predictionLevel') return 'ค่าพยากรณ์';
                return value;
              }}
            />
            
            {/* Actual water level */}
            <Area
              type="monotone"
              dataKey="level"
              stroke="#1E90FF"
              strokeWidth={2}
              fill="url(#waterGradient)"
              animationDuration={1000}
              connectNulls={false}
            />
            
            {/* Prediction line connecting to last data point */}
            <Line
              type="monotone"
              dataKey="predictionLevel"
              stroke="hsl(var(--chart-prediction))"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
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
                  );
                }
                return <></>;
              }}
              connectNulls={true}
              animationDuration={500}
            />

            {/* Brush for zoom */}
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
                  });
                }
              }}
              tickFormatter={(index) => {
                const item = chartData[index];
                return item ? item.date : '';
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Prediction Info */}
      {prediction && (
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-chart-water rounded" />
            <span>ระดับน้ำจริง</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-chart-prediction rounded" style={{ borderStyle: 'dashed' }} />
            <span>ค่าพยากรณ์ ({prediction.label})</span>
          </div>
        </div>
      )}
    </div>
  );
}

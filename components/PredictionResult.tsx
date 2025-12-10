import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Droplets } from 'lucide-react';

interface PredictionResultProps {
  label: string;
  value: number;
  modelName: string;
}

export function PredictionResult({ label, value, modelName }: PredictionResultProps) {
  return (
    <Card className="bg-blue-500 text-white overflow-hidden animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-90">ผลการพยากรณ์ ({modelName})</p>
            <p className="text-3xl font-bold tracking-tight font-mono">
              {value.toFixed(3)} <span className="text-lg font-normal">ม.</span>
            </p>
            <p className="text-sm opacity-80 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              {label}
            </p>
          </div>
          <div className="p-3 bg-primary-foreground/10 rounded-full animate-water-wave">
            <Droplets className="w-8 h-8" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

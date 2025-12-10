import { Button } from '@/components/ui/button';
import { ModelType } from '@/lib/neuralNetwork';
import { Waves, Clock } from 'lucide-react';

interface ModelSelectorProps {
  selectedModel: ModelType | null;
  onSelectModel: (model: ModelType) => void;
  isLoading: boolean;
}

const modelInfo: Record<ModelType, { label: string; hours: number; variant: string }> = {
  B9hr: { label: 'Model B', hours: 9, variant: 'B' },
  B12hr: { label: 'Model B', hours: 12, variant: 'B' },
  C9hr: { label: 'Model C', hours: 9, variant: 'C' },
  C12hr: { label: 'Model C', hours: 12, variant: 'C' },
};

export function ModelSelector({ selectedModel, onSelectModel, isLoading }: ModelSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Waves className="w-4 h-4" />
        <span>เลือก Model พยากรณ์</span>
      </div>

      {/* เปลี่ยนเป็น flex-col */}
      <div className="flex flex-col gap-3">
        {(Object.keys(modelInfo) as ModelType[]).map((model) => {
          const info = modelInfo[model];
          const isSelected = selectedModel === model;
          
          return (
            <Button
              key={model}
              onClick={() => onSelectModel(model)}
              disabled={isLoading}
              variant={isSelected ? "default" : "outline"}
              className={`w-full min-h-[72px] py-4 px-4 flex flex-col items-center gap-2 transition-all ${
                isSelected 
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg"
                  : "hover:border-primary/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    info.variant === "B"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                  }`}
                >
                  {info.variant}
                </span>
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{info.hours} hr</span>
              </div>

              <span className="text-xs text-muted-foreground">
                พยากรณ์ P1+{info.hours}hr
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}


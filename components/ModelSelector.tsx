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

  SpB9hr: { label: 'Model SpB', hours: 9, variant: 'SpB' },
  SpB12hr: { label: 'Model SpB', hours: 12, variant: 'SpB' },

  SpC9hr: { label: 'Model SpC', hours: 9, variant: 'SpC' },
  SpC12hr: { label: 'Model SpC', hours: 12, variant: 'SpC' },
};


export function ModelSelector({ selectedModel, onSelectModel, isLoading }: ModelSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Waves className="w-4 h-4" />
        <span>เลือก Model พยากรณ์</span>
      </div>

      {/* 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(modelInfo) as ModelType[]).map((model) => {
          const info = modelInfo[model];
          const isSelected = selectedModel === model;

          const badgeStyle =
            info.variant === 'B'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
              : info.variant === 'C'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
              : info.variant === 'SpB'
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300';

          return (
            <Button
              key={model}
              onClick={() => onSelectModel(model)}
              disabled={isLoading}
              variant={isSelected ? 'default' : 'outline'}
              className={`w-full min-h-[80px] py-4 px-3 flex flex-col items-center gap-2 transition-all ${
                isSelected
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg'
                  : 'hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${badgeStyle}`}>
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



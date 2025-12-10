import { Droplets } from 'lucide-react';

export function Header() {
  return (
    <header className="header-gradient border-b border-border/50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl water-gradient">
            <Droplets className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              ระบบพยากรณ์ระดับน้ำ P1
            </h1>
            <p className="text-sm text-muted-foreground">
              Water Level Forecasting System
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

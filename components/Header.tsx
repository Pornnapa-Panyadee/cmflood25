import { Droplets } from "lucide-react"

type HeaderProps = {
  showLogout?: boolean
}

export function Header({ showLogout = false }: HeaderProps) {
  return (
    <header className="header-gradient border-b border-border/50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
          {showLogout ? (
            <form action="/api/floodforecast/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                ออกจากระบบ
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </header>
  )
}

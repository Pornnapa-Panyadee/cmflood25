import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Droplets, MapPin, TrendingUp, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h3 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-2xl text-balance">
            ระบบเตือนภัยน้ำท่วมเขตเมือง จังหวัดเชียงใหม่
          </h3>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
            CMFlood : Urban Flood Warning Systems in Chiang Mai
          </p>
        </div>

       

        {/* Quick Stats */}
        <div className="mb-3 grid gap-10">
          <Card>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <Image
                  src="/images/flood/city.jpg"
                  alt="City flood map"
                  width={1000}
                  height={600}
                  className="rounded-xl object-cover shadow-md w-full h-auto"
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Feature Cards */}
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Image
                  src="/images/banner/hazardmap.png"
                  alt="City flood map"
                  width={1000}
                  height={600}
                />
              <MapPin className="h-16 w-16 text-primary" />
            </div>
            <CardContent>
              <Link href="/risk-map">
                <Button className="w-full">ดูรายละเอียด</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Image
                  src="/images/banner/floodmark.png"
                  alt="City flood map"
                  width={1000}
                  height={600}
                />
              <MapPin className="h-16 w-16 text-primary" />
            </div>
            <CardContent>
              <Link href="/risk-map">
                <Button className="w-full">ดูรายละเอียด</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Image
                  src="/images/banner/pole.png"
                  alt="City flood map"
                  width={1000}
                  height={600}
                />
              <MapPin className="h-16 w-16 text-primary" />
            </div>
            <CardContent>
              <Link href="/risk-map">
                <Button className="w-full">ดูรายละเอียด</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Image
                  src="/images/banner/hazardmap.png"
                  alt="City flood map"
                  width={1000}
                  height={600}
                />
              <MapPin className="h-16 w-16 text-primary" />
            </div>
            <CardContent>
              <Link href="/risk-map">
                <Button className="w-full">ดูรายละเอียด</Button>
              </Link>
            </CardContent>
          </Card>


        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-foreground">เกี่ยวกับระบบ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              ระบบเตือนภัยน้ำท่วมเขตเมืองถูกพัฒนาขึ้นเพื่อช่วยให้ประชาชนสามารถติดตามสถานการณ์น้ำท่วมได้แบบเรียลไทม์
              พร้อมทั้งรับการแจ้งเตือนล่วงหน้าเมื่อมีความเสี่ยงสูง
            </p>
            <p>
              ระบบประกอบด้วยเครือข่ายเซ็นเซอร์วัดระดับน้ำที่กระจายอยู่ทั่วเขตเมือง ซึ่งส่งข้อมูลมายังศูนย์ควบคุมเพื่อวิเคราะห์และประมวลผลแบบอัตโนมัติ
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

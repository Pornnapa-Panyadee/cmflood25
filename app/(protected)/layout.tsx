import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}

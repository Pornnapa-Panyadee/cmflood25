import type { Metadata } from 'next'
import { Mitr, Prompt } from "next/font/google"
import { Footer } from "@/components/footer"
import './globals.css'
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: 'CM Flood'
}

const mitr = Mitr({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-mitr",
})

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className={`${prompt.variable} ${mitr.variable} font-sans antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}

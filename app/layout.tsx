import type { Metadata } from "next"
import { Mitr, Prompt } from "next/font/google"
import "./globals.css"
import dynamic from "next/dynamic"



export const metadata: Metadata = {
  title: "CM Flood",
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={`${prompt.variable} ${mitr.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

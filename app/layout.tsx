import type { Metadata } from "next"
import { Oswald, Barlow_Condensed } from "next/font/google"
import "./globals.css"

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Super Bowl LX Prop Picks",
  description: "Make your Super Bowl LX prop picks — Seahawks vs Patriots",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${barlowCondensed.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}

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

import { Navbar } from "@/components/navbar"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light')}catch(e){}})()` }} />
      </head>
      <body
        className={`${oswald.variable} ${barlowCondensed.variable} antialiased`}
      >
        <Navbar />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}

import type React from "react"
import "@/app/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AkiPawPaw - Nollywood's Finest Meme Collection",
  description: "Browse and share the best Aki & Pawpaw memes from Nollywood",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

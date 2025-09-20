import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { AnnouncementBanner } from "@/components/announcement-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Clubs Hub - College Events & Opportunities",
  description: "Stay Updated. Get Involved. Elevate Your College Experience.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <div className="relative flex min-h-screen flex-col">
                <AnnouncementBanner />
                <Navbar />
                {children}
              </div>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import { MobileNav } from "@/components/mobile-nav"
import { cn } from "@/lib/utils"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { LanguageInitializer } from "@/components/language-initializer"
import { LanguageNotification } from "@/components/language-notification"
import { RTAInformation } from "@/components/rta-information"
import { ScrollNavigationButtons } from "@/components/scroll-navigation-buttons"
import { ReactNode } from "react"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Sorry Mom Forum",
  description: "A community forum for content sharing and discussions",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)} suppressHydrationWarning>
        <LanguageProvider>
          <LanguageInitializer />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between py-4">
                  <MainNav />
                  <div className="hidden md:flex items-center gap-4">
                    <UserAccountNav />
                  </div>
                  <MobileNav />
                </div>
              </header>
              <main className="flex-1">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
              <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SiteFooter />
              <RTAInformation />
              <LanguageNotification />
              <ScrollNavigationButtons />
              </div>
            </div>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

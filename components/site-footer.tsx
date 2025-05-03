'use client'

import Link from "next/link"
import { Logo } from "@/components/logo"
import { LanguageDisplay } from "@/components/language-display"
import { useTranslation } from "@/contexts/language-context"

export function SiteFooter() {
  // Use translations
  const copyrightText = useTranslation("copyright")

  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* INFORMATION Column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold border-l-4 border-primary pl-2">INFORMATION</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Cookie Notice
                </Link>
              </li>
              <li>
                <Link
                  href="/usc2257"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  18 U.S.C 2257
                </Link>
              </li>
              <li>
                <Link
                  href="/dsa"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  EU DSA
                </Link>
              </li>
              <li>
                <Link
                  href="/content-curation"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Content Curation Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT & HELP Column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold border-l-4 border-primary pl-2">SUPPORT & HELP</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Contact Support
                </Link>
              </li>
              <li>
                <Link
                  href="/content-removal"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Content Removal
                </Link>
              </li>
              <li>
                <Link
                  href="/data-deletion"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Data Deletion
                </Link>
              </li>
              <li>
                <Link
                  href="/dmca"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  DMCA/Copyright
                </Link>
              </li>
              <li>
                <Link
                  href="/trust-safety"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link
                  href="/telegram"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Join Telegram
                </Link>
              </li>
            </ul>
          </div>

          {/* DISCOVER Column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold border-l-4 border-primary pl-2">DISCOVER</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/regalust-blogs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Regalust Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/our-blogs"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Our Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/sexual-wellness"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Sexual Wellness Center
                </Link>
              </li>
              <li>
                <Link
                  href="/creators-blog"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Creators Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/report-broken"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Report Broken Links
                </Link>
              </li>
              <li>
                <Link
                  href="/request"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Request Us
                </Link>
              </li>
            </ul>
          </div>

          {/* WORK WITH US Column */}
          <div>
            <h3 className="mb-4 text-lg font-semibold border-l-4 border-primary pl-2">WORK WITH US</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/content-partner"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Content Partner
                </Link>
              </li>
              <li>
                <Link
                  href="/webmaster"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Webmaster
                </Link>
              </li>
              <li>
                <Link
                  href="/model-programme"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Model Programme
                </Link>
              </li>
              <li>
                <Link
                  href="/advertise"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Advertise
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 border-t pt-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Logo className="h-6" />
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SorryMom Forum. {copyrightText}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LanguageDisplay />
          </div>
        </div>
      </div>
    </footer>
  )
}

"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function RTAInformation() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDarkTheme = theme === "dark"

  return (
    <div className={`border-t-4 border-red-600 ${isDarkTheme ? "bg-gray-100" : "bg-gray-900"}`}>
      <div className="px-4 py-6">
        <div
          className={`rounded-lg p-6 shadow-md border-l-4 border-red-600 text-center ${
            isDarkTheme ? "bg-white text-gray-900" : "bg-gray-800 text-white"
          }`}
        >
          <h2 className="text-xl font-bold mb-4 text-red-600">RTA</h2>

          <div className="space-y-4 text-sm max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold mb-1">Takedown Request Information</h3>
              <p>For takedown requests, please email us at [EMAIL].</p>
            </div>

            <div>
              <p className="mb-2">
                At [SITE_NAME] – Exposed & Viral MMS, we respect content regulations and individual rights. If you
                believe any content should be removed, reach out to us for immediate assistance.
              </p>
            </div>

            <div>
              <p className="mb-2">
                [SITE_NAME] – Exposed & Viral MMS is tagged with RTA (Restricted to Adults), enabling parental control
                systems to block access for underage users.
              </p>
            </div>

            <div>
              <p className="mb-2">
                Please note: We do not own any of the content displayed on our website. We merely aggregate and present
                content that is publicly available online. All rights and ownership of the original content belong to
                their respective creators.
              </p>
            </div>

            <div>
              <p className="mb-1 font-semibold">Parental Control Tools:</p>
              <div className="flex justify-center gap-3">
                <a
                  href="https://www.cyberpatrol.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isDarkTheme ? "text-blue-600" : "text-blue-400"} hover:underline`}
                >
                  🔗 CyberPatrol
                </a>
                <span>|</span>
                <a
                  href="https://www.netnanny.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${isDarkTheme ? "text-blue-600" : "text-blue-400"} hover:underline`}
                >
                  🔗 NetNanny
                </a>
              </div>
            </div>

            <div className={`pt-2 border-t ${isDarkTheme ? "border-gray-200" : "border-gray-700"}`}>
              <p>
                Visit our homepage:{" "}
                <a href="/" className={`${isDarkTheme ? "text-blue-600" : "text-blue-400"} hover:underline`}>
                  https://[Site_name].com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cloud, Map } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TN</span>
              </div>
              <span className="font-semibold text-gray-900">Tunisia Hub</span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              href="/weather"
              className={cn(
                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                pathname === "/weather"
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              )}
            >
              <Cloud className="w-4 h-4 mr-2" />
              Weather
            </Link>
            <Link
              href="/maps"
              className={cn(
                "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                pathname === "/maps"
                  ? "border-blue-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
              )}
            >
              <Map className="w-4 h-4 mr-2" />
              Maps
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import "./globals.css"
import { BasketProvider } from "@/context/basket-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Café Delight - Restaurant & Coffee Shop",
  description:
    "Modern digital menu for our restaurant and coffee shop featuring fresh coffee, delicious food, and warm atmosphere.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-cream-50 dark:bg-gray-900 text-coffee-900 dark:text-cream-100 transition-colors duration-300">
        <BasketProvider>{children}</BasketProvider>
      </body>
    </html>
  )
}

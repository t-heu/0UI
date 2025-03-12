import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "0UI - Create your UI with your favorite template",
  description: "AI-powered EJS, JADE, PUG... and CSS template generator",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#111" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

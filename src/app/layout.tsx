import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { UserProvider } from "./context/userContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "0UI - Create and Edit Live",
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
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}

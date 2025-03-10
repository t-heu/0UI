import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0EJS - Crie Templates EJS e CSS",
  description: "Gerador de templates EJS e CSS com IA",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#333" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

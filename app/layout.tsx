import type React from "react"
// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Layout principal da aplicação
// Desenvolvido por Igor e Paolla
// =====================================================

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ELLP - Sistema de Controle de Oficinas",
  description: "Sistema de gerenciamento de oficinas educacionais desenvolvido por Igor e Paolla",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  )
}

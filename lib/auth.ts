// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Módulo de autenticação
// =====================================================

import { cookies } from "next/headers"

// Nome do cookie de sessão
const SESSION_COOKIE = "ellp_session"

// Interface do usuário autenticado
export interface Usuario {
  id: number
  nome: string
  email: string
}

// Função para criar uma sessão após login bem-sucedido
// Armazena os dados do usuário em um cookie
export async function criarSessao(usuario: Usuario) {
  const cookieStore = await cookies()
  const sessaoData = JSON.stringify(usuario)
  // Codifica em base64 para armazenar no cookie
  const sessaoBase64 = Buffer.from(sessaoData).toString("base64")

  cookieStore.set(SESSION_COOKIE, sessaoBase64, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  })
}

// Função para obter o usuário da sessão atual
// Retorna null se não houver sessão válida
export async function obterSessao(): Promise<Usuario | null> {
  const cookieStore = await cookies()
  const sessaoCookie = cookieStore.get(SESSION_COOKIE)

  if (!sessaoCookie?.value) {
    return null
  }

  try {
    const sessaoData = Buffer.from(sessaoCookie.value, "base64").toString()
    return JSON.parse(sessaoData) as Usuario
  } catch {
    return null
  }
}

// Função para encerrar a sessão (logout)
// Remove o cookie de sessão
export async function encerrarSessao() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

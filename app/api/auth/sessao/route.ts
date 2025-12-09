// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de autenticação - Rota de verificação de sessão
// =====================================================

import { NextResponse } from "next/server"
import { obterSessao } from "@/lib/auth"

// GET /api/auth/sessao
// Retorna os dados da sessão atual
export async function GET() {
  try {
    const usuario = await obterSessao()

    if (!usuario) {
      return NextResponse.json({ autenticado: false }, { status: 401 })
    }

    return NextResponse.json({ autenticado: true, usuario })
  } catch (erro) {
    console.error("Erro ao verificar sessão:", erro)
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 })
  }
}

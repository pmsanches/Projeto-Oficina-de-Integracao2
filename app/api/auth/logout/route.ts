// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de autenticação - Rota de logout
// =====================================================

import { NextResponse } from "next/server"
import { encerrarSessao } from "@/lib/auth"

// POST /api/auth/logout
// Encerra a sessão do usuário
export async function POST() {
  try {
    await encerrarSessao()
    return NextResponse.json({ sucesso: true })
  } catch (erro) {
    console.error("Erro no logout:", erro)
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 })
  }
}

// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de autenticação - Rota de login
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"
import { criarSessao } from "@/lib/auth"

// POST /api/auth/login
// Realiza a autenticação do usuário
export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json()

    // Validação dos campos obrigatórios
    if (!email || !senha) {
      return NextResponse.json({ erro: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Busca o usuário no banco de dados
    const resultado = await sql`SELECT id, nome, email FROM usuarios WHERE email = ${email} AND senha = ${senha}`

    // Verifica se encontrou o usuário
    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Email ou senha inválidos" }, { status: 401 })
    }

    const usuario = resultado[0]

    // Cria a sessão do usuário
    await criarSessao({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    })

    return NextResponse.json({ sucesso: true, usuario })
  } catch (erro) {
    console.error("Erro no login:", erro)
    return NextResponse.json({ erro: "Erro interno do servidor" }, { status: 500 })
  }
}

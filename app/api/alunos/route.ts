// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Alunos - CRUD completo
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/alunos
// Lista todos os alunos cadastrados
export async function GET() {
  try {
    const resultado = await sql`SELECT * FROM alunos ORDER BY nome ASC`
    return NextResponse.json(resultado)
  } catch (erro) {
    console.error("Erro ao listar alunos:", erro)
    return NextResponse.json({ erro: "Erro ao listar alunos" }, { status: 500 })
  }
}

// POST /api/alunos
// Cadastra um novo aluno
export async function POST(request: Request) {
  try {
    const { nome, telefone, email } = await request.json()

    if (!nome || !email) {
      return NextResponse.json({ erro: "Nome e email são obrigatórios" }, { status: 400 })
    }

    const resultado = await sql`
      INSERT INTO alunos (nome, telefone, email) 
      VALUES (${nome}, ${telefone}, ${email}) 
      RETURNING *
    `

    return NextResponse.json(resultado[0], { status: 201 })
  } catch (erro) {
    console.error("Erro ao cadastrar aluno:", erro)
    return NextResponse.json({ erro: "Erro ao cadastrar aluno" }, { status: 500 })
  }
}

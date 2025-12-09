// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Professores - CRUD completo
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/professores
// Lista todos os professores cadastrados
export async function GET() {
  try {
    const resultado = await sql`SELECT * FROM professores ORDER BY nome ASC`
    return NextResponse.json(resultado)
  } catch (erro) {
    console.error("Erro ao listar professores:", erro)
    return NextResponse.json({ erro: "Erro ao listar professores" }, { status: 500 })
  }
}

// POST /api/professores
// Cadastra um novo professor
export async function POST(request: Request) {
  try {
    const { nome, cargo, telefone, email } = await request.json()

    // Validação dos campos obrigatórios
    if (!nome || !cargo || !email) {
      return NextResponse.json({ erro: "Nome, cargo e email são obrigatórios" }, { status: 400 })
    }

    const resultado = await sql`
      INSERT INTO professores (nome, cargo, telefone, email) 
      VALUES (${nome}, ${cargo}, ${telefone}, ${email}) 
      RETURNING *
    `

    return NextResponse.json(resultado[0], { status: 201 })
  } catch (erro) {
    console.error("Erro ao cadastrar professor:", erro)
    return NextResponse.json({ erro: "Erro ao cadastrar professor" }, { status: 500 })
  }
}

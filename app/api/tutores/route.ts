// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Tutores - CRUD completo
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/tutores
// Lista todos os tutores cadastrados
export async function GET() {
  try {
    const resultado = await sql`SELECT * FROM tutores ORDER BY nome ASC`
    return NextResponse.json(resultado)
  } catch (erro) {
    console.error("Erro ao listar tutores:", erro)
    return NextResponse.json({ erro: "Erro ao listar tutores" }, { status: 500 })
  }
}

// POST /api/tutores
// Cadastra um novo tutor
export async function POST(request: Request) {
  try {
    const { nome, cargo, telefone, email } = await request.json()

    if (!nome || !cargo || !email) {
      return NextResponse.json({ erro: "Nome, cargo e email são obrigatórios" }, { status: 400 })
    }

    const resultado = await sql`
      INSERT INTO tutores (nome, cargo, telefone, email) 
      VALUES (${nome}, ${cargo}, ${telefone}, ${email}) 
      RETURNING *
    `

    return NextResponse.json(resultado[0], { status: 201 })
  } catch (erro) {
    console.error("Erro ao cadastrar tutor:", erro)
    return NextResponse.json({ erro: "Erro ao cadastrar tutor" }, { status: 500 })
  }
}

// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Temas - CRUD completo
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/temas
// Lista todos os temas de oficina cadastrados
export async function GET() {
  try {
    const resultado = await sql`SELECT * FROM temas ORDER BY titulo ASC`
    return NextResponse.json(resultado)
  } catch (erro) {
    console.error("Erro ao listar temas:", erro)
    return NextResponse.json({ erro: "Erro ao listar temas" }, { status: 500 })
  }
}

// POST /api/temas
// Cadastra um novo tema de oficina
export async function POST(request: Request) {
  try {
    const { titulo, descricao, carga_horaria } = await request.json()

    if (!titulo || !carga_horaria) {
      return NextResponse.json({ erro: "Título e carga horária são obrigatórios" }, { status: 400 })
    }

    const resultado = await sql`
      INSERT INTO temas (titulo, descricao, carga_horaria) 
      VALUES (${titulo}, ${descricao}, ${carga_horaria}) 
      RETURNING *
    `

    return NextResponse.json(resultado[0], { status: 201 })
  } catch (erro) {
    console.error("Erro ao cadastrar tema:", erro)
    return NextResponse.json({ erro: "Erro ao cadastrar tema" }, { status: 500 })
  }
}

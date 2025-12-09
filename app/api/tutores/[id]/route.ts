// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Tutores - Operações por ID
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/tutores/[id]
// Busca um tutor específico pelo ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await sql`SELECT * FROM tutores WHERE id = ${id}`

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Tutor não encontrado" }, { status: 404 })
    }

    return NextResponse.json(resultado[0])
  } catch (erro) {
    console.error("Erro ao buscar tutor:", erro)
    return NextResponse.json({ erro: "Erro ao buscar tutor" }, { status: 500 })
  }
}

// PUT /api/tutores/[id]
// Atualiza os dados de um tutor
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { nome, cargo, telefone, email } = await request.json()

    const resultado = await sql`
      UPDATE tutores 
      SET nome = ${nome}, cargo = ${cargo}, telefone = ${telefone}, email = ${email} 
      WHERE id = ${id} 
      RETURNING *
    `

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Tutor não encontrado" }, { status: 404 })
    }

    return NextResponse.json(resultado[0])
  } catch (erro) {
    console.error("Erro ao atualizar tutor:", erro)
    return NextResponse.json({ erro: "Erro ao atualizar tutor" }, { status: 500 })
  }
}

// DELETE /api/tutores/[id]
// Remove um tutor do sistema
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await sql`DELETE FROM tutores WHERE id = ${id} RETURNING *`

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Tutor não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ sucesso: true })
  } catch (erro) {
    console.error("Erro ao excluir tutor:", erro)
    return NextResponse.json({ erro: "Erro ao excluir tutor" }, { status: 500 })
  }
}

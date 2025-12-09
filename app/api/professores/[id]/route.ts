// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Professores - Operações por ID
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/professores/[id]
// Busca um professor específico pelo ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await sql`SELECT * FROM professores WHERE id = ${id}`

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Professor não encontrado" }, { status: 404 })
    }

    return NextResponse.json(resultado[0])
  } catch (erro) {
    console.error("Erro ao buscar professor:", erro)
    return NextResponse.json({ erro: "Erro ao buscar professor" }, { status: 500 })
  }
}

// PUT /api/professores/[id]
// Atualiza os dados de um professor
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { nome, cargo, telefone, email } = await request.json()

    const resultado = await sql`
      UPDATE professores 
      SET nome = ${nome}, cargo = ${cargo}, telefone = ${telefone}, email = ${email} 
      WHERE id = ${id} 
      RETURNING *
    `

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Professor não encontrado" }, { status: 404 })
    }

    return NextResponse.json(resultado[0])
  } catch (erro) {
    console.error("Erro ao atualizar professor:", erro)
    return NextResponse.json({ erro: "Erro ao atualizar professor" }, { status: 500 })
  }
}

// DELETE /api/professores/[id]
// Remove um professor do sistema
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await sql`DELETE FROM professores WHERE id = ${id} RETURNING *`

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Professor não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ sucesso: true })
  } catch (erro) {
    console.error("Erro ao excluir professor:", erro)
    return NextResponse.json({ erro: "Erro ao excluir professor" }, { status: 500 })
  }
}

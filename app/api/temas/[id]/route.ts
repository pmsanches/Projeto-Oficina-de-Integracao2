// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Temas - Operações por ID
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/temas/[id]
// Busca um tema específico pelo ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await sql`SELECT * FROM temas WHERE id = ${id}`

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Tema não encontrado" }, { status: 404 })
    }

    return NextResponse.json(resultado[0])
  } catch (erro) {
    console.error("Erro ao buscar tema:", erro)
    return NextResponse.json({ erro: "Erro ao buscar tema" }, { status: 500 })
  }
}

// PUT /api/temas/[id]
// Atualiza os dados de um tema
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { titulo, descricao, carga_horaria } = await request.json()

    const resultado = await sql`
      UPDATE temas 
      SET titulo = ${titulo}, descricao = ${descricao}, carga_horaria = ${carga_horaria} 
      WHERE id = ${id} 
      RETURNING *
    `

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Tema não encontrado" }, { status: 404 })
    }

    return NextResponse.json(resultado[0])
  } catch (erro) {
    console.error("Erro ao atualizar tema:", erro)
    return NextResponse.json({ erro: "Erro ao atualizar tema" }, { status: 500 })
  }
}

// DELETE /api/temas/[id]
// Remove um tema do sistema
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await sql`DELETE FROM temas WHERE id = ${id} RETURNING *`

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Tema não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ sucesso: true })
  } catch (erro) {
    console.error("Erro ao excluir tema:", erro)
    return NextResponse.json({ erro: "Erro ao excluir tema" }, { status: 500 })
  }
}

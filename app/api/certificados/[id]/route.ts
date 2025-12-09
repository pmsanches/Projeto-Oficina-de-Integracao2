// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Certificados - Operações por ID
// =====================================================

import { NextResponse } from "next/server"
import { query } from "@/lib/db"

// GET /api/certificados/[id]
// Busca um certificado específico com todos os dados
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const resultado = await query(
      `
      SELECT c.*, a.nome as aluno_nome, a.email as aluno_email,
             o.titulo as oficina_titulo, o.descricao as oficina_descricao,
             t.titulo as tema_titulo, t.descricao as tema_descricao, t.carga_horaria
      FROM certificados c
      JOIN alunos a ON c.aluno_id = a.id
      JOIN oficinas o ON c.oficina_id = o.id
      LEFT JOIN temas t ON o.tema_id = t.id
      WHERE c.id = $1
    `,
      [id],
    )

    if (resultado.rows.length === 0) {
      return NextResponse.json({ erro: "Certificado não encontrado" }, { status: 404 })
    }

    return NextResponse.json(resultado.rows[0])
  } catch (erro) {
    console.error("Erro ao buscar certificado:", erro)
    return NextResponse.json({ erro: "Erro ao buscar certificado" }, { status: 500 })
  }
}

// DELETE /api/certificados/[id]
// Remove um certificado
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await query("DELETE FROM certificados WHERE id = $1 RETURNING *", [id])

    if (resultado.rows.length === 0) {
      return NextResponse.json({ erro: "Certificado não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ sucesso: true })
  } catch (erro) {
    console.error("Erro ao excluir certificado:", erro)
    return NextResponse.json({ erro: "Erro ao excluir certificado" }, { status: 500 })
  }
}

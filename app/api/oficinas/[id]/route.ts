// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Oficinas - Operações por ID
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/oficinas/[id]
// Busca uma oficina específica com todos os relacionamentos
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const resultado = await sql`
      SELECT o.*, t.titulo as tema_titulo, t.carga_horaria as tema_carga_horaria, t.descricao as tema_descricao
      FROM oficinas o
      LEFT JOIN temas t ON o.tema_id = t.id
      WHERE o.id = ${id}
    `

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Oficina não encontrada" }, { status: 404 })
    }

    const oficina = resultado[0]

    // Busca os relacionamentos
    const professores = await sql`
      SELECT p.* FROM professores p
      JOIN oficina_professores op ON p.id = op.professor_id
      WHERE op.oficina_id = ${id}
    `

    const tutores = await sql`
      SELECT t.* FROM tutores t
      JOIN oficina_tutores ot ON t.id = ot.tutor_id
      WHERE ot.oficina_id = ${id}
    `

    const alunos = await sql`
      SELECT a.* FROM alunos a
      JOIN oficina_alunos oa ON a.id = oa.aluno_id
      WHERE oa.oficina_id = ${id}
    `

    return NextResponse.json({
      ...oficina,
      professores,
      tutores,
      alunos,
    })
  } catch (erro) {
    console.error("Erro ao buscar oficina:", erro)
    return NextResponse.json({ erro: "Erro ao buscar oficina" }, { status: 500 })
  }
}

// PUT /api/oficinas/[id]
// Atualiza uma oficina e seus relacionamentos
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { titulo, descricao, tema_id, professores_ids, tutores_ids, alunos_ids } = await request.json()

    // Atualiza a oficina
    const resultado = await sql`
      UPDATE oficinas 
      SET titulo = ${titulo}, descricao = ${descricao}, tema_id = ${tema_id || null} 
      WHERE id = ${id} 
      RETURNING *
    `

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Oficina não encontrada" }, { status: 404 })
    }

    // Remove os relacionamentos antigos e insere os novos
    await sql`DELETE FROM oficina_professores WHERE oficina_id = ${id}`
    await sql`DELETE FROM oficina_tutores WHERE oficina_id = ${id}`
    await sql`DELETE FROM oficina_alunos WHERE oficina_id = ${id}`

    // Insere os novos relacionamentos
    if (professores_ids && professores_ids.length > 0) {
      for (const professorId of professores_ids) {
        await sql`INSERT INTO oficina_professores (oficina_id, professor_id) VALUES (${id}, ${professorId})`
      }
    }

    if (tutores_ids && tutores_ids.length > 0) {
      for (const tutorId of tutores_ids) {
        await sql`INSERT INTO oficina_tutores (oficina_id, tutor_id) VALUES (${id}, ${tutorId})`
      }
    }

    if (alunos_ids && alunos_ids.length > 0) {
      for (const alunoId of alunos_ids) {
        await sql`INSERT INTO oficina_alunos (oficina_id, aluno_id) VALUES (${id}, ${alunoId})`
      }
    }

    return NextResponse.json(resultado[0])
  } catch (erro) {
    console.error("Erro ao atualizar oficina:", erro)
    return NextResponse.json({ erro: "Erro ao atualizar oficina" }, { status: 500 })
  }
}

// DELETE /api/oficinas/[id]
// Remove uma oficina do sistema
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resultado = await sql`DELETE FROM oficinas WHERE id = ${id} RETURNING *`

    if (resultado.length === 0) {
      return NextResponse.json({ erro: "Oficina não encontrada" }, { status: 404 })
    }

    return NextResponse.json({ sucesso: true })
  } catch (erro) {
    console.error("Erro ao excluir oficina:", erro)
    return NextResponse.json({ erro: "Erro ao excluir oficina" }, { status: 500 })
  }
}

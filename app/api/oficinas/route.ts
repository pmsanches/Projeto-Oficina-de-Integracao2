// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Oficinas - CRUD completo
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/oficinas
// Lista todas as oficinas com seus relacionamentos
export async function GET() {
  try {
    // Busca as oficinas com o tema relacionado
    const oficinas = await sql`
      SELECT o.*, t.titulo as tema_titulo, t.carga_horaria as tema_carga_horaria
      FROM oficinas o
      LEFT JOIN temas t ON o.tema_id = t.id
      ORDER BY o.criado_em DESC
    `

    // Para cada oficina, busca os professores, tutores e alunos
    const oficinasCompletas = await Promise.all(
      oficinas.map(async (oficina) => {
        const professores = await sql`
          SELECT p.* FROM professores p
          JOIN oficina_professores op ON p.id = op.professor_id
          WHERE op.oficina_id = ${oficina.id}
        `

        const tutores = await sql`
          SELECT t.* FROM tutores t
          JOIN oficina_tutores ot ON t.id = ot.tutor_id
          WHERE ot.oficina_id = ${oficina.id}
        `

        const alunos = await sql`
          SELECT a.* FROM alunos a
          JOIN oficina_alunos oa ON a.id = oa.aluno_id
          WHERE oa.oficina_id = ${oficina.id}
        `

        return {
          ...oficina,
          professores,
          tutores,
          alunos,
        }
      }),
    )

    return NextResponse.json(oficinasCompletas)
  } catch (erro) {
    console.error("Erro ao listar oficinas:", erro)
    return NextResponse.json({ erro: "Erro ao listar oficinas" }, { status: 500 })
  }
}

// POST /api/oficinas
// Cadastra uma nova oficina com seus relacionamentos
export async function POST(request: Request) {
  try {
    const { titulo, descricao, tema_id, professores_ids, tutores_ids, alunos_ids } = await request.json()

    if (!titulo) {
      return NextResponse.json({ erro: "Título é obrigatório" }, { status: 400 })
    }

    // Insere a oficina
    const resultado = await sql`
      INSERT INTO oficinas (titulo, descricao, tema_id) 
      VALUES (${titulo}, ${descricao}, ${tema_id || null}) 
      RETURNING *
    `

    const oficina = resultado[0]

    // Insere os relacionamentos com professores
    if (professores_ids && professores_ids.length > 0) {
      for (const professorId of professores_ids) {
        await sql`INSERT INTO oficina_professores (oficina_id, professor_id) VALUES (${oficina.id}, ${professorId})`
      }
    }

    // Insere os relacionamentos com tutores
    if (tutores_ids && tutores_ids.length > 0) {
      for (const tutorId of tutores_ids) {
        await sql`INSERT INTO oficina_tutores (oficina_id, tutor_id) VALUES (${oficina.id}, ${tutorId})`
      }
    }

    // Insere os relacionamentos com alunos
    if (alunos_ids && alunos_ids.length > 0) {
      for (const alunoId of alunos_ids) {
        await sql`INSERT INTO oficina_alunos (oficina_id, aluno_id) VALUES (${oficina.id}, ${alunoId})`
      }
    }

    return NextResponse.json(oficina, { status: 201 })
  } catch (erro) {
    console.error("Erro ao cadastrar oficina:", erro)
    return NextResponse.json({ erro: "Erro ao cadastrar oficina" }, { status: 500 })
  }
}

// =====================================================
// ELLP - Sistema de Controle de Oficinas
// API de Certificados - Listagem e Geração
// =====================================================

import { NextResponse } from "next/server"
import sql from "@/lib/db"

// GET /api/certificados
// Lista todos os certificados emitidos
export async function GET() {
  try {
    const resultado = await sql`
      SELECT c.*, a.nome as aluno_nome, a.email as aluno_email,
             o.titulo as oficina_titulo, o.descricao as oficina_descricao,
             t.titulo as tema_titulo, t.carga_horaria
      FROM certificados c
      JOIN alunos a ON c.aluno_id = a.id
      JOIN oficinas o ON c.oficina_id = o.id
      LEFT JOIN temas t ON o.tema_id = t.id
      ORDER BY c.data_emissao DESC
    `
    return NextResponse.json(resultado)
  } catch (erro) {
    console.error("Erro ao listar certificados:", erro)
    return NextResponse.json({ erro: "Erro ao listar certificados" }, { status: 500 })
  }
}

// POST /api/certificados
// Gera um novo certificado para um aluno de uma oficina
export async function POST(request: Request) {
  try {
    const { aluno_id, oficina_id } = await request.json()

    if (!aluno_id || !oficina_id) {
      return NextResponse.json({ erro: "Aluno e oficina são obrigatórios" }, { status: 400 })
    }

    // Verifica se o aluno está inscrito na oficina
    const inscricao = await sql`
      SELECT * FROM oficina_alunos WHERE aluno_id = ${aluno_id} AND oficina_id = ${oficina_id}
    `

    if (inscricao.length === 0) {
      return NextResponse.json({ erro: "Aluno não está inscrito nesta oficina" }, { status: 400 })
    }

    // Verifica se já existe certificado
    const certificadoExistente = await sql`
      SELECT * FROM certificados WHERE aluno_id = ${aluno_id} AND oficina_id = ${oficina_id}
    `

    if (certificadoExistente.length > 0) {
      return NextResponse.json({ erro: "Certificado já foi emitido para este aluno nesta oficina" }, { status: 400 })
    }

    // Gera código único para o certificado
    const codigo = `ELLP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    const resultado = await sql`
      INSERT INTO certificados (aluno_id, oficina_id, codigo) 
      VALUES (${aluno_id}, ${oficina_id}, ${codigo}) 
      RETURNING *
    `

    return NextResponse.json(resultado[0], { status: 201 })
  } catch (erro) {
    console.error("Erro ao gerar certificado:", erro)
    return NextResponse.json({ erro: "Erro ao gerar certificado" }, { status: 500 })
  }
}

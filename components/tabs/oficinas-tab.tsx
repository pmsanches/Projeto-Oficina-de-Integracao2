// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Aba de gerenciamento de Oficinas
// =====================================================

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

// Interfaces para os dados
interface Tema {
  id: number
  titulo: string
  carga_horaria: number
}

interface Professor {
  id: number
  nome: string
}

interface Tutor {
  id: number
  nome: string
}

interface Aluno {
  id: number
  nome: string
}

interface Oficina {
  id: number
  titulo: string
  descricao: string
  tema_id: number
  tema_titulo: string
  tema_carga_horaria: number
  professores: Professor[]
  tutores: Tutor[]
  alunos: Aluno[]
}

// Componente da aba de Oficinas
// Permite listar, cadastrar, editar e excluir oficinas
export default function OficinasTab() {
  const [oficinas, setOficinas] = useState<Oficina[]>([])
  const [temas, setTemas] = useState<Tema[]>([])
  const [professores, setProfessores] = useState<Professor[]>([])
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<Oficina | null>(null)
  const [carregando, setCarregando] = useState(true)

  // Estado do formulário
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [temaId, setTemaId] = useState("")
  const [professoresSelecionados, setProfessoresSelecionados] = useState<number[]>([])
  const [tutoresSelecionados, setTutoresSelecionados] = useState<number[]>([])
  const [alunosSelecionados, setAlunosSelecionados] = useState<number[]>([])

  // Carrega todos os dados necessários ao montar o componente
  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [oficinasRes, temasRes, professoresRes, tutoresRes, alunosRes] = await Promise.all([
        fetch("/api/oficinas"),
        fetch("/api/temas"),
        fetch("/api/professores"),
        fetch("/api/tutores"),
        fetch("/api/alunos"),
      ])

      setOficinas(await oficinasRes.json())
      setTemas(await temasRes.json())
      setProfessores(await professoresRes.json())
      setTutores(await tutoresRes.json())
      setAlunos(await alunosRes.json())
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro)
    } finally {
      setCarregando(false)
    }
  }

  const limparFormulario = () => {
    setTitulo("")
    setDescricao("")
    setTemaId("")
    setProfessoresSelecionados([])
    setTutoresSelecionados([])
    setAlunosSelecionados([])
    setEditando(null)
  }

  const abrirEdicao = (oficina: Oficina) => {
    setEditando(oficina)
    setTitulo(oficina.titulo)
    setDescricao(oficina.descricao || "")
    setTemaId(oficina.tema_id?.toString() || "")
    setProfessoresSelecionados(oficina.professores.map((p) => p.id))
    setTutoresSelecionados(oficina.tutores.map((t) => t.id))
    setAlunosSelecionados(oficina.alunos.map((a) => a.id))
    setDialogAberto(true)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const dados = {
      titulo,
      descricao,
      tema_id: temaId ? Number.parseInt(temaId) : null,
      professores_ids: professoresSelecionados,
      tutores_ids: tutoresSelecionados,
      alunos_ids: alunosSelecionados,
    }

    try {
      if (editando) {
        await fetch(`/api/oficinas/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      } else {
        await fetch("/api/oficinas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      }

      carregarDados()
      setDialogAberto(false)
      limparFormulario()
    } catch (erro) {
      console.error("Erro ao salvar oficina:", erro)
    }
  }

  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta oficina?")) return

    try {
      await fetch(`/api/oficinas/${id}`, { method: "DELETE" })
      carregarDados()
    } catch (erro) {
      console.error("Erro ao excluir oficina:", erro)
    }
  }

  // Funções para alternar seleção de checkboxes
  const toggleProfessor = (id: number) => {
    setProfessoresSelecionados((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const toggleTutor = (id: number) => {
    setTutoresSelecionados((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const toggleAluno = (id: number) => {
    setAlunosSelecionados((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  if (carregando) {
    return <p className="text-slate-500 py-4">Carregando...</p>
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-end">
        <Dialog
          open={dialogAberto}
          onOpenChange={(open) => {
            setDialogAberto(open)
            if (!open) limparFormulario()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Nova Oficina</Button>
          </DialogTrigger>
          <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-slate-800">{editando ? "Editar Oficina" : "Nova Oficina"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSalvar} className="space-y-4">
              {/* Campos básicos */}
              <div className="space-y-2">
                <Label className="text-slate-700">Título</Label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  className="border-slate-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Descrição</Label>
                <Textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="border-slate-300"
                  rows={2}
                />
              </div>

              {/* Seleção de tema */}
              <div className="space-y-2">
                <Label className="text-slate-700">Tema</Label>
                <Select value={temaId} onValueChange={setTemaId}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {temas.map((tema) => (
                      <SelectItem key={tema.id} value={tema.id.toString()}>
                        {tema.titulo} ({tema.carga_horaria}h)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de professores */}
              <div className="space-y-2">
                <Label className="text-slate-700">Professores</Label>
                <div className="border border-slate-200 rounded-md p-3 max-h-32 overflow-y-auto">
                  {professores.length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhum professor cadastrado</p>
                  ) : (
                    professores.map((professor) => (
                      <div key={professor.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`prof-${professor.id}`}
                          checked={professoresSelecionados.includes(professor.id)}
                          onCheckedChange={() => toggleProfessor(professor.id)}
                        />
                        <label htmlFor={`prof-${professor.id}`} className="text-sm text-slate-700 cursor-pointer">
                          {professor.nome}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Seleção de tutores */}
              <div className="space-y-2">
                <Label className="text-slate-700">Tutores</Label>
                <div className="border border-slate-200 rounded-md p-3 max-h-32 overflow-y-auto">
                  {tutores.length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhum tutor cadastrado</p>
                  ) : (
                    tutores.map((tutor) => (
                      <div key={tutor.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`tutor-${tutor.id}`}
                          checked={tutoresSelecionados.includes(tutor.id)}
                          onCheckedChange={() => toggleTutor(tutor.id)}
                        />
                        <label htmlFor={`tutor-${tutor.id}`} className="text-sm text-slate-700 cursor-pointer">
                          {tutor.nome}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Seleção de alunos */}
              <div className="space-y-2">
                <Label className="text-slate-700">Alunos</Label>
                <div className="border border-slate-200 rounded-md p-3 max-h-32 overflow-y-auto">
                  {alunos.length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhum aluno cadastrado</p>
                  ) : (
                    alunos.map((aluno) => (
                      <div key={aluno.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`aluno-${aluno.id}`}
                          checked={alunosSelecionados.includes(aluno.id)}
                          onCheckedChange={() => toggleAluno(aluno.id)}
                        />
                        <label htmlFor={`aluno-${aluno.id}`} className="text-sm text-slate-700 cursor-pointer">
                          {aluno.nome}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de oficinas */}
      {oficinas.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhuma oficina cadastrada</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-600">Título</TableHead>
              <TableHead className="text-slate-600">Tema</TableHead>
              <TableHead className="text-slate-600">Professores</TableHead>
              <TableHead className="text-slate-600">Alunos</TableHead>
              <TableHead className="text-slate-600 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {oficinas.map((oficina) => (
              <TableRow key={oficina.id} className="border-slate-200">
                <TableCell className="text-slate-800">{oficina.titulo}</TableCell>
                <TableCell className="text-slate-600">{oficina.tema_titulo || "-"}</TableCell>
                <TableCell className="text-slate-600">
                  {oficina.professores.length > 0 ? oficina.professores.map((p) => p.nome).join(", ") : "-"}
                </TableCell>
                <TableCell className="text-slate-600">{oficina.alunos.length} aluno(s)</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => abrirEdicao(oficina)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExcluir(oficina.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

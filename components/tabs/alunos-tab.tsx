// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Aba de gerenciamento de Alunos
// =====================================================

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Interface para os dados do aluno
interface Aluno {
  id: number
  nome: string
  telefone: string
  email: string
}

// Componente da aba de Alunos
// Permite listar, cadastrar, editar e excluir alunos
export default function AlunosTab() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<Aluno | null>(null)
  const [carregando, setCarregando] = useState(true)

  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    carregarAlunos()
  }, [])

  const carregarAlunos = async () => {
    try {
      const resposta = await fetch("/api/alunos")
      const dados = await resposta.json()
      setAlunos(dados)
    } catch (erro) {
      console.error("Erro ao carregar alunos:", erro)
    } finally {
      setCarregando(false)
    }
  }

  const limparFormulario = () => {
    setNome("")
    setTelefone("")
    setEmail("")
    setEditando(null)
  }

  const abrirEdicao = (aluno: Aluno) => {
    setEditando(aluno)
    setNome(aluno.nome)
    setTelefone(aluno.telefone || "")
    setEmail(aluno.email)
    setDialogAberto(true)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const dados = { nome, telefone, email }

    try {
      if (editando) {
        await fetch(`/api/alunos/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      } else {
        await fetch("/api/alunos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      }

      carregarAlunos()
      setDialogAberto(false)
      limparFormulario()
    } catch (erro) {
      console.error("Erro ao salvar aluno:", erro)
    }
  }

  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) return

    try {
      await fetch(`/api/alunos/${id}`, { method: "DELETE" })
      carregarAlunos()
    } catch (erro) {
      console.error("Erro ao excluir aluno:", erro)
    }
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Novo Aluno</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-800">{editando ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSalvar} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} required className="border-slate-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Telefone</Label>
                <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="border-slate-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-slate-300"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Salvar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {alunos.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhum aluno cadastrado</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-600">Nome</TableHead>
              <TableHead className="text-slate-600">Telefone</TableHead>
              <TableHead className="text-slate-600">Email</TableHead>
              <TableHead className="text-slate-600 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alunos.map((aluno) => (
              <TableRow key={aluno.id} className="border-slate-200">
                <TableCell className="text-slate-800">{aluno.nome}</TableCell>
                <TableCell className="text-slate-600">{aluno.telefone || "-"}</TableCell>
                <TableCell className="text-slate-600">{aluno.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => abrirEdicao(aluno)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExcluir(aluno.id)}
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

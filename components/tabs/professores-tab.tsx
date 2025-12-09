// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Aba de gerenciamento de Professores
// =====================================================

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Interface para os dados do professor
interface Professor {
  id: number
  nome: string
  cargo: string
  telefone: string
  email: string
}

// Componente da aba de Professores
// Permite listar, cadastrar, editar e excluir professores
export default function ProfessoresTab() {
  const [professores, setProfessores] = useState<Professor[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<Professor | null>(null)
  const [carregando, setCarregando] = useState(true)

  // Estado do formulário
  const [nome, setNome] = useState("")
  const [cargo, setCargo] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")

  // Carrega a lista de professores ao montar o componente
  useEffect(() => {
    carregarProfessores()
  }, [])

  // Função para carregar todos os professores
  const carregarProfessores = async () => {
    try {
      const resposta = await fetch("/api/professores")
      const dados = await resposta.json()
      setProfessores(dados)
    } catch (erro) {
      console.error("Erro ao carregar professores:", erro)
    } finally {
      setCarregando(false)
    }
  }

  // Limpa o formulário
  const limparFormulario = () => {
    setNome("")
    setCargo("")
    setTelefone("")
    setEmail("")
    setEditando(null)
  }

  // Abre o dialog para edição
  const abrirEdicao = (professor: Professor) => {
    setEditando(professor)
    setNome(professor.nome)
    setCargo(professor.cargo)
    setTelefone(professor.telefone || "")
    setEmail(professor.email)
    setDialogAberto(true)
  }

  // Função para salvar (criar ou atualizar)
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()

    const dados = { nome, cargo, telefone, email }

    try {
      if (editando) {
        // Atualiza professor existente
        await fetch(`/api/professores/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      } else {
        // Cria novo professor
        await fetch("/api/professores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      }

      carregarProfessores()
      setDialogAberto(false)
      limparFormulario()
    } catch (erro) {
      console.error("Erro ao salvar professor:", erro)
    }
  }

  // Função para excluir professor
  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este professor?")) return

    try {
      await fetch(`/api/professores/${id}`, { method: "DELETE" })
      carregarProfessores()
    } catch (erro) {
      console.error("Erro ao excluir professor:", erro)
    }
  }

  if (carregando) {
    return <p className="text-slate-500 py-4">Carregando...</p>
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Botão para adicionar novo professor */}
      <div className="flex justify-end">
        <Dialog
          open={dialogAberto}
          onOpenChange={(open) => {
            setDialogAberto(open)
            if (!open) limparFormulario()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Novo Professor</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-800">{editando ? "Editar Professor" : "Novo Professor"}</DialogTitle>
            </DialogHeader>
            {/* Formulário de cadastro/edição */}
            <form onSubmit={handleSalvar} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-700">Nome</Label>
                <Input value={nome} onChange={(e) => setNome(e.target.value)} required className="border-slate-300" />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Cargo</Label>
                <Input value={cargo} onChange={(e) => setCargo(e.target.value)} required className="border-slate-300" />
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

      {/* Tabela de professores */}
      {professores.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhum professor cadastrado</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-600">Nome</TableHead>
              <TableHead className="text-slate-600">Cargo</TableHead>
              <TableHead className="text-slate-600">Telefone</TableHead>
              <TableHead className="text-slate-600">Email</TableHead>
              <TableHead className="text-slate-600 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {professores.map((professor) => (
              <TableRow key={professor.id} className="border-slate-200">
                <TableCell className="text-slate-800">{professor.nome}</TableCell>
                <TableCell className="text-slate-600">{professor.cargo}</TableCell>
                <TableCell className="text-slate-600">{professor.telefone || "-"}</TableCell>
                <TableCell className="text-slate-600">{professor.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => abrirEdicao(professor)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExcluir(professor.id)}
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

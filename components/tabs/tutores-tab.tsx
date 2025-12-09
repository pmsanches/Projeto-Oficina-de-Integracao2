// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Aba de gerenciamento de Tutores
// =====================================================

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Interface para os dados do tutor
interface Tutor {
  id: number
  nome: string
  cargo: string
  telefone: string
  email: string
}

// Componente da aba de Tutores
// Permite listar, cadastrar, editar e excluir tutores
export default function TutoresTab() {
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<Tutor | null>(null)
  const [carregando, setCarregando] = useState(true)

  const [nome, setNome] = useState("")
  const [cargo, setCargo] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    carregarTutores()
  }, [])

  const carregarTutores = async () => {
    try {
      const resposta = await fetch("/api/tutores")
      const dados = await resposta.json()
      setTutores(dados)
    } catch (erro) {
      console.error("Erro ao carregar tutores:", erro)
    } finally {
      setCarregando(false)
    }
  }

  const limparFormulario = () => {
    setNome("")
    setCargo("")
    setTelefone("")
    setEmail("")
    setEditando(null)
  }

  const abrirEdicao = (tutor: Tutor) => {
    setEditando(tutor)
    setNome(tutor.nome)
    setCargo(tutor.cargo)
    setTelefone(tutor.telefone || "")
    setEmail(tutor.email)
    setDialogAberto(true)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const dados = { nome, cargo, telefone, email }

    try {
      if (editando) {
        await fetch(`/api/tutores/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      } else {
        await fetch("/api/tutores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      }

      carregarTutores()
      setDialogAberto(false)
      limparFormulario()
    } catch (erro) {
      console.error("Erro ao salvar tutor:", erro)
    }
  }

  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este tutor?")) return

    try {
      await fetch(`/api/tutores/${id}`, { method: "DELETE" })
      carregarTutores()
    } catch (erro) {
      console.error("Erro ao excluir tutor:", erro)
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Novo Tutor</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-800">{editando ? "Editar Tutor" : "Novo Tutor"}</DialogTitle>
            </DialogHeader>
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

      {tutores.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhum tutor cadastrado</p>
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
            {tutores.map((tutor) => (
              <TableRow key={tutor.id} className="border-slate-200">
                <TableCell className="text-slate-800">{tutor.nome}</TableCell>
                <TableCell className="text-slate-600">{tutor.cargo}</TableCell>
                <TableCell className="text-slate-600">{tutor.telefone || "-"}</TableCell>
                <TableCell className="text-slate-600">{tutor.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => abrirEdicao(tutor)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExcluir(tutor.id)}
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

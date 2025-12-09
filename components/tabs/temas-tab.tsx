// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Aba de gerenciamento de Temas de Oficina
// =====================================================

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Interface para os dados do tema
interface Tema {
  id: number
  titulo: string
  descricao: string
  carga_horaria: number
}

// Componente da aba de Temas
// Permite listar, cadastrar, editar e excluir temas de oficinas
export default function TemasTab() {
  const [temas, setTemas] = useState<Tema[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [editando, setEditando] = useState<Tema | null>(null)
  const [carregando, setCarregando] = useState(true)

  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [cargaHoraria, setCargaHoraria] = useState("")

  useEffect(() => {
    carregarTemas()
  }, [])

  const carregarTemas = async () => {
    try {
      const resposta = await fetch("/api/temas")
      const dados = await resposta.json()
      setTemas(dados)
    } catch (erro) {
      console.error("Erro ao carregar temas:", erro)
    } finally {
      setCarregando(false)
    }
  }

  const limparFormulario = () => {
    setTitulo("")
    setDescricao("")
    setCargaHoraria("")
    setEditando(null)
  }

  const abrirEdicao = (tema: Tema) => {
    setEditando(tema)
    setTitulo(tema.titulo)
    setDescricao(tema.descricao || "")
    setCargaHoraria(tema.carga_horaria.toString())
    setDialogAberto(true)
  }

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault()
    const dados = { titulo, descricao, carga_horaria: Number.parseInt(cargaHoraria) }

    try {
      if (editando) {
        await fetch(`/api/temas/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      } else {
        await fetch("/api/temas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        })
      }

      carregarTemas()
      setDialogAberto(false)
      limparFormulario()
    } catch (erro) {
      console.error("Erro ao salvar tema:", erro)
    }
  }

  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este tema?")) return

    try {
      await fetch(`/api/temas/${id}`, { method: "DELETE" })
      carregarTemas()
    } catch (erro) {
      console.error("Erro ao excluir tema:", erro)
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Novo Tema</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-800">{editando ? "Editar Tema" : "Novo Tema"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSalvar} className="space-y-4">
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
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Carga Horária (horas)</Label>
                <Input
                  type="number"
                  min="1"
                  value={cargaHoraria}
                  onChange={(e) => setCargaHoraria(e.target.value)}
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

      {temas.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhum tema cadastrado</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-600">Título</TableHead>
              <TableHead className="text-slate-600">Descrição</TableHead>
              <TableHead className="text-slate-600">Carga Horária</TableHead>
              <TableHead className="text-slate-600 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {temas.map((tema) => (
              <TableRow key={tema.id} className="border-slate-200">
                <TableCell className="text-slate-800">{tema.titulo}</TableCell>
                <TableCell className="text-slate-600 max-w-xs truncate">{tema.descricao || "-"}</TableCell>
                <TableCell className="text-slate-600">{tema.carga_horaria}h</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => abrirEdicao(tema)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExcluir(tema.id)}
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

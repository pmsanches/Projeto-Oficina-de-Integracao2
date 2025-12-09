// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Aba de gerenciamento de Certificados
// =====================================================

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Interfaces para os dados
interface Oficina {
  id: number
  titulo: string
  alunos: { id: number; nome: string }[]
}

interface Certificado {
  id: number
  codigo: string
  data_emissao: string
  aluno_nome: string
  aluno_email: string
  oficina_titulo: string
  oficina_descricao: string
  tema_titulo: string
  carga_horaria: number
}

// Componente da aba de Certificados
// Permite gerar e visualizar certificados dos alunos
export default function CertificadosTab() {
  const [certificados, setCertificados] = useState<Certificado[]>([])
  const [oficinas, setOficinas] = useState<Oficina[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [dialogVisualizacao, setDialogVisualizacao] = useState(false)
  const [certificadoSelecionado, setCertificadoSelecionado] = useState<Certificado | null>(null)
  const [carregando, setCarregando] = useState(true)
  const certificadoRef = useRef<HTMLDivElement>(null)

  // Estado do formulário de geração
  const [oficinaId, setOficinaId] = useState("")
  const [alunoId, setAlunoId] = useState("")
  const [alunosDisponiveis, setAlunosDisponiveis] = useState<{ id: number; nome: string }[]>([])

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [certificadosRes, oficinasRes] = await Promise.all([fetch("/api/certificados"), fetch("/api/oficinas")])

      setCertificados(await certificadosRes.json())
      setOficinas(await oficinasRes.json())
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro)
    } finally {
      setCarregando(false)
    }
  }

  // Atualiza lista de alunos quando seleciona uma oficina
  useEffect(() => {
    if (oficinaId) {
      const oficina = oficinas.find((o) => o.id === Number.parseInt(oficinaId))
      setAlunosDisponiveis(oficina?.alunos || [])
      setAlunoId("")
    } else {
      setAlunosDisponiveis([])
    }
  }, [oficinaId, oficinas])

  const limparFormulario = () => {
    setOficinaId("")
    setAlunoId("")
    setAlunosDisponiveis([])
  }

  // Função para gerar certificado
  const handleGerar = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const resposta = await fetch("/api/certificados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aluno_id: Number.parseInt(alunoId),
          oficina_id: Number.parseInt(oficinaId),
        }),
      })

      if (!resposta.ok) {
        const erro = await resposta.json()
        alert(erro.erro || "Erro ao gerar certificado")
        return
      }

      carregarDados()
      setDialogAberto(false)
      limparFormulario()
    } catch (erro) {
      console.error("Erro ao gerar certificado:", erro)
    }
  }

  // Função para visualizar certificado
  const visualizarCertificado = (certificado: Certificado) => {
    setCertificadoSelecionado(certificado)
    setDialogVisualizacao(true)
  }

  // Função para imprimir certificado
  const imprimirCertificado = () => {
    const conteudo = certificadoRef.current
    if (!conteudo) return

    const janelaImpressao = window.open("", "_blank")
    if (!janelaImpressao) return

    janelaImpressao.document.write(`
      <html>
        <head>
          <title>Certificado - ELLP</title>
          <style>
            body { font-family: Georgia, serif; margin: 0; padding: 40px; }
            .certificado { border: 8px double #1e40af; padding: 60px; text-align: center; }
            .titulo { font-size: 32px; color: #1e40af; margin-bottom: 20px; }
            .subtitulo { font-size: 18px; color: #475569; margin-bottom: 40px; }
            .texto { font-size: 16px; color: #334155; line-height: 1.8; margin-bottom: 20px; }
            .nome { font-size: 28px; font-weight: bold; color: #1e40af; margin: 20px 0; }
            .oficina { font-size: 20px; font-style: italic; color: #334155; }
            .codigo { font-size: 12px; color: #64748b; margin-top: 40px; }
            .data { font-size: 14px; color: #475569; margin-top: 20px; }
          </style>
        </head>
        <body>
          ${conteudo.innerHTML}
        </body>
      </html>
    `)
    janelaImpressao.document.close()
    janelaImpressao.print()
  }

  // Função para excluir certificado
  const handleExcluir = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este certificado?")) return

    try {
      await fetch(`/api/certificados/${id}`, { method: "DELETE" })
      carregarDados()
    } catch (erro) {
      console.error("Erro ao excluir certificado:", erro)
    }
  }

  // Formata a data para exibição
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  if (carregando) {
    return <p className="text-slate-500 py-4">Carregando...</p>
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Dialog para gerar novo certificado */}
      <div className="flex justify-end">
        <Dialog
          open={dialogAberto}
          onOpenChange={(open) => {
            setDialogAberto(open)
            if (!open) limparFormulario()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Gerar Certificado</Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-slate-800">Gerar Certificado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleGerar} className="space-y-4">
              {/* Seleção de oficina */}
              <div className="space-y-2">
                <Label className="text-slate-700">Oficina</Label>
                <Select value={oficinaId} onValueChange={setOficinaId}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder="Selecione uma oficina" />
                  </SelectTrigger>
                  <SelectContent>
                    {oficinas.map((oficina) => (
                      <SelectItem key={oficina.id} value={oficina.id.toString()}>
                        {oficina.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seleção de aluno */}
              <div className="space-y-2">
                <Label className="text-slate-700">Aluno</Label>
                <Select value={alunoId} onValueChange={setAlunoId} disabled={!oficinaId}>
                  <SelectTrigger className="border-slate-300">
                    <SelectValue placeholder={oficinaId ? "Selecione um aluno" : "Selecione uma oficina primeiro"} />
                  </SelectTrigger>
                  <SelectContent>
                    {alunosDisponiveis.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id.toString()}>
                        {aluno.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!oficinaId || !alunoId}
              >
                Gerar Certificado
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Dialog para visualizar certificado */}
      <Dialog open={dialogVisualizacao} onOpenChange={setDialogVisualizacao}>
        <DialogContent className="bg-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-slate-800">Certificado</DialogTitle>
          </DialogHeader>
          {certificadoSelecionado && (
            <>
              {/* Template do certificado */}
              <div
                ref={certificadoRef}
                className="certificado border-8 border-double border-blue-600 p-12 text-center bg-white"
              >
                <h1 className="titulo text-3xl text-blue-600 font-serif mb-4">CERTIFICADO</h1>
                <p className="subtitulo text-lg text-slate-500 mb-8">Sistema ELLP - Controle de Oficinas</p>
                <p className="texto text-slate-600 mb-4">Certificamos que</p>
                <p className="nome text-2xl font-bold text-blue-600 my-4">{certificadoSelecionado.aluno_nome}</p>
                <p className="texto text-slate-600 mb-4">concluiu com êxito a oficina</p>
                <p className="oficina text-xl italic text-slate-700 mb-4">{certificadoSelecionado.oficina_titulo}</p>
                {certificadoSelecionado.tema_titulo && (
                  <p className="texto text-slate-600">Tema: {certificadoSelecionado.tema_titulo}</p>
                )}
                {certificadoSelecionado.carga_horaria && (
                  <p className="texto text-slate-600">Carga horária: {certificadoSelecionado.carga_horaria} horas</p>
                )}
                <p className="data text-slate-500 mt-8">
                  Emitido em {formatarData(certificadoSelecionado.data_emissao)}
                </p>
                <p className="codigo text-xs text-slate-400 mt-4">
                  Código de verificação: {certificadoSelecionado.codigo}
                </p>
              </div>
              <Button onClick={imprimirCertificado} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                Imprimir Certificado
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tabela de certificados */}
      {certificados.length === 0 ? (
        <p className="text-slate-500 text-center py-8">Nenhum certificado emitido</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200">
              <TableHead className="text-slate-600">Código</TableHead>
              <TableHead className="text-slate-600">Aluno</TableHead>
              <TableHead className="text-slate-600">Oficina</TableHead>
              <TableHead className="text-slate-600">Data Emissão</TableHead>
              <TableHead className="text-slate-600 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificados.map((certificado) => (
              <TableRow key={certificado.id} className="border-slate-200">
                <TableCell className="text-slate-600 font-mono text-sm">{certificado.codigo}</TableCell>
                <TableCell className="text-slate-800">{certificado.aluno_nome}</TableCell>
                <TableCell className="text-slate-600">{certificado.oficina_titulo}</TableCell>
                <TableCell className="text-slate-600">{formatarData(certificado.data_emissao)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => visualizarCertificado(certificado)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExcluir(certificado.id)}
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

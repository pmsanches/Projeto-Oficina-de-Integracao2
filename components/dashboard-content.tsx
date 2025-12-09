// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Conteúdo principal do Dashboard
// =====================================================

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfessoresTab from "@/components/tabs/professores-tab"
import TutoresTab from "@/components/tabs/tutores-tab"
import TemasTab from "@/components/tabs/temas-tab"
import AlunosTab from "@/components/tabs/alunos-tab"
import OficinasTab from "@/components/tabs/oficinas-tab"
import CertificadosTab from "@/components/tabs/certificados-tab"

// Interface para os dados do usuário logado
interface Usuario {
  id: number
  nome: string
  email: string
}

// Componente principal do dashboard
// Gerencia a navegação entre as diferentes seções do sistema
export default function DashboardContent() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const router = useRouter()

  // Verifica se o usuário está autenticado ao carregar a página
  useEffect(() => {
    verificarSessao()
  }, [])

  // Função para verificar a sessão do usuário
  const verificarSessao = async () => {
    try {
      const resposta = await fetch("/api/auth/sessao")
      const dados = await resposta.json()

      if (!dados.autenticado) {
        router.push("/")
        return
      }

      setUsuario(dados.usuario)
    } catch {
      router.push("/")
    } finally {
      setCarregando(false)
    }
  }

  // Função para fazer logout
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  // Exibe loading enquanto verifica a sessão
  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Cabeçalho do dashboard */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">ELLP</h1>
              <p className="text-sm text-slate-500">Sistema de Controle de Oficinas</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">Olá, {usuario?.nome}</span>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal com abas */}
      <main className="max-w-7xl mx-auto p-6">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Gerenciamento</CardTitle>
            <CardDescription className="text-slate-500">
              Gerencie professores, tutores, alunos, temas, oficinas e certificados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Abas de navegação entre as seções */}
            <Tabs defaultValue="oficinas" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-slate-100">
                <TabsTrigger value="oficinas" className="data-[state=active]:bg-white">
                  Oficinas
                </TabsTrigger>
                <TabsTrigger value="professores" className="data-[state=active]:bg-white">
                  Professores
                </TabsTrigger>
                <TabsTrigger value="tutores" className="data-[state=active]:bg-white">
                  Tutores
                </TabsTrigger>
                <TabsTrigger value="alunos" className="data-[state=active]:bg-white">
                  Alunos
                </TabsTrigger>
                <TabsTrigger value="temas" className="data-[state=active]:bg-white">
                  Temas
                </TabsTrigger>
                <TabsTrigger value="certificados" className="data-[state=active]:bg-white">
                  Certificados
                </TabsTrigger>
              </TabsList>

              {/* Conteúdo de cada aba */}
              <TabsContent value="oficinas">
                <OficinasTab />
              </TabsContent>
              <TabsContent value="professores">
                <ProfessoresTab />
              </TabsContent>
              <TabsContent value="tutores">
                <TutoresTab />
              </TabsContent>
              <TabsContent value="alunos">
                <AlunosTab />
              </TabsContent>
              <TabsContent value="temas">
                <TemasTab />
              </TabsContent>
              <TabsContent value="certificados">
                <CertificadosTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

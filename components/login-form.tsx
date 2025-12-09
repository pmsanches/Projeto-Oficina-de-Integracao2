// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Componente de formulário de login
// =====================================================

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Componente do formulário de login
// Permite que o gerente de oficinas acesse o sistema
export default function LoginForm() {
  // Estados para controlar o formulário
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  // Função para processar o login
  // Envia as credenciais para a API e redireciona se bem-sucedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro("")
    setCarregando(true)

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || "Erro ao fazer login")
        return
      }

      // Redireciona para o dashboard após login bem-sucedido
      router.push("/dashboard")
    } catch {
      setErro("Erro de conexão. Tente novamente.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        {/* Logo e título do sistema */}
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">E</span>
        </div>
        <CardTitle className="text-2xl font-bold text-slate-800">ELLP</CardTitle>
        <CardDescription className="text-slate-600">Sistema de Controle de Oficinas</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo de email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-slate-300"
            />
          </div>

          {/* Campo de senha */}
          <div className="space-y-2">
            <Label htmlFor="senha" className="text-slate-700">
              Senha
            </Label>
            <Input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="border-slate-300"
            />
          </div>

          {/* Mensagem de erro */}
          {erro && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{erro}</p>}

          {/* Botão de login */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </Button>

          {/* Credenciais de teste */}
          <p className="text-xs text-center text-slate-500 mt-4">Credenciais de teste: admin@ellp.com / admin123</p>
        </form>
      </CardContent>
    </Card>
  )
}

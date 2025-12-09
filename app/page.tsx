// =====================================================
// ELLP - Sistema de Controle de Oficinas
// Página de Login - Ponto de entrada do sistema
// =====================================================

import LoginForm from "@/components/login-form"

// Página principal que exibe o formulário de login
export default function PaginaLogin() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <LoginForm />
    </main>
  )
}

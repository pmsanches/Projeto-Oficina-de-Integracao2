// ========================================
// IGOR: Página Home/Dashboard Principal
// Descrição: Exibe a página inicial do sistema com informações gerais
// ========================================

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { BookOpen, Users, Award, FileText } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-12 mx-auto mb-4" />}
              <CardTitle className="text-2xl">{APP_TITLE}</CardTitle>
              <CardDescription>Sistema de Controle de Oficinas - ELLP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Bem-vindo ao sistema de gerenciamento de oficinas do projeto ELLP. Faça login para continuar.
              </p>
              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="w-full"
                size="lg"
              >
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bem-vindo, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Sistema de Controle de Oficinas - ELLP</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation("/dashboard/temas")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Temas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-gray-600">Gerenciar temas de oficinas</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation("/dashboard/professores")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-green-600" />
              Professores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-gray-600">Gerenciar professores</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation("/dashboard/alunos")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-purple-600" />
              Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-gray-600">Gerenciar alunos</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setLocation("/dashboard/certificados")}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-yellow-600" />
              Certificados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">-</p>
            <p className="text-sm text-gray-600">Gerar certificados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Funcionalidades Principais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              1
            </div>
            <div>
              <p className="font-semibold">Cadastro de Temas</p>
              <p className="text-sm text-gray-600">Crie e gerencie os temas das oficinas</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              2
            </div>
            <div>
              <p className="font-semibold">Cadastro de Participantes</p>
              <p className="text-sm text-gray-600">Registre professores, tutores e alunos</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              3
            </div>
            <div>
              <p className="font-semibold">Gerenciamento de Oficinas</p>
              <p className="text-sm text-gray-600">Crie oficinas e associe participantes</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 text-yellow-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
              4
            </div>
            <div>
              <p className="font-semibold">Emissão de Certificados</p>
              <p className="text-sm text-gray-600">Gere certificados em PDF para os alunos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

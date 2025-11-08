// ========================================
// IGOR: Página de Listagem de Alunos
// Descrição: Exibe lista de alunos e permite criar, editar e deletar alunos
// ========================================

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AlunosList() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nome: "", telefone: "", email: "" });

  const { data: alunos, isLoading, refetch } = trpc.alunos.list.useQuery();
  const createMutation = trpc.alunos.create.useMutation();
  const updateMutation = trpc.alunos.update.useMutation();
  const deleteMutation = trpc.alunos.delete.useMutation();

  const handleSubmit = async () => {
    if (!formData.nome || !formData.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        toast.success("Aluno atualizado com sucesso");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Aluno criado com sucesso");
      }
      setIsOpen(false);
      setFormData({ nome: "", telefone: "", email: "" });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar aluno");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este aluno?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Aluno deletado com sucesso");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar aluno");
      }
    }
  };

  const handleEdit = (aluno: any) => {
    setEditingId(aluno.id);
    setFormData({ nome: aluno.nome, telefone: aluno.telefone || "", email: aluno.email });
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alunos</h1>
          <p className="text-gray-600">Gerencie os alunos que participam das oficinas</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({ nome: "", telefone: "", email: "" }); setIsOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Aluno
        </Button>
      </div>

      <div className="grid gap-4">
        {alunos && alunos.length > 0 ? (
          alunos.map((aluno: any) => (
            <Card key={aluno.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{aluno.nome}</CardTitle>
                    <CardDescription>Aluno</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(aluno)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(aluno.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Email: {aluno.email}</p>
                {aluno.telefone && <p className="text-sm text-gray-600">Telefone: {aluno.telefone}</p>}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Nenhum aluno cadastrado. Clique em "Novo Aluno" para começar.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Aluno" : "Novo Aluno"}</DialogTitle>
            <DialogDescription>Preencha os dados do aluno</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Salvando...</>
                ) : (
                  "Salvar"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

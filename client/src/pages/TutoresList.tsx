// ========================================
// IGOR: Página de Listagem de Tutores
// Descrição: Exibe lista de tutores e permite criar, editar e deletar tutores
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

export default function TutoresList() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nome: "", telefone: "", email: "" });

  const { data: tutores, isLoading, refetch } = trpc.tutores.list.useQuery();
  const createMutation = trpc.tutores.create.useMutation();
  const updateMutation = trpc.tutores.update.useMutation();
  const deleteMutation = trpc.tutores.delete.useMutation();

  const handleSubmit = async () => {
    if (!formData.nome || !formData.email) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        toast.success("Tutor atualizado com sucesso");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Tutor criado com sucesso");
      }
      setIsOpen(false);
      setFormData({ nome: "", telefone: "", email: "" });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar tutor");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este tutor?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Tutor deletado com sucesso");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar tutor");
      }
    }
  };

  const handleEdit = (tutor: any) => {
    setEditingId(tutor.id);
    setFormData({ nome: tutor.nome, telefone: tutor.telefone || "", email: tutor.email });
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
          <h1 className="text-3xl font-bold">Tutores</h1>
          <p className="text-gray-600">Gerencie os tutores que auxiliam nas oficinas</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({ nome: "", telefone: "", email: "" }); setIsOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Tutor
        </Button>
      </div>

      <div className="grid gap-4">
        {tutores && tutores.length > 0 ? (
          tutores.map((tutor: any) => (
            <Card key={tutor.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{tutor.nome}</CardTitle>
                    <CardDescription>Tutor</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tutor)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(tutor.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Email: {tutor.email}</p>
                {tutor.telefone && <p className="text-sm text-gray-600">Telefone: {tutor.telefone}</p>}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Nenhum tutor cadastrado. Clique em "Novo Tutor" para começar.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Tutor" : "Novo Tutor"}</DialogTitle>
            <DialogDescription>Preencha os dados do tutor</DialogDescription>
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

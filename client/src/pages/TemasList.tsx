// ========================================
// IGOR: Página de Listagem de Temas
// Descrição: Exibe lista de temas e permite criar, editar e deletar temas
// ========================================

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function TemasList() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ titulo: "", descricao: "", cargaHoraria: 0 });

  const { data: temas, isLoading, refetch } = trpc.temas.list.useQuery();
  const createMutation = trpc.temas.create.useMutation();
  const updateMutation = trpc.temas.update.useMutation();
  const deleteMutation = trpc.temas.delete.useMutation();

  const handleSubmit = async () => {
    if (!formData.titulo || formData.cargaHoraria <= 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        toast.success("Tema atualizado com sucesso");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Tema criado com sucesso");
      }
      setIsOpen(false);
      setFormData({ titulo: "", descricao: "", cargaHoraria: 0 });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar tema");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este tema?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Tema deletado com sucesso");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar tema");
      }
    }
  };

  const handleEdit = (tema: any) => {
    setEditingId(tema.id);
    setFormData({ titulo: tema.titulo, descricao: tema.descricao || "", cargaHoraria: tema.cargaHoraria });
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
          <h1 className="text-3xl font-bold">Temas de Oficinas</h1>
          <p className="text-gray-600">Gerencie os temas disponíveis para as oficinas</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({ titulo: "", descricao: "", cargaHoraria: 0 }); setIsOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Tema
        </Button>
      </div>

      <div className="grid gap-4">
        {temas && temas.length > 0 ? (
          temas.map((tema: any) => (
            <Card key={tema.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{tema.titulo}</CardTitle>
                    <CardDescription>{tema.descricao}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(tema)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(tema.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Carga Horária: {tema.cargaHoraria} horas</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Nenhum tema cadastrado. Clique em "Novo Tema" para começar.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Tema" : "Novo Tema"}</DialogTitle>
            <DialogDescription>Preencha os dados do tema</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ex: Introdução a Python"
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição do tema"
              />
            </div>
            <div>
              <Label htmlFor="cargaHoraria">Carga Horária (horas)</Label>
              <Input
                id="cargaHoraria"
                type="number"
                value={formData.cargaHoraria}
                onChange={(e) => setFormData({ ...formData, cargaHoraria: parseInt(e.target.value) || 0 })}
                placeholder="Ex: 20"
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

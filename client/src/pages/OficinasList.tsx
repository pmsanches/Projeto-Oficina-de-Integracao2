// ========================================
// IGOR: Página de Listagem de Oficinas
// Descrição: Exibe lista de oficinas e permite criar, editar e deletar oficinas
// ========================================

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OficinasList() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ titulo: "", descricao: "", temaId: 0 });

  const { data: oficinas, isLoading, refetch } = trpc.oficinas.list.useQuery();
  const { data: temas } = trpc.temas.list.useQuery();
  const createMutation = trpc.oficinas.create.useMutation();
  const updateMutation = trpc.oficinas.update.useMutation();
  const deleteMutation = trpc.oficinas.delete.useMutation();

  const handleSubmit = async () => {
    if (!formData.titulo || formData.temaId <= 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        toast.success("Oficina atualizada com sucesso");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Oficina criada com sucesso");
      }
      setIsOpen(false);
      setFormData({ titulo: "", descricao: "", temaId: 0 });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar oficina");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar esta oficina?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Oficina deletada com sucesso");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar oficina");
      }
    }
  };

  const handleEdit = (oficina: any) => {
    setEditingId(oficina.id);
    setFormData({ titulo: oficina.titulo, descricao: oficina.descricao || "", temaId: oficina.temaId });
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
          <h1 className="text-3xl font-bold">Oficinas</h1>
          <p className="text-gray-600">Gerencie as oficinas oferecidas</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({ titulo: "", descricao: "", temaId: 0 }); setIsOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Oficina
        </Button>
      </div>

      <div className="grid gap-4">
        {oficinas && oficinas.length > 0 ? (
          oficinas.map((oficina: any) => (
            <Card key={oficina.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{oficina.titulo}</CardTitle>
                    <CardDescription>{oficina.descricao}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(oficina)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(oficina.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Tema ID: {oficina.temaId}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Nenhuma oficina cadastrada. Clique em "Nova Oficina" para começar.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Oficina" : "Nova Oficina"}</DialogTitle>
            <DialogDescription>Preencha os dados da oficina</DialogDescription>
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
                placeholder="Descrição da oficina"
              />
            </div>
            <div>
              <Label htmlFor="temaId">Tema</Label>
              <Select value={String(formData.temaId)} onValueChange={(value) => setFormData({ ...formData, temaId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  {temas && temas.map((tema: any) => (
                    <SelectItem key={tema.id} value={String(tema.id)}>
                      {tema.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

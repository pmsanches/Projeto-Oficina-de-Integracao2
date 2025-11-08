// ========================================
// IGOR: Página de Listagem de Certificados
// Descrição: Exibe lista de certificados e permite criar, editar e deletar certificados
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
import { Plus, Edit2, Trash2, Loader2, Download } from "lucide-react";
import { toast } from "sonner";

export default function CertificadosList() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ alunoId: 0, oficinaId: 0, descricao: "", cargaHoraria: 0 });

  const { data: certificados, isLoading, refetch } = trpc.certificados.list.useQuery();
  const { data: alunos } = trpc.alunos.list.useQuery();
  const { data: oficinas } = trpc.oficinas.list.useQuery();
  const createMutation = trpc.certificados.create.useMutation();
  const updateMutation = trpc.certificados.update.useMutation();
  const deleteMutation = trpc.certificados.delete.useMutation();

  const handleSubmit = async () => {
    if (formData.alunoId <= 0 || formData.oficinaId <= 0 || formData.cargaHoraria <= 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: formData });
        toast.success("Certificado atualizado com sucesso");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Certificado criado com sucesso");
      }
      setIsOpen(false);
      setFormData({ alunoId: 0, oficinaId: 0, descricao: "", cargaHoraria: 0 });
      setEditingId(null);
      refetch();
    } catch (error) {
      toast.error("Erro ao salvar certificado");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este certificado?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Certificado deletado com sucesso");
        refetch();
      } catch (error) {
        toast.error("Erro ao deletar certificado");
      }
    }
  };

  const handleEdit = (certificado: any) => {
    setEditingId(certificado.id);
    setFormData({ alunoId: certificado.alunoId, oficinaId: certificado.oficinaId, descricao: certificado.descricao || "", cargaHoraria: certificado.cargaHoraria });
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
          <h1 className="text-3xl font-bold">Certificados</h1>
          <p className="text-gray-600">Gerencie os certificados emitidos para os alunos</p>
        </div>
        <Button onClick={() => { setEditingId(null); setFormData({ alunoId: 0, oficinaId: 0, descricao: "", cargaHoraria: 0 }); setIsOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Certificado
        </Button>
      </div>

      <div className="grid gap-4">
        {certificados && certificados.length > 0 ? (
          certificados.map((certificado: any) => (
            <Card key={certificado.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Certificado #{certificado.id}</CardTitle>
                    <CardDescription>{certificado.descricao}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(certificado)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(certificado.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Aluno ID: {certificado.alunoId}</p>
                <p className="text-sm text-gray-600">Oficina ID: {certificado.oficinaId}</p>
                <p className="text-sm text-gray-600">Carga Horária: {certificado.cargaHoraria} horas</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Nenhum certificado cadastrado. Clique em "Novo Certificado" para começar.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar Certificado" : "Novo Certificado"}</DialogTitle>
            <DialogDescription>Preencha os dados do certificado</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="alunoId">Aluno</Label>
              <Select value={String(formData.alunoId)} onValueChange={(value) => setFormData({ ...formData, alunoId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos && alunos.map((aluno: any) => (
                    <SelectItem key={aluno.id} value={String(aluno.id)}>
                      {aluno.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="oficinaId">Oficina</Label>
              <Select value={String(formData.oficinaId)} onValueChange={(value) => setFormData({ ...formData, oficinaId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma oficina" />
                </SelectTrigger>
                <SelectContent>
                  {oficinas && oficinas.map((oficina: any) => (
                    <SelectItem key={oficina.id} value={String(oficina.id)}>
                      {oficina.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descrição do certificado"
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

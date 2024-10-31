import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Briefcase, DollarSign } from "lucide-react";
import { toast } from "sonner";

import {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} from "@/redux/slices/client.api.slice";

interface ClientFormData {
  nom: string;
  email: string;
}

export const Dashboard: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({
    nom: "",
    email: "",
  });

  const {
    data: clients = [],
    isLoading,
    isError,
  } = useGetClientsQuery();
  
  const [createClient, { isLoading: isCreating }] = useCreateClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedClient) {
        await updateClient({
          id: selectedClient,
          data: formData,
        }).unwrap();
        toast.success("Client modifié avec succès");
      } else {
        await createClient(formData).unwrap();
        toast.success("Client créé avec succès");
      }
      resetForm();
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error("Erreur lors de l'opération:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClient(id).unwrap();
      toast.success("Client supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client.id);
    setFormData({
      nom: client.nom,
      email: client.email || "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ nom: "", email: "" });
    setSelectedClient(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (isError) {
    return <div className="p-6">Erreur lors du chargement des clients</div>;
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      dateStyle: "medium",
    });
  };

  // Calcul des métriques
  const totalSessions = clients.reduce(
    (acc, client) => acc + (client.sessions?.length || 0),
    0
  );

  const totalRevenue = clients.reduce((acc, client) => {
    const sessionRevenue = client.sessions?.reduce(
      (sum, session) => sum + (session.montantTotal || 0),
      0
    ) || 0;
    return acc + sessionRevenue;
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenu Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-background rounded-md border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Clients</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter un Client</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {selectedClient ? "Modifier le Client" : "Ajouter un Client"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedClient
                      ? "Modifier les informations du client"
                      : "Ajouter un nouveau client à votre tableau de bord"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="nom" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="nom"
                      className="col-span-3"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="col-span-3"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isCreating || isUpdating}
                  >
                    {isCreating || isUpdating ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Dernière mise à jour</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.nom}</TableCell>
                <TableCell>{client.email || "-"}</TableCell>
                <TableCell>{formatDate(client.createdAt)}</TableCell>
                <TableCell>{formatDate(client.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(client)}
                      disabled={isDeleting}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(client.id)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Suppression..." : "Supprimer"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
import React, { useState } from "react";
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
import {
  useGetSessionsQuery,
  useDeleteSessionMutation,
  useUpdateSessionMutation,
} from "@/redux/slices/session.api.slice";

interface ApiSession {
  id: string;
  debutSession: string;
  finSession?: string;
  duree?: number;
  tarifHoraire: number;
  montantTotal: number;
  client?: {
    name: string;
  };
}

interface Session {
  id: string;
  debutSession: Date;
  finSession?: Date;
  duree?: number;
  tarifHoraire: number;
  montantTotal: number;
  client?: {
    name: string;
  };
}

interface SessionFormData {
  client: string;
  service: string;
  date: string;
}

export const Session: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [formData, setFormData] = useState<SessionFormData>({
    client: "",
    service: "",
    date: "",
  });

  const {
    data: apiSessions = [],
    isLoading,
    isError,
    refetch,
  } = useGetSessionsQuery();

  const [updateSession] = useUpdateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const sessions: Session[] = apiSessions.map((session: ApiSession) => ({
    ...session,
    debutSession: new Date(session.debutSession),
    finSession: session.finSession ? new Date(session.finSession) : undefined,
  }));

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
      if (selectedSession) {
        await updateSession({
          id: selectedSession,
          data: formData,
        }).unwrap();
        console.log("Session modifiée avec succès");
      } else {
        console.log("Nouvelle session créée");
      }
      resetForm();
      await refetch();
    } catch (error) {
      console.error("Erreur lors de l'opération:", error);
    }
  };

  const handleEdit = (session: Session) => {
    setSelectedSession(session.id);
    setFormData({
      client: session.client?.name || "",
      service: "", // Remplacez par la logique appropriée pour récupérer le service
      date: session.debutSession.toISOString().slice(0, 16),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id).unwrap();
      console.log("Session supprimée avec succès");
      await refetch();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const resetForm = () => {
    setFormData({ client: "", service: "", date: "" });
    setSelectedSession(null);
    setIsDialogOpen(false);
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (isLoading) {
    return <div className="p-6">Chargement...</div>;
  }

  if (isError) {
    return <div className="p-6">Erreur lors du chargement des sessions</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-background rounded-md border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Sessions</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter une Session</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {selectedSession
                      ? "Modifier la Session"
                      : "Ajouter une Session"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedSession
                      ? "Modifier les détails de la session."
                      : "Programmer une nouvelle session."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client" className="text-right">
                      Client
                    </Label>
                    <Input
                      id="client"
                      className="col-span-3"
                      value={formData.client}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="service" className="text-right">
                      Service
                    </Label>
                    <Input
                      id="service"
                      className="col-span-3"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      className="col-span-3"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {selectedSession ? "Modifier" : "Enregistrer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Début de Session</TableHead>
              <TableHead>Fin de Session</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Tarif Horaire</TableHead>
              <TableHead>Montant Total</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((session: Session) => (
              <TableRow key={session.id}>
                <TableCell>
                  {session.client?.name || "Client Inconnu"}
                </TableCell>
                <TableCell>{formatDate(session.debutSession)}</TableCell>
                <TableCell>
                  {session.finSession
                    ? formatDate(session.finSession)
                    : "En cours"}
                </TableCell>
                <TableCell>
                  {session.duree ? `${session.duree} minutes` : "N/A"}
                </TableCell>
                <TableCell>{session.tarifHoraire.toFixed(2)} €/heure</TableCell>
                <TableCell>{session.montantTotal.toFixed(2)} €</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(session)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(session.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

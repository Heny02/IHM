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
import { toast } from "sonner";
import {
  useGetServicesQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} from "@/redux/slices/service.api.slice";

interface ServiceFormData {
  name: string;
  price: string;
  duration: string;
}

export const Service: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    price: "",
    duration: "",
  });

  const { data: services = [], isLoading, isError } = useGetServicesQuery();
  const [createService] = useCreateServiceMutation();
  const [updateService] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();

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
      if (selectedService) {
        await updateService({
          id: selectedService,
          data: formData,
        }).unwrap();
        toast.success("Service modifié avec succès");
      } else {
        await createService(formData).unwrap();
        toast.success("Service créé avec succès");
      }
      resetForm();
    } catch (error) {
      toast.error("Une erreur est survenue");
      console.error("Erreur lors de l'opération:", error);
    }
  };

  const handleDelete = async () => {
    if (selectedService) {
      try {
        await deleteService(selectedService).unwrap();
        toast.success("Service supprimé avec succès");
        setIsConfirmDeleteOpen(false);
      } catch (error) {
        toast.error("Erreur lors de la suppression");
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleEdit = (service: any) => {
    setSelectedService(service.id);
    setFormData({
      name: service.name,
      price: service.price || "",
      duration: service.duration || "",
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (serviceId: string) => {
    setSelectedService(serviceId);
    setIsConfirmDeleteOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", duration: "" });
    setSelectedService(null);
    setIsDialogOpen(false);
    setIsConfirmDeleteOpen(false);
  };

  if (isLoading) {
    return <div className="p-6">Chargement des services...</div>;
  }

  if (isError) {
    return <div className="p-6">Erreur lors du chargement des services</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-background rounded-md border">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold">Services</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Ajouter un Service</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {selectedService
                      ? "Modifier le Service"
                      : "Ajouter un Service"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedService
                      ? "Modifier les informations du service"
                      : "Ajouter un nouveau service à votre liste"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nom
                    </Label>
                    <Input
                      id="name"
                      className="col-span-3"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Prix
                    </Label>
                    <Input
                      id="price"
                      className="col-span-3"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">
                      Durée
                    </Label>
                    <Input
                      id="duration"
                      className="col-span-3"
                      value={formData.duration}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {selectedService ? "Modifier" : "Enregistrer"}
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
              <TableHead>Prix</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDelete(service.id)}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog
          open={isConfirmDeleteOpen}
          onOpenChange={setIsConfirmDeleteOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce service ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsConfirmDeleteOpen(false)}
              >
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

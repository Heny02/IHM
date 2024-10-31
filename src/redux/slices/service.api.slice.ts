import apiSlice from "./apiSlice";

interface Service {
  id: string;
  debutSession: string; // format DateTime
  finSession?: string; // format DateTime, optionnel
  duree?: number; // en minutes
  tarifHoraire: number; // tarif par heure
  montantTotal: number; // montant calculé
  clientId: string;
  createdAt: string; // format DateTime
  updatedAt: string; // format DateTime
  services: Service[]; // Liste des services associés à la session
}

const serviceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => ({
        url: "/api/service",
      }),
    }),

    getServiceById: builder.query<Service, string>({
      query: (id: string) => ({
        url: `/api/service/${id}`,
      }),
    }),

    createService: builder.mutation<Service, Partial<Service>>({
      query: (data) => ({
        url: "/api/service",
        method: "POST",
        body: data,
      }),
    }),

    updateService: builder.mutation<
      void,
      { id: string; data: Partial<Service> }
    >({
      query: ({ data, id }) => ({
        url: `/api/service/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteService: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/service/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetServicesQuery,
  useGetServiceByIdQuery,
} = serviceApiSlice;

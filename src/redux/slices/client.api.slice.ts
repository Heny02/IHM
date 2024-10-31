import apiSlice from "./apiSlice";

interface Session {
  id: string;
  montantTotal: number;
  // Autres propriétés de session si nécessaire
}

interface Client {
  id: string;
  nom: string;
  email: string | null;
  sessions: Session[];
  createdAt: string;
  updatedAt: string;
}

interface ClientCreateInput {
  nom: string;
  email?: string;
}

const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => ({
        url: "/api/client",
      }),
    }),

    getClientById: builder.query<Client, string>({
      query: (id: string) => ({
        url: `/api/client/${id}`,
      }),
    }),

    createClient: builder.mutation<Client, ClientCreateInput>({
      query: (data) => ({
        url: "/api/client",
        method: "POST",
        body: data,
      }),

    }),

    updateClient: builder.mutation<Client, { id: string; data: Partial<ClientCreateInput> }>({
      query: ({ id, data }) => ({
        url: `/api/client/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteClient: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/client/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientsQuery,
  useGetClientByIdQuery,
} = clientApiSlice;
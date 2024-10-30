import apiSlice from "./apiSlice";

interface Utilisateur {
  id: string;
  name: string;
  email: string;
  // Ajoutez d'autres propriétés de l'utilisateur ici
}

const utilisateurApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUtilisateurs: builder.query<Utilisateur[], void>({
      query: () => ({
        url: "/api/utilisateur",
      }),
    }),

    getUtilisateurById: builder.query<Utilisateur, string>({
      query: (id: string) => ({
        url: `/api/utilisateur/${id}`,
      }),
    }),

    createUtilisateur: builder.mutation<Utilisateur, Partial<Utilisateur>>({
      query: (data) => ({
        url: "/api/utilisateur",
        method: "POST",
        body: data,
      }),
    }),

    updateUtilisateur: builder.mutation<
      void,
      { id: string; data: Partial<Utilisateur> }
    >({
      query: ({ data, id }) => ({
        url: `/api/utilisateur/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteUtilisateur: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/utilisateur/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateUtilisateurMutation,
  useUpdateUtilisateurMutation,
  useDeleteUtilisateurMutation,
  useGetUtilisateursQuery,
  useGetUtilisateurByIdQuery,
} = utilisateurApiSlice;

import apiSlice from "./apiSlice";

interface Session {
  id: string;
  debutSession: string; // Date sous forme de string
  finSession?: string;
  duree?: number;
  tarifHoraire: number;
  montantTotal: number;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

const sessionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<Session[], void>({
      query: () => ({
        url: "/api/session",
      }),
    }),

    getSessionById: builder.query<Session, string>({
      query: (id: string) => ({
        url: `/api/session/${id}`,
      }),
    }),

    createSession: builder.mutation<Session, Partial<Session>>({
      query: (data) => ({
        url: "/api/session",
        method: "POST",
        body: data,
      }),
    }),

    updateSession: builder.mutation<
      void,
      { id: string; data: Partial<Session> }
    >({
      query: ({ data, id }) => ({
        url: `/api/session/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteSession: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/session/${id}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false, // Évite d'écraser les endpoints existants
});

export const {
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useGetSessionsQuery,
  useGetSessionByIdQuery,
} = sessionApiSlice;

export default sessionApiSlice;

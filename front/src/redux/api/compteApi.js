import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../utils/env.dev";

export const compteApi = createApi({
  reducerPath: "compteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.urlBackend,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Compte"],
  endpoints: (builder) => ({
    // Récupérer tous les comptes
    getComptes: builder.query({
      query: () => "/comptes",
      providesTags: ["Compte"],
    }),

    // Récupérer un compte par ID
    getCompteById: builder.query({
      query: (id) => `/comptes/${id}`,
      providesTags: (result, error, id) => [{ type: "Compte", id }],
    }),

    // Créer un nouveau compte
    createCompte: builder.mutation({
      query: (data) => ({
        url: "/comptes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Compte"],
    }),

    // Mettre à jour un compte
    updateCompte: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/comptes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Compte", id },
        "Compte",
      ],
    }),

    // Supprimer un compte
    deleteCompte: builder.mutation({
      query: (id) => ({
        url: `/comptes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Compte"],
    }),

    // Mettre à jour le tag d'un compte
    updateCompteTag: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/comptes/tag/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Compte", id },
        "Compte",
      ],
    }),

    // Activer/Désactiver un compte
    activeCompte: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/comptes/active/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Compte", id },
        "Compte",
      ],
    }),
  }),
});

export const {
  useGetComptesQuery,
  useGetCompteByIdQuery,
  useCreateCompteMutation,
  useUpdateCompteMutation,
  useDeleteCompteMutation,
  useUpdateCompteTagMutation,
  useActiveCompteMutation,
} = compteApi;

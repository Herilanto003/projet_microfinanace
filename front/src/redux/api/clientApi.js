import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../utils/env.dev";

export const clientApi = createApi({
  reducerPath: "clientApi",
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
  tagTypes: ["Client"],
  endpoints: (builder) => ({
    // Récupérer tous les clients
    getClients: builder.query({
      query: () => "/clients",
      providesTags: ["Client"],
    }),

    // Récupérer un client par ID
    getClientById: builder.query({
      query: (id) => `/clients/${id}`,
      providesTags: (result, error, id) => [{ type: "Client", id }],
    }),

    // Créer un nouveau client
    createClient: builder.mutation({
      query: (data) => ({
        url: "/clients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Client"],
    }),

    // Mettre à jour un client
    updateClient: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/clients/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Client", id },
        "Client",
      ],
    }),

    // Supprimer un client
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Client"],
    }),

    // Mettre à jour le tag d'un client
    updateClientTag: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/clients/tag/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Client", id },
        "Client",
      ],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useUpdateClientTagMutation,
} = clientApi;

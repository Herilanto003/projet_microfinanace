import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../utils/env.dev";

export const pretApi = createApi({
  reducerPath: "pretApi",
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
  tagTypes: ["Pret"],
  endpoints: (builder) => ({
    // Récupérer tous les prêts
    getPrets: builder.query({
      query: () => "/prets",
      providesTags: ["Pret"],
    }),

    // Récupérer un prêt par ID
    getPretById: builder.query({
      query: (id) => `/prets/${id}`,
      providesTags: (result, error, id) => [{ type: "Pret", id }],
    }),

    // Créer un nouveau prêt
    createPret: builder.mutation({
      query: (data) => ({
        url: "/prets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Pret"],
    }),

    // Mettre à jour un prêt
    updatePret: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/prets/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Pret", id },
        "Pret",
      ],
    }),

    // Supprimer un prêt
    deletePret: builder.mutation({
      query: (id) => ({
        url: `/prets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pret"],
    }),

    // Récupérer les prêts entre deux dates
    getPretEntreDeuxDates: builder.query({
      query: ({ startDate, endDate }) =>
        `/prets/entre-deux-dates/${startDate}/${endDate}`,
      providesTags: ["Pret"],
    }),

    // Récupérer les prêts par client
    getPretParClient: builder.query({
      query: (clientId) => `/prets/par-client/${clientId}`,
      providesTags: (result, error, clientId) => [{ type: "Pret", clientId }],
    }),

    // Récupérer les prêts par client entre deux dates
    getPretParClientEntreDeuxDates: builder.query({
      query: ({ clientId, startDate, endDate }) =>
        `/prets/par-client/entre-deux-dates/${clientId}/${startDate}/${endDate}`,
      providesTags: (result, error, { clientId }) => [
        { type: "Pret", clientId },
      ],
    }),

    // Approuver un prêt
    approuvePret: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/prets/approuver/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Pret", id },
        "Pret",
      ],
    }),
  }),
});

export const {
  useGetPretsQuery,
  useGetPretByIdQuery,
  useCreatePretMutation,
  useUpdatePretMutation,
  useDeletePretMutation,
  useGetPretEntreDeuxDatesQuery,
  useGetPretParClientQuery,
  useGetPretParClientEntreDeuxDatesQuery,
  useApprouvePretMutation,
} = pretApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../utils/env.dev";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
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
  tagTypes: ["Transaction", "Historique"],
  endpoints: (builder) => ({
    // Récupérer toutes les transactions
    getAllTransactions: builder.query({
      query: () => "/transactions",
      providesTags: ["Transaction"],
    }),

    // Sauvegarder une transaction
    saveTransaction: builder.mutation({
      query: (data) => ({
        url: "/transactions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Transaction", "Historique"],
    }),

    // Récupérer les informations d'une transaction
    getInfoTransaction: builder.query({
      query: (id) => `/transactions/info/${id}`,
      providesTags: (result, error, id) => [{ type: "Transaction", id }],
    }),

    // Récupérer tous les historiques de transactions
    getAllHistoriquesTransactions: builder.query({
      query: () => "/transactions/historiques/",
      providesTags: ["Historique"],
    }),

    // Récupérer les historiques entre deux dates
    getHistoriquesBetweenTwoDates: builder.query({
      query: ({ startDate, endDate }) =>
        `/transactions/historiques/between-two-dates/${startDate}/${endDate}`,
      providesTags: ["Historique"],
    }),

    // Récupérer les historiques par compte
    getHistoriquesParCompte: builder.query({
      query: (id) => `/transactions/historiques/par-compte/${id}`,
      providesTags: (result, error, id) => [{ type: "Historique", id }],
    }),

    // Récupérer les historiques par compte avant une date
    getHistoriquesParCompteAvantDate: builder.query({
      query: ({ id, date }) =>
        `/transactions/historiques/par-compte-avant-date/${id}/${date}`,
      providesTags: (result, error, { id }) => [{ type: "Historique", id }],
    }),

    // Récupérer les historiques par compte après une date
    getHistoriquesParCompteApresDate: builder.query({
      query: ({ id, date }) =>
        `/transactions/historiques/par-compte-apres-date/${id}/${date}`,
      providesTags: (result, error, { id }) => [{ type: "Historique", id }],
    }),

    // Récupérer les historiques par client
    getHistoriquesParClient: builder.query({
      query: (id) => `/transactions/historiques/par-client/${id}`,
      providesTags: (result, error, id) => [{ type: "Historique", id }],
    }),

    // Récupérer les historiques par client avant une date
    getHistoriquesParClientAvantDate: builder.query({
      query: ({ id, date }) =>
        `/transactions/historiques/par-client-avant-date/${id}/${date}`,
      providesTags: (result, error, { id }) => [{ type: "Historique", id }],
    }),

    // Récupérer les historiques par client après une date
    getHistoriquesParClientApresDate: builder.query({
      query: ({ id, date }) =>
        `/transactions/historiques/par-client-apres-date/${id}/${date}`,
      providesTags: (result, error, { id }) => [{ type: "Historique", id }],
    }),

    // Supprimer une transaction
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction", "Historique"],
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useSaveTransactionMutation,
  useGetInfoTransactionQuery,
  useGetAllHistoriquesTransactionsQuery,
  useGetHistoriquesBetweenTwoDatesQuery,
  useGetHistoriquesParCompteQuery,
  useGetHistoriquesParCompteAvantDateQuery,
  useGetHistoriquesParCompteApresDateQuery,
  useGetHistoriquesParClientQuery,
  useGetHistoriquesParClientAvantDateQuery,
  useGetHistoriquesParClientApresDateQuery,
  useDeleteTransactionMutation,
} = transactionApi;

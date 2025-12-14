import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../utils/env.dev";

export const rembourseApi = createApi({
  reducerPath: "rembourseApi",
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
  tagTypes: ["Rembourse"],
  endpoints: (builder) => ({
    // Récupérer tous les remboursements
    getRembourses: builder.query({
      query: () => "/rembourse",
      providesTags: ["Rembourse"],
    }),

    // Récupérer un remboursement par ID
    getRembourseById: builder.query({
      query: (id) => `/rembourse/${id}`,
      providesTags: (result, error, id) => [{ type: "Rembourse", id }],
    }),

    // Créer un nouveau remboursement
    createRembourse: builder.mutation({
      query: (data) => ({
        url: "/rembourse",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Rembourse"],
    }),

    // Mettre à jour un remboursement
    updateRembourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/rembourse/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Rembourse", id },
        "Rembourse",
      ],
    }),

    // Supprimer un remboursement
    deleteRembourse: builder.mutation({
      query: (id) => ({
        url: `/rembourse/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rembourse"],
    }),
  }),
});

export const {
  useGetRemboursesQuery,
  useGetRembourseByIdQuery,
  useCreateRembourseMutation,
  useUpdateRembourseMutation,
  useDeleteRembourseMutation,
} = rembourseApi;

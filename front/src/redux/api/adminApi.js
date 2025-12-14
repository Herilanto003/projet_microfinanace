import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from "../../utils/env.dev";

export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: ["Admin", "Transaction"],
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => "/admin/stats",
      providesTags: ["Admin"],
    }),

    getAdminTransactions: builder.query({
      query: ({ start, end, compte, action } = {}) => {
        const params = new URLSearchParams();
        if (start) params.append("start", start);
        if (end) params.append("end", end);
        if (compte) params.append("compte", compte);
        if (action) params.append("action", action);
        const qs = params.toString();
        return `/admin/transactions${qs ? `?${qs}` : ""}`;
      },
      providesTags: ["Transaction"],
    }),

    getPretsChart: builder.query({
      query: () => "/admin/prets",
      providesTags: ["Admin"],
    }),

    getClientsChart: builder.query({
      query: () => "/admin/clients",
      providesTags: ["Admin"],
    }),

    getEvolution: builder.query({
      query: () => "/admin/evolution",
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminTransactionsQuery,
  useGetPretsChartQuery,
  useGetClientsChartQuery,
  useGetEvolutionQuery,
} = adminApi;

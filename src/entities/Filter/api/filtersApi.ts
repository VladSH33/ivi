import { baseApi } from "@/shared/api/rtkQuery";
import { FilterItem } from "../types";

export const filtersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFilters: builder.query<FilterItem[], void>({
      query: () => ({
        url: "/filters",
        method: "GET",
      }),
      providesTags: ["Filter"],
    }),
  }),
});

export const { useGetFiltersQuery } = filtersApi; 
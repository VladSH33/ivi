import { baseApi } from "@/shared/api/rtkQuery";
import { MovieType } from "@/entities/Movie";
import { FilterType } from "@/entities/Filter";

interface PaginationResponse {
  data: MovieType[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    appliedFilters?: Partial<FilterType>;
  };
}

export const paginationMoviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaginationMovies: builder.query<
      PaginationResponse,
      {
        page?: number;
        limit?: number;
        filters?: Partial<FilterType>;
      }
    >({
      query: ({ page = 1, limit = 10, filters = {} }) => ({
        url: "/movies",
        method: "GET",
        params: {
          page,
          limit,
          ...(filters.genre && { genre: filters.genre }),
          ...(filters.country && { country: filters.country }),
          ...(filters.year && { year: filters.year }),
        },
      }),
      providesTags: ["Movie"],
    }),
  }),
});

export const { useGetPaginationMoviesQuery } = paginationMoviesApi;

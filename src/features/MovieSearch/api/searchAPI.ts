import { baseApi } from "@/shared/api/rtkQuery";
import { MovieType } from "@/entities/Movie";

interface SearchResponse {
  data: MovieType[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    query: string;
    message: string;
  };
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchMovies: builder.query<
      SearchResponse,
      {
        query: string;
        page?: number;
        limit?: number;
      }
    >({
      query: ({ query, page = 1, limit = 12 }) => ({
        url: "/search",
        method: "GET",
        params: {
          q: query,
          page,
          limit,
        },
      }),
      providesTags: ["Movie"],
    }),
  }),
});

export const { useSearchMoviesQuery, useLazySearchMoviesQuery } = searchApi; 
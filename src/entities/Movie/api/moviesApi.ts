import { baseApi } from "@/shared/api/rtkQuery";
import { MovieType } from "../types";

export const moviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<MovieType[], void>({
      query: () => ({
        url: "/movies/all",
        method: "GET",
      }),
      providesTags: ["Movie"],
    }),
  }),
});

export const { useGetMoviesQuery } = moviesApi; 
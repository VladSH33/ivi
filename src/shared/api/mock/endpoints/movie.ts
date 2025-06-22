import { Response, Server, Request } from "miragejs";
import { AppSchema } from "../types";

export function routesForMovies(server: Server) {
  server.get("/movies", (schema: AppSchema, request: Request) => {
    const getQueryParam = (name: string): string => {
      const param = request.queryParams[name];
      return Array.isArray(param) ? param[0] : param || "";
    };

    const page = Math.max(1, parseInt(getQueryParam("page") || "1", 10));
    const limit = Math.max(1, parseInt(getQueryParam("limit") || "10", 10));

    const genre = getQueryParam("genre")?.toLowerCase();
    const country = getQueryParam("country")?.toLowerCase();
    const year = getQueryParam("year");

    let filteredMovies = schema.all("movie").models;

    if (genre) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.description.genre?.toLowerCase().includes(genre)
      );
    }

    if (country) {
      filteredMovies = filteredMovies.filter((movie) =>
        movie.description.country?.toLowerCase().includes(country)
      );
    }

    if (year) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.description.year === year
      );
    }

    const total = filteredMovies.length;
    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, total);
    const paginatedMovies = filteredMovies.slice(startIndex, endIndex);

    return new Response(
      200,
      {},
      {
        data: paginatedMovies,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          appliedFilters: {
            genre,
            country,
            year,
          },
        },
      }
    );
  });

  server.get("/movies/all", (schema) => {
    return schema.all("movie").models;
  });
}

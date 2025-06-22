import { Response, Server, Request } from "miragejs";
import { AppSchema } from "../types";

export function routesForSearch(server: Server) {
  server.get("/search", (schema: AppSchema, request: Request) => {
    const getQueryParam = (name: string): string => {
      const param = request.queryParams[name];
      return Array.isArray(param) ? param[0] : param || "";
    };

    const query = getQueryParam("q")?.toLowerCase();
    const page = Math.max(1, parseInt(getQueryParam("page") || "1", 10));
    const limit = Math.max(1, parseInt(getQueryParam("limit") || "12", 10));

    if (!query || query.length < 2) {
      return new Response(
        200,
        {},
        {
          data: [],
          meta: {
            currentPage: page,
            totalPages: 0,
            totalItems: 0,
            query: query,
            message: query ? "Запрос должен содержать минимум 2 символа" : "Введите поисковый запрос",
          },
        }
      );
    }

    let filteredMovies = schema.all("movie").models.filter((movie) => {
      const titleMatch = movie.title?.toLowerCase().includes(query);
      const genreMatch = movie.description.genre?.toLowerCase().includes(query);
      const countryMatch = movie.description.country?.toLowerCase().includes(query);
      const yearMatch = movie.description.year?.toString().includes(query);

      return titleMatch || genreMatch || countryMatch || yearMatch;
    });

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
          query: query,
          message: total === 0 ? `По запросу "${query}" ничего не найдено` : `Найдено ${total} результатов`,
        },
      }
    );
  });
} 
import { routesForMovies } from "./movie";
import { routesForFilters } from "./filter";
import { routesForUsersAuth } from "./usersAuth";
import { routesForSearch } from "./search";
import { supportEndpoints } from "./support";

const endpoints = {
  movies: routesForMovies,
  filters: routesForFilters,
  usersAuth: routesForUsersAuth,
  search: routesForSearch,
  support: supportEndpoints,
};

export { endpoints };

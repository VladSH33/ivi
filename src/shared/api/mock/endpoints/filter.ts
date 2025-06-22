import { Server } from "miragejs";

export function routesForFilters(server: Server) {
  server.get("/filters", (schema) => {
    return schema.all("filter").models;
  });
}

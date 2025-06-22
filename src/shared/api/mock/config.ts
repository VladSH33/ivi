import { createServer } from "miragejs";
import { endpoints } from "./endpoints";
import { models } from "./models";
import { generateMockMovies } from "@/shared/utils/generate-movies";

export function startMirage() {
  const server = createServer({
    models,
    seeds(server) {
      generateMockMovies(40).forEach((movie) => server.create("movie", movie));
      server.create("filter", {
        id: "genre",
        label: "Жанры",
        options: [
          { id: 1, label: "Драмы", icon: "/assets/filterIcons/genreDrama.svg" },
          {
            id: 2,
            label: "Комедии",
            icon: "/assets/filterIcons/genreComedy.svg",
          },
          {
            id: 3,
            label: "Боевики",
            icon: "/assets/filterIcons/genreAction.svg",
          },
          {
            id: 4,
            label: "Триллеры",
            icon: "/assets/filterIcons/genreTriller.svg",
          },
        ],
      });

      server.create("filter", {
        id: "country",
        label: "Страны",
        options: [
          { id: 1, label: "Россия" },
          { id: 2, label: "США" },
          { id: 3, label: "Бельгия" },
          { id: 4, label: "Франция" },
        ],
      });

      server.create("filter", {
        id: "year",
        label: "Годы",
        options: [
          { id: 1, label: "2025" },
          { id: 2, label: "2024" },
          { id: 3, label: "2023" },
          { id: 4, label: "2022" },
        ],
      });

      server.create("user", {
        id: "1",
        email: "123@123.com",
        password: "123456",
        isSubscribed: false,
        name: "Test User",
      });
    },
    routes() {
      this.passthrough("https://identitytoolkit.googleapis.com/**");
      this.passthrough("https://securetoken.googleapis.com/**");
      this.passthrough("https://firebase.googleapis.com/**");
      this.passthrough("https://firebaseapp.com/**");
      this.passthrough("https://*.firebaseapp.com/**");
      
      this.passthrough((request) => {
        if (request.url.startsWith('http') && !request.url.includes('localhost') && !request.url.includes('127.0.0.1')) {
          return true;
        }
        return false;
      });
    },
  });

  server.logging = true;

  const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('current_user_email') : null;
  if (storedEmail) {
    const existingUser = server.db.users.findBy({ email: storedEmail });
    if (!existingUser) {
      server.create("user", {
        id: "mock_id_" + Math.random().toString(36).substring(7),
        email: storedEmail,
        password: "mock_password",
        isSubscribed: localStorage.getItem('is_subscribed') === 'true',
        name: storedEmail.split('@')[0],
      });
    }
  }

  server.namespace = "";
  
  for (const namespace of Object.keys(endpoints)) {
    //@ts-ignore
    endpoints[namespace](server);
  }

  return server;
}

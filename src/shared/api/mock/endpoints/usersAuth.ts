import { Response, Server } from "miragejs";
import { AppSchema } from "../types";

export function routesForUsersAuth(server: Server) {
  server.post("/login", (schema: AppSchema, request) => {
    const { email, password } = JSON.parse(request.requestBody);

    const userByEmail = schema.db.users.findBy({ email: email });

    if (!userByEmail) {
      return new Response(401, {}, { message: "Неверный email или пароль" });
    }

    if (userByEmail.password !== password) {
      return new Response(401, {}, { message: "Неверный email или пароль" });
    }

    return {
      user: {
        id: userByEmail.id,
        email: userByEmail.email,
        name: userByEmail.name,
        isSubscribed: userByEmail.isSubscribed,
      },
      token: "mocked_jwt_token",
      expiresIn: 3600,
    };
  });

  server.post("/register", (schema: AppSchema, request) => {
    const { email, password, name } = JSON.parse(request.requestBody);
    const existingUser = schema.db.users.findBy({ email: email });

    if (existingUser) {
      return new Response(400, {}, { message: "Пользователь уже существует" });
    }

    const newUser = schema.db.users.insert({
      email,
      password,
      name,
      isSubscribed: false,
    });

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isSubscribed: newUser.isSubscribed,
      },
      token: "mocked_jwt_token",
      expiresIn: 3600,
    };
  });

  server.post("/refresh-token", (schema: AppSchema, request) => {
    try {
      const authHeader = request.requestHeaders.Authorization || request.requestHeaders.authorization;
      if (!authHeader) {
        return new Response(401, {}, { error: "Токен отсутствует" });
      }

      const oldToken = authHeader.replace("Bearer ", "");
      if (oldToken === "mocked_jwt_token") {
        return {
          token: "new_mocked_jwt_token",
          expiresIn: 3600,
        };
      }

      return new Response(401, {}, { error: "Неверный токен" });
    } catch (error) {
      return new Response(
        500,
        {},
        {
          error: "Внутренняя ошибка сервера",
          details: (error as Error).message,
        }
      );
    }
  });

  server.post("/logout", () => {
    return { message: "Успешный выход" };
  });

  server.post("/subscribe", (schema: AppSchema, request) => {
    const email = typeof window !== 'undefined' ? localStorage.getItem("current_user_email") : null;
    const user = schema.db.users.findBy({ email: email });

    if (!user) {
      return new Response(401, {}, { message: "Пользователь не найден" });
    }

    schema.db.users.update(user.id, { isSubscribed: true });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isSubscribed: true,
    };
  });

  server.post("/unsubscribe", (schema: AppSchema, request) => {
    const email = typeof window !== 'undefined' ? localStorage.getItem("current_user_email") : null;
    const user = schema.db.users.findBy({ email: email });

    if (!user) {
      return new Response(401, {}, { message: "Пользователь не найден" });
    }

    schema.db.users.update(user.id, { isSubscribed: false });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      isSubscribed: false,
    };
  });
}

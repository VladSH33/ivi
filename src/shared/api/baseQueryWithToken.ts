import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { auth } from "@/app/firebase";
import { BASE_URL } from "../config/environment";
import { FirebaseAuthService } from "@/features/auth/api/firebaseAuthService";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    headers.set("Content-Type", "application/json");
    
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        console.error('Ошибка получения токена:', error);
      }
    }
    
    return headers;
  },
});

export const baseQueryWithToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  {},
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {

  if (isPublicEndpoint(args)) {
    return baseQuery(args, api, extraOptions);
  }

  const user = auth.currentUser;
  if (!user && !isAuthEndpoint(args)) {
    api.dispatch({ type: 'auth/clearUser' });
    return { error: { status: 401, data: "Требуется авторизация" } };
  }

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401 && user) {
    console.log('Получена 401 ошибка, пытаемся обновить токен');
    
    try {
      const refreshedToken = await FirebaseAuthService.refreshToken();
      
      if (refreshedToken) {
        console.log('Токен обновлен, повторяем запрос');
        result = await baseQuery(args, api, extraOptions);
      } else {
        throw new Error('Не удалось обновить токен');
      }
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      
      try {
        await auth.signOut();
      } catch (signOutError) {
        console.error('Ошибка выхода из Firebase Auth:', signOutError);
      }
      
      api.dispatch({ type: 'auth/clearUser' });
      
      return { error: { status: 401, data: "Сессия истекла. Требуется повторная авторизация" } };
    }
  }

  if (result.error && result.error.status === 401) {
    console.log('Получена 401 ошибка после обновления токена, выполняем выход из системы');
    
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Ошибка выхода из Firebase Auth:', error);
    }
    
    api.dispatch({ type: 'auth/clearUser' });
    
    return { error: { status: 401, data: "Сессия истекла. Требуется повторная авторизация" } };
  }

  return result;
};

function isAuthEndpoint(args: string | FetchArgs): boolean {
  if (typeof args === 'string') {
    return args === '/login' || args === '/register';
  }
  const url = args.url;
  return url === '/login' || url === '/register';
}

function isPublicEndpoint(args: string | FetchArgs): boolean {
  if (typeof args === 'string') {
    return args.startsWith('/movies') || 
           args.startsWith('/filters') || 
           args.startsWith('/genres') ||
           args.startsWith('/countries') ||
           args.startsWith('/years');
  }
  const url = args.url;
  return url.startsWith('/movies') || 
         url.startsWith('/filters') || 
         url.startsWith('/genres') ||
         url.startsWith('/countries') ||
         url.startsWith('/years');
}


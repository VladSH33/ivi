import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/shared/api/rtkQuery";
import { supportWebSocketApi } from "@/features/SupportChat/api/supportWebSocketApi";
import authReducer from "@/features/auth/model/authSlice";
import { themeReducer } from "@/shared/lib/theme";
import supportChatReducer from "@/features/SupportChat/model/chatSlice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [supportWebSocketApi.reducerPath]: supportWebSocketApi.reducer,
    auth: authReducer,
    theme: themeReducer,
    supportChat: supportChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, supportWebSocketApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

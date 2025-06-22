import { baseApi } from "@/shared/api/rtkQuery";
import { UserType } from "@/entities/User/types";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribe: builder.mutation<UserType, void>({
      query: () => ({
        url: "/subscribe",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("is_subscribed", "true");
        } catch (error) {
          console.error("Subscribe error:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    unsubscribe: builder.mutation<UserType, void>({
      query: () => ({
        url: "/unsubscribe",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.removeItem("is_subscribed");
        } catch (error) {
          console.error("Unsubscribe error:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useSubscribeMutation,
  useUnsubscribeMutation,
} = subscriptionApi; 
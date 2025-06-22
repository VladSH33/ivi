import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithToken } from "./baseQueryWithToken";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithToken,
  tagTypes: ["Movie", "Filter", "User"],
  endpoints: () => ({}),
}); 
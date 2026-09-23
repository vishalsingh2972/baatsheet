import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("google_form_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

const customBaseQuery = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  const url = typeof args === "string" ? args : args?.url;

  if (result.data) {
    const responseData = result.data;
    if (
      responseData &&
      typeof responseData === "object" &&
      "success" in responseData
    ) {
      if (responseData.success && responseData.data !== undefined) {
        const data = responseData.data;
        if (
          url &&
          (url.includes("/auth/login") ||
            url.includes("/auth/signup") ||
            url.includes("/auth/register"))
        ) {
          if (data && data.token && typeof window !== "undefined") {
            localStorage.setItem("google_form_token", data.token);
          }
        }
        return { ...result, data: responseData.data };
      }
    }
  }

  if (url && url.includes("/auth/logout")) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("google_form_token");
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Form", "User", "Response"],
  endpoints: () => ({}),
});

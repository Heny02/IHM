import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({ baseUrl: "" });

const apiSlice = createApi({
  baseQuery,
  reducerPath: "api",
  endpoints: () => ({}),
});

export default apiSlice;

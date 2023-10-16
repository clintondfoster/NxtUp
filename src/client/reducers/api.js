import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createSlice } from "@reduxjs/toolkit";

const CREDENTIALS = "credentials";

// Define a service using a base URL and expected endpoints
export const votingApi = createApi({
  tagTypes: ["vote"],
  reducerPath: "votingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    prepareHeaders: (headers, { getState }) => {
      const credentials = window.sessionStorage.getItem(CREDENTIALS);
      const parsedCredentials = JSON.parse(credentials || "{}");
      const token = parsedCredentials.token;
      if (token) {
          headers.set("Authorization", token);
      }
      return headers;
  },
}),
  endpoints: (builder) => ({
    addGroup: builder.mutation({
      query: (body) => ({
        url: "api/groups",
        method: "POST",
        body: body,
      }),
    }),
    addQuestion: builder.mutation({
      query: (body) => ({
        url: "api/questions",
        method: "POST",
        body: body,
      }),
    }),
    addRole: builder.mutation({
      query: (body) => ({
        url: "api/role",
        method: "POST",
        body: body,
      }),
    }),
    createVote: builder.mutation({
      query:()=>({
        url: "api/vote",
        method: "POST"
      })
    })
  }),
});
function storeToken(state, { payload }) {
  console.log("storeToken is running");
  state.credentials = { token: payload.token };
  console.log("Token recieved:", payload.token);
  window.sessionStorage.setItem(CREDENTIALS, JSON.stringify(payload));
}

export const {
  useAddGroupMutation,
  useAddQuestionMutation,
  useAddRoleMutation,
  useCreateVoteMutation
} = votingApi;


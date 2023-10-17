import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { createSlice } from "@reduxjs/toolkit";

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
      const token = parsedCredentials.payload?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
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
    addSubmission: builder.mutation({
      query: (body) => ({
        url: "api/submissions",
        method: "POST",
        body: body,
      }),
    }),

    // getUserById: builder.query({
    //   query: (id) => `api/users/${id}`
    // }),

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
  console.log(state);

  const { token, user } = payload;
  state.credentials = { token, user };
  console.log("Token recieved:", token);
  window.sessionStorage.setItem(CREDENTIALS, JSON.stringify({ token, user }));
}

export const {
  useAddGroupMutation,
  useAddQuestionMutation,
  useAddRoleMutation,
  useAddSubmissionMutation,
  useCreateVoteMutation,
} = votingApi;
// export default dataSlice.reducer;

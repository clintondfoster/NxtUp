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
      console.log("prepareHeaders is running");

      const credentials = window.sessionStorage.getItem(CREDENTIALS);
      const parsedCredentials = JSON.parse(credentials || "{}");
      const token = parsedCredentials.token;
      console.log("token from reducer", token);
      if (token) {

          headers.set("Authorization", token);

        // headers.set("Authorization", `Bearer ${token}`);
      }
      console.log("token from session storage:", token);
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
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `api/users/${id}`,
        method: "DELETE",
      }),
    }),
    editUser: builder.mutation({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `api/users/${id}`,
          method: "PUT",
          body,
        };
      },
    }),
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
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useEditUserMutation,
  useAddGroupMutation,
  useAddQuestionMutation,
  useAddRoleMutation,
  useAddSubmissionMutation,
} = votingApi;

// export default dataSlice.reducer;

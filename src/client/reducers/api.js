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
    getGroupByCode: builder.query({
      query: (code) => `api/groups/${code}`,
    }),
    getActiveQuestionsForGroup: builder.query({
      query: (code) => `api/questions/group/${code}/active`,
    }),
    getQuestionById: builder.query({
      query: (id) => `api/questions/${id}`,
    }),
    getSubmissionsForQuestion: builder.query({
      query: (questionId) => `api/questions/${questionId}/submissions`,
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
        where: {
          question_id: Number(req.body.questionId),
        },
        where: {
          question_id: Number(req.body.questionId),
        },
        body: body,
      }),
    }),
    getVotesForSub: builder.query({
      query: (submissionId) => `api/vote/${submissionId}`,
    }),
    deleteVote: builder.mutation({
      query: (id) => ({
        url: `api/vote/${id}`,
        method: "DElETE",
 
      }),
    }),
    createVote: builder.mutation({
      query: (body) => ({
        url: "api/vote",
        method: "POST",
        body: body,
      }),
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




const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      storeApi.endpoints.useCreateVoteMutation.matchFulfilled,
      (state, { payload }) => {
        return [...payload.voted]

      }
    ) 
  }
});

export const {
  useAddGroupMutation,
  useAddQuestionMutation,
  useAddRoleMutation,
  useGetVotesForSubQuery,
  useCreateVoteMutation,
  useDeleteVoteMutation,
  useGetGroupByCodeQuery,
  useAddSubmissionMutation,
  useGetActiveQuestionsForGroupQuery,
  useGetQuestionByIdQuery,
  useGetSubmissionsForQuestionQuery,
} = votingApi;
// export default dataSlice.reducer;

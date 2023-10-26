
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
    getUserHistory: builder.query({
      query: () => `api/role/users_history`,
    }),
    getQuestionsCreatedByUser: builder.query({
      query: (code) => `api/role/created-questions/${code}`,
    }),
    getActiveQuestionsFromJoinedGroups: builder.query({
      query: (code) => `api/role/joined-group-questions/${code}`,
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
    getUserGroupsByRoles: builder.query({
      query: () => `api/role/user_groups`,
    }),
    addRole: builder.mutation({
      query: (body) => ({
        url: "api/role",
        method: "POST",
        where: {
          question_id: Number(req.body.questionId),
        },
        body: body,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => `api/me`,
  }),
    updateUserRole: builder.mutation({
      query: ({ groupId, userId, data }) => ({
        url: `api/users/group/${groupId}/users/${userId}/role`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsersInGroup: builder.query({
      query: (groupId) => `api/users/group/${groupId}/users`,
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
    deleteGroup: builder.mutation({
      query: (id) => ({
        url: `api/groups/${id}`,
        method: "DElETE",
      }),
    }),
    closeQuestion: builder.mutation({
      query: (id) => ({
        url: `api/questions/${id}`,
        method: "PUT",
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
  const { token, user } = payload;
  state.credentials = { token, user };
  window.sessionStorage.setItem(CREDENTIALS, JSON.stringify({ token, user }));
}
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
  useGetUserGroupsByRolesQuery,
  useGetUserHistoryQuery,
  useGetCurrentUserQuery,
  useUpdateUserRoleMutation,
  useGetUsersInGroupQuery,
  useGetActiveQuestionsFromJoinedGroupsQuery,
  useGetQuestionsCreatedByUserQuery,
} = votingApi;
// export default dataSlice.reducer;
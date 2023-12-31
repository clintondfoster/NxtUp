import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const CREDENTIALS = "credentials";
// Define a service using a base URL and expected endpoints
export const votingApi = createApi({
  tagTypes: ["vote"],
  reducerPath: "votingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_URL || "http://localhost:3000/",
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
    deleteGroupByCode: builder.mutation({
      query: (id) => ({
        url: `api/groups/${id}`,
        method: "DElETE",
      }),
    }),
    getActiveQuestionsForGroup: builder.query({
      query: (code) => `api/questions/group/${code}/active`,
    }),
    getInactiveQuestionsForGroup: builder.query({
      query: (code) => `api/questions/group/${code}/inactive`,
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
        body: body,
      }),
    }),
    getCurrentUser: builder.query({
      query: () => `auth/me`,
    }),
    getUserById: builder.query({
      query: (id) => `api/users/${id}`,
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
    getVotesForSubByUser: builder.query({
      query: (submissionId) => `api/vote/voted/${submissionId}`,
    }),
    deleteVote: builder.mutation({
      query: (code) => ({
        url: `api/vote/${code}`,
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
    editGroupName: builder.mutation({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `api/groups/${id}`,
          method: "PUT",
          body,
        };
      },
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
  useGetVotesForSubByUserQuery,
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
  useGetUserByIdQuery,
  useEditUserMutation,
  useUpdateUserRoleMutation,
  useGetUsersInGroupQuery,
  useGetActiveQuestionsFromJoinedGroupsQuery,
  useGetQuestionsCreatedByUserQuery,
  useDeleteGroupByCodeMutation,
  useCloseQuestionMutation,
  useEditGroupNameMutation,
  useGetInactiveQuestionsForGroupQuery,
} = votingApi;
// export default dataSlice.reducer;

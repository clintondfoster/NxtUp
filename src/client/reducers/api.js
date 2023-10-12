import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import {createSlice} from "@reduxjs/toolkit";

//Session storage key
const CREDENTIALS = "credentials";

// Define a service using a base URL and expected endpoints

export const votingApi = createApi({
    tagTypes: ["vote"],
    reducerPath: "votingApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https//localhost:3000/",
        prepareHeaders: (headers, { getState }) => {
            console.log("prepareHeaders is running");
            console.log("Headers:", headers)

            const credentials = window.sessionStorage.getItem(CREDENTIALS);
            const parsedCredentials = JSON.parse(credentials || "{}");
            const token = parsedCredentials.token;
            console.log("token from reducer", token);
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            console.log("token from session storage:", token);
            return headers;
        },
    }),
    endpoints: (builder) => ({
      //User endpoints
      getUserById: builder.query({
        query: (id) => `api/users/${id}`,
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
    addGroup: builder.mutation({
      query: (body) => ({
        url: "api/groups",
        method: "POST",
        body: body,

      }),
    }),
  }),
})
})


function storeToken(state, { payload }) {
    console.log('storeToken is running');

    state.credentials = { token: payload.token };
    console.log("Token recieved:", payload.token);
    window.sessionStorage.setItem(
        CREDENTIALS,
        JSON.stringify(payload)
    )
  }



// const dataSlice = createSlice({
//     name:"data",
//     initialState:[],
//     reducers:{},
//     extraReducers: (builder)=>{
//         builder.addMatcher(api.endpoints.getPosts.matchFulfilled, (state, {payload})=>{
//             return{
//                 ...state,
//                 posts: payload
//             }
//         })

//         builder.addMatcher(api.endpoints.deletePost.matchFulfilled, (state, {payload})=>{
//             return {
//                 ...state,
//                 posts: state.posts.filter(i=>i.id!==payload.id)
//             }

//         })
//         builder.addMatcher(api.endpoints.addPost.matchFulfilled, (state, {payload})=>{
//             state.posts.push(payload);
//             return state;
//         })
//     }



export const {
    useGetUserByIdQuery,
    useDeleteUserMutation,
    useEditUserMutation,
    useAddGroupMutation
} = votingApi;

export default dataSlice.reducer;


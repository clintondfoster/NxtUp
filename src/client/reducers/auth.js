import {createSlice} from "@reduxjs/toolkit";
import {votingApi as storeApi} from "./api";

 //session storage key
const CREDENTIALS = "credentials";

const authApi = storeApi.injectEndpoints({
    endpoints: (builder)=>({
        getCurrentUser: builder.query({
            query: () => `/auth/me`,
        }),
        login: builder.mutation({
            query: (cred)=>({
                url:"/auth/login",
                method: "POST",
                body: cred
            })
        }),
        register: builder.mutation({
            query: (cred)=>({
                url:"/auth/register",
                method: "POST",
                body: cred
            })
        }),
        oauth: builder.mutation({
            query: (cred)=>({
                url:"/oauth/oauth",
                method: "POST",
                body: cred
            })
        }),
        logout: builder.mutation({
            query: ()=>({data:{}})
        })
    })
})

function storeToken(state, {payload}){

    state.credentials = {token: payload.token, user: {...payload.user}};
        window.sessionStorage.setItem(
        CREDENTIALS,
        JSON.stringify({
            token: payload.token,
            user: {...payload.user}
        })
    )
}


const authSlice = createSlice({
    name: "auth",
    initialState: {
        credentials : JSON.parse(window.sessionStorage.getItem(CREDENTIALS)) || {

            token:"",
            user: {},

        }
    },
    reducers:{},
    extraReducers: (builder)=>{
        builder.addMatcher(storeApi.endpoints.login.matchFulfilled, storeToken);
        builder.addMatcher(storeApi.endpoints.register.matchFulfilled, storeToken);
        builder.addMatcher(storeApi.endpoints.oauth.matchFulfilled, storeToken);
        builder.addMatcher(storeApi.endpoints.getCurrentUser.matchFulfilled, (state, {payload}) => {
            // state.credentials.user = action.payload;
           return {...state, user: payload.user}
        })
        builder.addMatcher(storeApi.endpoints.logout.matchRejected, (state)=>{
            state.credentials = {
                token: '',
            };
            window.sessionStorage.removeItem(CREDENTIALS)
        });
    }
})

export default authSlice.reducer;

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useOauthMutation,
    useGetCurrentUserQuery,
} = authApi
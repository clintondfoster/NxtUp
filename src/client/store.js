import { configureStore } from "@reduxjs/toolkit";
import { votingApi } from "./reducers/api";
import authReducer from './reducers/auth'
// import dataReducer from './reducers/api'
import submissionReducer from "./reducers/submissionSlice";
import userReducer from "./reducers/userSlice";

const store = configureStore({
    reducer: {
        [votingApi.reducerPath]: votingApi.reducer,
        auth: authReducer,
        submissions: submissionReducer,
        users: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(votingApi.middleware),
});

export default store;

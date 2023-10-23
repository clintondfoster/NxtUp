import { configureStore } from "@reduxjs/toolkit";
import { votingApi } from "./reducers/api";
import authReducer from './reducers/auth'
// import dataReducer from './reducers/api'
import submissionReducer from "./reducers/submissionSlice";

const store = configureStore({
    reducer: {
        [votingApi.reducerPath]: votingApi.reducer,
        auth: authReducer,
        submissions: submissionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(votingApi.middleware),
});

export default store;

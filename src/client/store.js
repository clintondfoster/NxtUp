import { configureStore } from "@reduxjs/toolkit";
import { votingApi } from "./reducers/api";
import authReducer from './reducers/auth'
// import dataReducer from './reducers/api'

const store = configureStore({
    reducer: {
        [votingApi.reducerPath]: votingApi.reducer,
        auth: authReducer,
        // data:dataReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(votingApi.middleware),
});

export default store;

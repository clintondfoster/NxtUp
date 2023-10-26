import { createSlice } from "@reduxjs/toolkit";
import {votingApi as storeApi} from "./api";

const initialState = {
    usersInGroup: [],
    loading: 'idle',
    error: null
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            storeApi.endpoints.getUsersInGroup.matchFulfilled,
            (state, action) => {
              state.loading = 'idle';
              state.usersInGroup = action.payload;
              state.error = null;
            }
          );
    }
})

export default userSlice.reducer;
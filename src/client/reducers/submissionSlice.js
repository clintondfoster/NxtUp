import { createSlice } from "@reduxjs/toolkit";

const submissionSlice = createSlice({
    name: 'submissions', 
    initialState: [], 
    reducers: {
        addSubmission: (state, action ) => {
            state.push(action.payload)
        }
    }
})

export const {
    addSubmission,
} = submissionSlice.actions; 

export default submissionSlice.reducer
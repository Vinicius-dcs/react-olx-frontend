import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'user',
    initialState: {
        email: 'vinicius.costa@'
    },
    reducers: {
        setEmail: (state, action) => {
            state.email = action.payload;
        }
    }
})

export const { setEmail } = slice.actions;
export default slice.reducer;
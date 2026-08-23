import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name : "auth",
    initialState : {
        loading : false
    },
    reducers:{
        setloading : (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const {setloading} = authSlice.actions;
export default authSlice.reducer;
import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobSlice from "./jobSlice";

const store = configureStore({
    reducer : {
        auth :authReducer,
        job: jobSlice
    }
});
export default store;
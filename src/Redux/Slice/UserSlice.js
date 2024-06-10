import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser:null,
    error:null,
    loding:false
}

const userSilce = createSlice({
    name:"user",
    initialState,
        reducers:{
            signInStart:(state)=>{
                state.loding = true;
                state.error = null;

            },
            signInSuccess:(state,action)=>{
                state.loding = false;
                state.currentUser = action.payload;
            },
            signInFailure:(state,action)=>{
                state.loding = false;
                state.error = action.payload;
            },
            signOutSuccess:(state)=>{
                state.loding = false;
                state.currentUser = null;
                state.error = null;
            }

        }
});

export const {signInStart,signInSuccess,signInFailure,signOutSuccess} = userSilce.actions;

export default userSilce.reducer;
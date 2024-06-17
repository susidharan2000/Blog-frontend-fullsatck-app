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
            upadateStart:(state)=>{
                state.loding = true;
                state.error = null;
            },
            upadateSuccess:(state,action)=>{
                state.loding = false;
                state.currentUser = action.payload;
                state.error = null;
            },
            updateFailure:(state,action)=>{
                state.loding = false;
                state.error = action.payload;
            },
            signOutSuccess:(state)=>{
                state.loding = false;
                state.currentUser = null;
                state.error = null;
            },
            deleteUserStart:(state)=>{
                state.loding = true;
                state.error = null;
            },
            deleteUserSuccess:(state)=>{
                state.loding = false;
                state.currentUser = null;
                state.error = null;
            },
            deleteUserFailure:(state,action)=>{
                state.loding = false;
                state.error = action.payload;
            }

        }
});

export const {signInStart,signInSuccess,signInFailure,upadateStart,upadateSuccess,updateFailure,signOutSuccess,deleteUserStart,deleteUserSuccess,deleteUserFailure} = userSilce.actions;

export default userSilce.reducer;
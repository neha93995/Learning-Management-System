import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || "",
    data: localStorage.getItem('data') || {}
};


export const createAccount = createAsyncThunk("/auth/signup",async (data)=>{
    try {
        const res =await axiosInstance.post("/user/register",data);
        console.log('res',res,data)
        toast.promise(res,{
            loading:"wait! creating your account",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to create account"
        });
       

        console.log("auth Slice completed",res.data);
        
        return res.data;
    } catch (error) {
        console.log('authSlice error')
        toast.error(error?.response?.data?.message);
    }
})


const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
})

//  export const {} = authSlice.actions;
export default authSlice.reducer;


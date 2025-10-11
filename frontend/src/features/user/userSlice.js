import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import api from '../../api/axios.js'

const initialState = {
    value: null
}

//fetch user data 
export const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
    const {data} = await api.get('/api/user/data',{
        headers: {Authorization: `Bearer ${token}`}
    })
    return data.success ? data.user : null 
})

//update user data
export const updateUser = createAsyncThunk("user/updateUser", async ({userData ,token}) => {
    const {data} = await api.post('/api/user/update', userData, {
        headers: {Authorization: `Bearer ${token}`}
    })
    if(data.success){
        return data.user
    }else{
        toast.error(data.message)
        return null
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{

    },
    extraReducers : (builder)=>{
        builder.addCase(fetchUser.fulfilled, (state, action)=>{
            state.value = action.payload
        }).addCase(updateUser.fulfilled, (state, action)=>{
            state.value = action.payload
        })
    }
})

export default userSlice.reducer 
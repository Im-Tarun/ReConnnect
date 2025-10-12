import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from '../../api/axios.js'

const initialState = {
    messages: []
}

export const fetchMessages = createAsyncThunk('messages/fetchMessages', async({token, userId})=>{
    const {data} = await api.post('/api/message/get',{to_user_id: userId},{
        headers:{Authorization: `Bearer ${token}`}
    })
    !data.success && toast.error(data.message)
    return data.success ? data.messages : null
})

const messageSlice = createSlice({
    name: 'messages',
    initialState,
    reducers:{
        setMessages: (state, action)=>{
            state.messages = action.payload
        },
        addMessages: (state, action)=>{
            state.messages = [...state.messages, action.payload]
        },
        resetMessages: (state, action)=>{
            state.messages = []
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchMessages.fulfilled, (state, action)=>{
            if(action.payload) state.messages = action.payload
        })
    }
})

export const {setMessages, addMessages, resetMessages} = messageSlice.actions

export default messageSlice.reducer
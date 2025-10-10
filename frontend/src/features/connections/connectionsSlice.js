import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from '../../api/axios.js'

const initialState = {
    connections: [],
    pendingConnections: [],
    followers:[],
    followings:[]
}

export const fetchConnections = createAsyncThunk('connections/fetchConnections', async(token)=>{
    const {data} = await api.get('/api/user/connections',{
        headers:{Authorization: `Bearer ${token}`}
    })
    return data.success ? data : null
})

const connectionSlice = createSlice({
    name: 'connections',
    initialState,
    reducers:{

    },
    extraReducers: (builder)=>{
        builder.addCase(fetchConnections.fulfilled,(state, action)=>{
            state.connections = action.payload.connections
            state.followers = action.payload.followers
            state.followings = action.payload.followings
            state.pendingConnections = action.payload.pendingConnections
        })
    }
})

export default connectionSlice.reducer
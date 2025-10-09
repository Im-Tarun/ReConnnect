import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from '../../api/axios.js'

const initialState = {
    connections: [],
    pendingConnections: [],
    followers:[],
    followings:[]
}

export const fetchConnections = createAsyncThunk('connections/fetchConnections', async(token)=>{
    const {data} = await api.get('/api/')
})

const connectionSlice = createSlice({
    name: 'connections',
    initialState,
    reducers:{

    }
})

export default connectionSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
            state.posts = [];
        },
        setConnection: (state, action) => {
            if (state.user) {
                state.user.connections = action.payload.connections;
            } else {
                console.error("no friends :(")
            }
            console.log("connections in state=", state.user.connections)
        },
        setPosts: (state, action) => {
            state.posts = action.payload.posts.sort((a, b) => {
                let da = new Date(a.createdAt),
                    db = new Date(b.createdAt);
                return db - da;
            })
        },
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {
                if (post._id === action.payload.post._id) {
                    return action.payload.post;
                }
                return post;
            })
            state.posts = updatedPosts;
        }
    }
})

export const { setMode, setLogin, setLogout, setConnection, setPosts, setPost } = authSlice.actions;
export default authSlice.reducer;
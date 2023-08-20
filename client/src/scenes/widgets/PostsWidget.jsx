import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from 'state'
import PostWidget from './PostWidget'

export default function PostsWidget({ userId, isProfile=false}) {
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const posts = useSelector(state => state.posts)

    const getPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        dispatch(setPosts({ posts: data }))
    }

    const getUserPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        dispatch(setPosts({ posts: data }))
    }

    useEffect(() => {
        if (isProfile) getUserPosts()
        else getPosts()
    }, [])

    return (
        <>
        {console.log("posts=",posts)}
            {posts.map(({ _id, userId, name, desc, postImg, likes, comments, createdAt, updatedAt }) => (
                <PostWidget
                    key={_id}
                    postId={_id}
                    userId={userId}
                    name={name}
                    desc={desc}
                    postImg={postImg}
                    likes={likes}
                    comments={comments}
                    createdAt={createdAt}
                    updatedAt={updatedAt}
                />
            ))}
        </>
    )
}

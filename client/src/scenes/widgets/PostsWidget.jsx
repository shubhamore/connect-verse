import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from 'state'
import PostWidget from './PostWidget'
import WidgetWrapper from 'components/WidgetWrapper'

export default function PostsWidget({ Id, isProfile=false}) {
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const posts = useSelector(state => state.posts)

    const getPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        //console.log("getPosts=",data)
        dispatch(setPosts({ posts: data }))
    }

    const getUserPosts = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/${Id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        //console.log("getUserPosts=",data)
        dispatch(setPosts({ posts: data }))
    }

    useEffect(() => {
        if (isProfile) getUserPosts()
        else getPosts()
    }, [Id])

    return (
        <>
            {posts.length?posts.map(({ _id, userId, name, desc, postImg, likes, comments, isEdited,createdAt }) => (
                <PostWidget
                    key={_id}
                    postId={_id}
                    userId={userId}
                    name={name}
                    desc={desc}
                    postImg={postImg}
                    likes={likes}
                    comments={comments}
                    isEdited={isEdited}
                    isProfile={isProfile}
                    createdAt={createdAt}
                />
            )):<WidgetWrapper sx={{padding:"1.5rem"}}>Oops! It seems this user hasn't posted any content yet. Check back later for updates.</WidgetWrapper>}
        </>
    )
}

import React, { useState } from 'react'
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material'
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material'
import FlexBetween from 'components/FlexBetween'
import Connection from "components/Connection"
import WidgetWrapper from 'components/WidgetWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { setPost } from 'state'

export default function PostWidget({ postId, userId, name, desc, postImg, likes, comments }) {
    const [isComments, setIsComments] = useState(false)
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const loggedInUserId = useSelector(state => state.user._id)
    const isLiked = Boolean(likes[loggedInUserId])
    const likeCount = Object.keys(likes).length
    const main = palette.neutral.main
    const primary = palette.primary.main

    const patchLike = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/${postId}/like`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: loggedInUserId })
        })
        const data = await response.json()
        dispatch(setPost({ post: data }))
    }

    return (
        <WidgetWrapper m="2rem 0">
            <Connection
                connectionId={userId}
                name={name}
            />
            <Typography color={main} sx={{ mt: "1rem" }}>
                {desc}
            </Typography>
            {postImg && (
                <img
                    width="100%"
                    height="auto"
                    max-height="50px"
                    alt="post"
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                    src={postImg}
                />
            )}

            <FlexBetween sx={{ mt: "0.25rem" }}>
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton
                            onClick={patchLike}
                            sx={{
                                "&:hover": {
                                    color: primary
                                }
                            }}
                        >
                            {isLiked ? (
                                <FavoriteOutlined sx={{color:primary}} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography color={main}>
                            {likeCount}
                        </Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton
                            onClick={() => setIsComments(!isComments)}
                            sx={{
                                "&:hover": {
                                    color: primary
                                }
                            }}
                        >
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography color={main}>
                            {comments.length}
                        </Typography>
                    </FlexBetween>
                </FlexBetween>

                <IconButton
                    sx={{
                        "&:hover": {
                            color: primary
                        }
                    }}
                >
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>

            {isComments && (
                <Box mt="0.5rem">
                    {comments.map((comment, index ) => (
                        <Box key={Date.now() + crypto.randomUUID() + index}>
                            <Divider />
                            <Typography color={main} sx={{ m: "0.5rem" }}>
                                {comment}
                            </Typography>
                        </Box>
                    ))}
                    <Divider />
                    {comments.length===0&&(
                        <>
                            <Typography color={main} sx={{ m: "0.5rem" }}>
                                No comments yet
                            </Typography>
                            <Divider />
                        </>
                    )}
                </Box>
            )}
        </WidgetWrapper>
    )
}

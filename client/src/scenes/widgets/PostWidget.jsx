import React, { useState } from 'react'
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Divider, IconButton, Typography, useTheme, Menu, MenuItem, Button } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FlexBetween from 'components/FlexBetween'
import Connection from "components/Connection"
import WidgetWrapper from 'components/WidgetWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { setPost, setPosts } from 'state'
import { toast } from "react-toastify"


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

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openDialog, setOpenDialog] = React.useState(false);
    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

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

    const deletePost = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/delete`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
         },
            body: JSON.stringify({ postId })
        })
        const data = await response.json()
        handleClose()
        handleCloseDialog()
        dispatch(setPosts({ posts: data }))
        toast.success("Post deleted successfully")
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
                                <FavoriteOutlined sx={{ color: primary }} />
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

                <FlexBetween gap="0.3rem">
                    <IconButton
                        sx={{
                            "&:hover": {
                                color: primary
                            }
                        }}
                    >
                        <ShareOutlined />
                    </IconButton>
                    {loggedInUserId === userId && <div>
                        <IconButton
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                            sx={{
                                "&:hover": {
                                    color: primary
                                }
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose}><EditIcon sx={{ fontSize: '17.5px', marginRight: '10px' }} />Edit post</MenuItem>
                            <MenuItem onClick={handleClickOpenDialog}><DeleteIcon sx={{ fontSize: '17.5px', marginRight: '10px' }} />Delete post</MenuItem>
                        </Menu>
                        <Dialog
                            open={openDialog}
                            onClose={handleCloseDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle>
                                Are you sure you want to delete this post?
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Cancel</Button>
                                <Button onClick={deletePost} autoFocus>
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>}
                </FlexBetween>
            </FlexBetween>

            {isComments && (
                <Box mt="0.5rem">
                    {comments.map((comment, index) => (
                        <Box key={Date.now() + crypto.randomUUID() + index}>
                            <Divider />
                            <Typography color={main} sx={{ m: "0.5rem" }}>
                                {comment}
                            </Typography>
                        </Box>
                    ))}
                    <Divider />
                    {comments.length === 0 && (
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

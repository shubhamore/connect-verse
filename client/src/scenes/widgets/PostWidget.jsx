import React, { useState } from 'react'
import { ChatBubbleOutlineOutlined, DeleteOutlined, EditOutlined, ImageOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Divider, IconButton, Typography, InputBase, useTheme, Menu, MenuItem, Button } from '@mui/material'
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
import Dropzone from 'react-dropzone'
import TextField from '@mui/material/TextField';


export default function PostWidget({ postId, userId, name, desc, postImg, likes, comments, isEdited, isProfile }) {
    const [isComments, setIsComments] = useState(false)
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const loggedInUserId = useSelector(state => state.user._id)
    const isLiked = Boolean(likes[loggedInUserId])
    const likeCount = Object.keys(likes).length
    const main = palette.neutral.main
    const primary = palette.primary.main

    const [description, setDescription] = useState(desc)
    const [image, setImage] = useState(postImg)
    const [isImage, setIsImage] = useState(postImg ? true : false)
    const [imageName, setImageName] = useState("Posted Image")

    function toggleImage() {
        if (isImage) {
            setImage(null)
            setImageName("")
        }
        setIsImage(!isImage)
    }

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
        handleClose()
    };
    const [openDialog2, setOpenDialog2] = React.useState(false);
    const handleClickOpenDialog2 = () => {
        setOpenDialog2(true);
    };
    const handleCloseDialog2 = () => {
        setOpenDialog2(false);
        setDescription(desc)
        setImage(postImg)
        setIsImage(postImg ? true : false)
        setImageName("Posted Image")
        handleClose()
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

    const editPost = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/edit`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId, desc: description, postImg: image })
        })
        const data = await response.json()
        handleClose()
        setOpenDialog2(false)
        dispatch(setPost({ post: data }))
        toast.success("Post edited successfully")
    }

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result)
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    return (
        <>
            <WidgetWrapper mb="2rem">
                <Connection
                    connectionId={userId}
                    name={name}
                    showConnect={!isProfile}
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
                {isEdited && (
                    <Typography color={palette.neutral.medium} sx={{ mt: "0.5rem",display:"flex", alignItems:"center" }}><EditOutlined sx={{fontSize:"17px",mr:"3.5px"}}/>Edited</Typography>
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
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClickOpenDialog2}><EditIcon sx={{ fontSize: '17.5px', marginRight: '10px' }} />Edit post</MenuItem>
                                <MenuItem onClick={handleClickOpenDialog}><DeleteIcon sx={{ fontSize: '17.5px', marginRight: '10px' }} />Delete post</MenuItem>
                            </Menu>
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

            {/* Delete post Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
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

            {/* Edit post Dialog */}
            <Dialog
                open={openDialog2}
                onClose={handleCloseDialog2}
                fullWidth
            >
                <DialogTitle>
                    Edit Post
                </DialogTitle>
                <DialogContent>
                    <Box gap="1.5rem">
                        <TextField
                            multiline
                            onChange={e => setDescription(e.target.value)}
                            value={description}
                            label="Description"
                            sx={{
                                width: "100%",
                                backgroundColor: palette.neutral.light,
                                marginTop: "1rem",
                            }}
                        />
                    </Box>
                    {isImage && <Box
                        border={`1px solid ${palette.neutral.medium}`}
                        borderRadius="5px"
                        mt='1rem'
                        p="1rem"
                    >
                        <FlexBetween>
                            <Dropzone
                                acceptedFiles=".jpg,.jpeg,.png"
                                multiple={false}
                                onDrop={async (acceptedFiles) => {
                                    setImageName(acceptedFiles[0].name)
                                    setImage(await convertToBase64(acceptedFiles[0]))
                                }}
                            >
                                {({ getRootProps, getInputProps }) => (
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        width="100%"
                                        sx={{
                                            "&:hover": {
                                                cursor: "pointer"
                                            },
                                        }}
                                    >
                                        <input {...getInputProps()} />
                                        {!image ? (
                                            <p>Add Image Here</p>
                                        ) : (
                                            <FlexBetween>
                                                <Typography>{imageName}</Typography>
                                                <IconButton>
                                                    <EditOutlined />
                                                </IconButton>
                                            </FlexBetween>
                                        )}
                                    </Box>
                                )}
                            </Dropzone>
                            {image && (<Box sx={{ width: "15%", textAlign: "center" }}>
                                <IconButton onClick={() => setImage(null)} >
                                    <DeleteOutlined />
                                </IconButton>
                            </Box>
                            )}
                        </FlexBetween>
                    </Box>}

                    <Divider sx={{ margin: "1.25rem 0" }} />

                    <Box gap="0.2rem" onClick={toggleImage} sx={{ display: 'flex', "&:hover": { cursor: "pointer", color: palette.neutral.medium } }}>
                        <ImageOutlined sx={{ color: palette.neutral.mediumMain }} />
                        <Typography color={palette.neutral.mediumMain}>{!isImage ? "Add" : "Remove"} Image</Typography>
                    </Box>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog2}>Cancel</Button>
                    <Button onClick={editPost} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

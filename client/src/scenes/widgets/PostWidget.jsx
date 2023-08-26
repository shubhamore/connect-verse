import React, { useState, useEffect } from 'react'
import { ChatBubbleOutlineOutlined, DeleteOutlined, EditOutlined, ImageOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
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
import moment from 'moment/moment';
import Comment from 'components/Comment';

export default function PostWidget({ postId, userId, name, desc, postImg, likes, comments, isEdited, isProfile, createdAt }) {
    const [userData, setUserData] = useState({});
    const [isComments, setIsComments] = useState(false)
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const loggedInUserId = useSelector(state => state.user._id)
    const isLiked = Boolean(likes[loggedInUserId])
    const likeCount = Object.keys(likes).length
    const main = palette.neutral.main
    const primary = palette.primary.main
    const [comment, setComment] = useState("")
    const time = moment(createdAt).fromNow()
    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [displayedChars, setDisplayedChars] = useState(500); // Initial number of characters to display
    const increment = 1250; // Number of characters to show when "Show More" is clicked
    const [profileImg, setProfileImg] = useState("data:image/png;base64,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")

    const toggleShowMore = () => {
        setDisplayedChars(displayedChars + increment);
    };

    const resetDisplay = () => {
        setDisplayedChars(500); // Reset to the initial 500 characters
    };

    const isCompleteDisplay = displayedChars >= desc.length; // Check if complete content is displayed
    const isShortDesc = desc.length <= 500; // Check if desc is short


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

    // open menu for options
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // open dialog for Delete
    const [openDialog, setOpenDialog] = React.useState(false);
    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        handleClose()
    };

    // open dialog for Edit
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
            body: JSON.stringify({ postId, desc: description.trim(), postImg: image })
        })
        const data = await response.json()
        handleClose()
        setOpenDialog2(false)
        dispatch(setPost({ post: data }))
        toast.success("Post edited successfully")
    }

    const postComment = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/comment`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ postId, userId: loggedInUserId, comment: comment.trim() })
        })
        const data = await response.json()
        dispatch(setPost({ post: data }))
        setComment("")
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

    function copyToClipboard() {
        navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL}/post/${postId}`)
        toast.info("Post link copied to clipboard", { position: 'top-right' })
    }

    useEffect(() => {
        // Fetch user data for all comments when the component mounts
        const fetchUserData = async () => {
            try {
                // Iterate through comments and fetch user data for each comment's user
                for (const comment of comments) {
                    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${comment.userId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const userDataForComment = await response.json();
                        console.log("userDataForComment=", userDataForComment)
                        setUserData(prevData => ({
                            ...prevData,
                            [comment._id]: userDataForComment,
                        }));
                    } else {
                        console.error(`Failed to fetch user data for comment with ID ${comment.id}`);
                    }
                }
                setLoading1(false);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [comments, token]);

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            setProfileImg(data.profilePicture)
            setLoading2(false)
        }
        getUser()
    }, [])

    return (
        <>
            <WidgetWrapper mb="2rem">
                <Connection
                    connectionId={userId}
                    name={name}
                    showConnect={!isProfile}
                    time={time}
                    profilePicture={profileImg}
                />
                <Typography color={main} sx={{ mt: "1rem" }}>
                    <Typography color={main} sx={{ mt: "1rem", whiteSpace: "pre-line" }}>
                        {desc.slice(0, displayedChars)}
                        {isCompleteDisplay ? (
                            <>
                                {isShortDesc ? null : (
                                    <Button style={{ backgroundColor: 'transparent', padding: '0px 5px' }} variant="text" onClick={resetDisplay}>See Less</Button>
                                )}
                            </>
                        ) : (
                            <>
                                {desc.length > displayedChars && (
                                    <Button style={{ backgroundColor: 'transparent', padding: '0px 5px' }} variant="raised" onClick={toggleShowMore}>... Show More</Button>
                                )}
                            </>
                        )}
                    </Typography>
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
                    <Typography color={palette.neutral.medium} sx={{ mt: "0.5rem", display: "flex", alignItems: "center" }}><EditOutlined sx={{ fontSize: "17px", mr: "3.5px" }} />Edited</Typography>
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
                            onClick={copyToClipboard}
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
                        <div style={{
                            position: 'relative',
                            width: "100%",
                            backgroundColor: palette.neutral.light,
                            borderRadius: ".25rem",
                            padding: '.5rem 1rem',
                            margin: "1rem 0rem",
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: 'space-between'
                        }}>
                            <InputBase
                                placeholder="Share your thoughts..."
                                multiline
                                onChange={e => setComment(e.target.value)}
                                value={comment}
                                sx={{ width: "100%" }}
                            />
                            <IconButton onClick={postComment} disabled={!comment || comment.length > 2500 || comment.trim().length === 0}>
                                <SendIcon sx={{ color: "primary" }} />
                            </IconButton>
                        </div>
                        {comment.length > 2500 && <Typography color="error.main">Comment can't be more than 2500 characters</Typography>}
                        <Divider />

                        {!loading1 &&!loading2&& comments.map((comment, index) => (
                            userData[comment._id] && <Comment key={`${comment._id}`} comment={comment} userData={userData[comment._id]} postId={postId} />
                        ))}
                        <Divider />
                        {comments.length === 0 && (
                            <>
                                <Typography color={main} sx={{ m: "0.5rem" }}>
                                    No comments yet
                                </Typography>
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
                    {description.length > 4000 && <Typography color="error.main">Post can't be more than 4000 characters</Typography>}
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
                    <Button onClick={editPost} disabled={description.length > 4000 || (image === postImg && desc === description) || description.trim().length === 0} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    )
}

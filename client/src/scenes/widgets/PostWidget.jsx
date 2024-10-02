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
import Loading from 'components/Loading';

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
    const [loading, setLoading] = useState(false)
    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [displayedChars, setDisplayedChars] = useState(500); // Initial number of characters to display
    const increment = 1250; // Number of characters to show when "Show More" is clicked
    const [profileImg, setProfileImg] = useState("https://res.cloudinary.com/duaon5qkj/image/upload/v1699860664/base%28do%20not%20delete%29/profile_icon_jnd5yl.png")

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
        setLoading(true)
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
        setLoading(false)
    }

    const editPost = async () => {
        setLoading(true)
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
        setLoading(false)
    }

    const postComment = async () => {
        setLoading(true)
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
        setLoading(false)
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
        const postUrl = `${window.location.origin}/post/${postId}`;
        
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                toast.info("Post link copied to clipboard", { position: 'top-right' });
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
                toast.error("Failed to copy link", { position: 'top-right' });
            });
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
                        //console.log("userDataForComment=", userDataForComment)
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
            {!loading?<>
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

                            {!loading1 && !loading2 && comments.map((comment, index) => (
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
                                    accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
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

            </>:<Loading loading={loading}/>}
        </>
    )
}

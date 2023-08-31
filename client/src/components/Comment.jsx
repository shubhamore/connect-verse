import React, { useState, useEffect } from 'react'
import { Box, Typography, useTheme, Menu, MenuItem, IconButton, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UserImage from './UserImage'
import { useDispatch, useSelector } from 'react-redux'
import FlexBetween from 'components/FlexBetween'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField';
import moment from 'moment/moment';
import { setPost, setPosts } from 'state'


export default function Comment({ comment, userData, postId }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const token = useSelector(state => state.token)
    const loggedInUserId = useSelector(state => state.user._id)
    const [loading, setLoading] = useState(true)
    const { palette } = useTheme()
    const time = moment(comment.createdAt).fromNow()
    const [newComment, setNewComment] = useState(comment.comment)
    const [displayedChars, setDisplayedChars] = useState(350); 
    const increment = 1000; 

    const toggleShowMore = () => {
        setDisplayedChars(displayedChars + increment);
    };

    const resetDisplay = () => {
        setDisplayedChars(350); 
    };

    const isCompleteDisplay = displayedChars >= comment.comment.length; 
    const isShortComment = comment.comment.length <= 350;


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
        // setDescription(desc)
        // setImage(postImg)
        // setIsImage(postImg ? true : false)
        // setImageName("Posted Image")
        handleClose()
    };

    const deleteComment = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/deleteComment`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                commentId: comment._id,
                postId: postId
            })
        })
        const data = await response.json()
        //console.log(data)
        dispatch(setPost({ post: data }))
    }

    const editComment = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/editComment`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment: newComment.trim(),
                commentId: comment._id,
                postId: postId
            })
        })
        const data = await response.json()
        //console.log(data)
        handleClose()
        setOpenDialog2(false)
        dispatch(setPost({ post: data }))
    }

    return (
        <>
            <FlexBetween sx={{
                backgroundColor: palette.neutral.light,
                borderRadius: ".25rem",
                padding: '.5rem 1rem',
                margin: "1rem 0rem",
                alignItems: "flex-start"
            }}>
                <Box
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                        navigate(`/profile/${comment.userId}`)
                    }}
                >
                    <UserImage image={userData.profilePicture} size="30px" />
                </Box>
                <Box gap=".25rem" sx={{ display: 'flex', flex: '1', marginLeft: '5px', flexDirection: "column" }}>
                    <FlexBetween>
                        <Box
                            sx={{ lineHeight: '1', minHeight: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                            onClick={() => {
                                navigate(`/profile/${comment.userId}`)
                            }}
                        >
                            <Typography
                                color={palette.neutral.main}
                                variant='h7'
                                fontWeight="500"
                                sx={{
                                    lineHeight: '1',
                                    "&:hover": {
                                        cursor: "pointer",
                                    }
                                }}
                            >
                                {userData.name}
                            </Typography>
                            {comment.createdAt && (<>
                                <Typography color={palette.neutral.medium} sx={{ margin: "0", lineHeight: '1' }}>{time}</Typography>
                            </>
                            )}
                        </Box>
                        {loggedInUserId === comment.userId && <div>
                            <IconButton
                                onClick={handleClick}
                                sx={{
                                    "&:hover": {
                                        color: palette.primary.main
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
                                <MenuItem onClick={handleClickOpenDialog2}><EditIcon sx={{ fontSize: '17.5px', marginRight: '10px' }} />Edit comment</MenuItem>
                                <MenuItem onClick={handleClickOpenDialog}><DeleteIcon sx={{ fontSize: '17.5px', marginRight: '10px' }} />Delete comment</MenuItem>
                            </Menu>
                        </div>}
                    </FlexBetween>
                    <Typography sx={{whiteSpace:"pre-line"}}>{comment.comment.slice(0, displayedChars)}
                        {isCompleteDisplay ? (
                            <>
                                {isShortComment ? null : (
                                    <Button style={{ backgroundColor: 'transparent',padding:"0px 5px" }} variant="text" onClick={resetDisplay}>See Less</Button>
                                )}
                            </>
                        ) : (
                            <>
                                {comment.comment.length > displayedChars && (
                                    <Button style={{ backgroundColor: 'transparent',padding:"0px 5px" }} variant="raised" onClick={toggleShowMore}>... Show More</Button>
                                )}
                            </>
                        )}</Typography>
                </Box>
            </FlexBetween>

            {/* Delete post Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
            >
                <DialogTitle>
                    Are you sure you want to delete this comment?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={deleteComment} autoFocus>
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
                    Edit comment
                </DialogTitle>
                <DialogContent>
                    <Box gap="1.5rem">
                        <TextField
                            multiline
                            onChange={e => setNewComment(e.target.value)}
                            value={newComment}
                            label="new-comment"
                            sx={{
                                width: "100%",
                                backgroundColor: palette.neutral.light,
                                marginTop: "1rem",
                            }}
                        />
                    </Box>
                    {newComment.length >2500 && <Typography color="error.main">Comment can't be more than 2500 characters</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog2}>Cancel</Button>
                    <Button onClick={editComment} disabled={newComment.length>2500 || newComment===comment.comment || newComment.trim().length===0} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

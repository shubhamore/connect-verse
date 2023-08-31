import React, { useState,useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from 'scenes/navbar/Navbar'
import UserImage from 'components/UserImage'
import UserWidget from 'scenes/widgets/UserWidget'
import { DeleteOutlined, EditOutlined, ShareOutlined, PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material'
import { Box, Divider, Typography, Button, useTheme, IconButton } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper'
import FlexBetween from 'components/FlexBetween'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ConnectionListWidget from 'scenes/widgets/ConnectionListWidget'
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Dropzone from 'react-dropzone'
import { setLogin } from 'state'
import SideWidget from 'scenes/widgets/SideWidget'
import { useParams } from 'react-router-dom'
import PostsWidget from 'scenes/widgets/PostsWidget'
import { toast } from "react-toastify"
import { setConnection } from 'state'

export default function MyProfile({ isUser = false }) {
    const { userId } = useParams()
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const { _id } = useSelector(state => state.user)
    const user = useSelector(state => state.user)
    const {connections} = useSelector(state => state.user)
    const [displayedChars, setDisplayedChars] = useState(750);
    const increment = 1000;
    const [image, setImage] = useState(user.profilePicture)
    const [imageName, setImageName] = useState("Posted Image")
    const [isConnection, setIsConnection] = useState(connections.some((connection) => connection._id === _id))

    const patchConnection = async (method) => {
        //console.log("patch connection pressed")
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${_id}/${userId}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
        })
        const data = await response.json()
        setIsConnection(!isConnection)
        dispatch(setConnection({ connections: data }))
    }

    const [newuser, setNewUser] = useState({
        name: user.name,
        about: user.about,
        location: user.location,
        occupation: user.occupation,
        organization: user.organization,
    });

    const handleChange = (event, key) => {
        const updatedUser = { ...newuser, [key]: event.target.value };
        setNewUser(updatedUser);
    };

    const toggleShowMore = () => {
        setDisplayedChars(displayedChars + increment);
    };

    const resetDisplay = () => {
        setDisplayedChars(750);
    };

    const isCompleteDisplay = user && user.about && displayedChars >= user.about.length; // Check if complete content is displayed
    const isShortabout = user && user.about && user.about.length <= 750; // Check if user.about is short

    const resetForm = () => {
        const originalUser = {
            name: user.name,
            about: user.about,
            location: user.location,
            occupation: user.occupation,
            organization: user.organization,
        };
        setImage(user.profilePicture)
        setNewUser(originalUser);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm()
    };

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

    const editProfile = async () => {
        const updatedUser = { ...newuser, profilePicture: image, userId: user._id };
        //console.log("updatedUser=", updatedUser)
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/edit`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedUser)
        })
        const data = await response.json()
        //console.log("data=", data)
        dispatch(setLogin({ user: data, token }))
        setOpen(false)
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(`${process.env.REACT_APP_FRONTEND_URL}/profile/${isUser ? user._id : userId}`)
        toast.info("Profile link copied to clipboard", { position: 'top-right' })
    }

    return (
        <div>
            <Navbar />
            <Box mt="6.5rem" />
            <Box>
                <Box sx={{ width: '850px', margin: "0 auto", maxWidth: "90vw" }}>
                    <WidgetWrapper sx={{padding:"1rem"}}>
                        <Box sx={{display:'flex',alignItems:'center'}}>
                            {!isUser&&_id!==userId&&<IconButton sx={{ backgroundColor: palette.neutral.light,"&:hover":{ color: palette.primary.main} }} onClick={patchConnection}>
                                {isConnection ? (
                                    <PersonRemoveOutlined />
                                ) : (
                                    <PersonAddOutlined />
                                )}
                            </IconButton>}
                            {/* <Typography style={{ flex: 1 , alignItems:'center'}}></Typography> */}
                            <IconButton
                                onClick={copyToClipboard}
                                sx={{
                                    backgroundColor: palette.neutral.light,
                                    "&:hover": {
                                        color: palette.primary.main
                                    },
                                    marginLeft:'auto'
                                }}
                            >
                                <ShareOutlined />
                            </IconButton>
                        </Box>
                    </WidgetWrapper>
                    <Box mt="2rem" />
                    <SideWidget userId={isUser ? user._id : userId} showEditBtn={isUser} />
                    {/* <WidgetWrapper style={{ position: 'relative' }}>
                        <Box sx={{ position: 'absolute', right: '1.5rem' }}>
                            <IconButton sx={{ backgroundColor: palette.neutral.light }} onClick={handleClickOpen}>
                                <EditIcon sx={{ fontSize: '1.5rem' }} />
                            </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                            <Box sx={{ margin: '0 15px' }}>
                                <UserImage image={user.profilePicture} size="100px" />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: "center", flexDirection: 'column', margin: '15px' }}>
                                <h2 style={{ margin: '0px', padding: '0px', wordBreak: 'break-word', marginBottom: '5px' }}>Name: {user.name}</h2>
                                <p style={{ margin: '0px', padding: '0px', wordBreak: 'break-word' }}>E-mail: {user.email}</p>
                            </Box>
                        </Box>
                        <Divider sx={{ margin: '15px 0' }} />
                        {user.about ? <Typography variant="h6" sx={{ margin: '15px 0', textAlign: "justify",whiteSpace:"pre-line" }}>
                            {user.about.slice(0, displayedChars)}
                            {isCompleteDisplay ? (
                                <>
                                    {isShortabout ? null : (
                                        <Button style={{ backgroundColor: 'transparent', padding: '0px 5px' }} variant="text" onClick={resetDisplay}>See Less</Button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {user.about.length > displayedChars && (
                                        <Button style={{ backgroundColor: 'transparent', padding: '0px 5px' }} variant="text" onClick={toggleShowMore}>... Show More</Button>
                                    )}
                                </>
                            )}
                        </Typography> : <Typography variant="h6" sx={{ margin: '15px 0', textAlign: "justify" }}>About: <Typography color={palette.neutral.medium} sx={{ display: 'inline' }} >N/A</Typography></Typography>}
                        <Divider sx={{ margin: '15px 0' }} />
                        <Typography variant="h6" sx={{ margin: '15px 0', display: 'flex', alignItems: 'center' }}><WorkIcon sx={{ mr: "5px" }} />: {user.occupation ? user.occupation : <Typography color={palette.neutral.medium} > N/A</Typography>}</Typography>
                        <Typography variant="h6" sx={{ margin: '15px 0', display: 'flex', alignItems: 'center' }}><CorporateFareIcon sx={{ mr: "5px" }} />: {user.organization ? user.organization : <Typography color={palette.neutral.medium} > N/A</Typography>}</Typography>
                        <Typography variant="h6" sx={{ margin: '15px 0', display: 'flex', alignItems: 'center' }}><LocationOnIcon sx={{ mr: "5px" }} />: {user.location ? user.location : <Typography color={palette.neutral.medium} > N/A</Typography>}</Typography>
                    </WidgetWrapper> */}
                    <Box mt="2rem" />
                    <ConnectionListWidget userId={isUser ? user._id : userId} />
                    <Box mt="2rem" />
                    <WidgetWrapper sx={{ backgroundColor: palette.neutral.light }}>
                        <Typography variant="h2" sx={{ margin: '15px 0', textAlign: "center" }}>Recent Posts</Typography>
                        <PostsWidget Id={isUser ? user._id : userId} isProfile={true} />
                    </WidgetWrapper>
                </Box>
            </Box>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            Edit Profile
                        </Typography>
                        <Button autoFocus disabled={newuser.name.trim().length === 0} color="inherit" onClick={editProfile}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Box
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
                        </FlexBetween>
                    </Box>
                    {Object.keys(newuser).map((key) => (
                        <TextField
                            key={key}
                            fullWidth
                            label={key.charAt(0).toUpperCase() + key.slice(1)} // Capitalize the key for the label
                            type='text'
                            value={newuser[key]}
                            onChange={(event) => handleChange(event, key)}
                            multiline={key === 'about'}
                            sx={{ margin: '1rem 0rem' }}
                        />
                    ))}
                </DialogContent>
            </Dialog>

        </div >
    )
}

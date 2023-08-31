import React, { useState, useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import UserImage from 'components/UserImage'
import { ManageAccountsOutlined,EditOutlined } from "@mui/icons-material"
import { Box, Divider, Typography, Button, useTheme, IconButton,TextField } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom"
import { setLogin } from 'state'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Dropzone from 'react-dropzone'
import FlexBetween from 'components/FlexBetween'

export default function SideWidget({ userId, showAbout = true, showEditBtn = false }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { palette } = useTheme()
    const token = useSelector(state => state.token)
    const id = useSelector(state => state.user._id)
    const [user, setUser] = useState(null)
    const [displayedChars, setDisplayedChars] = useState(750);
    const increment = 1000;
    const [loading, setLoading] = React.useState(true)
    const isUser = userId === id
    const [image, setImage] = useState("")
    const [imageName, setImageName] = useState("Posted Image")
    const [newuser, setNewUser] = useState({
        name: "",
        about: "",
        location: "",
        occupation: "",
        organization: "",
    });
    const [open, setOpen] = React.useState(false);

    const toggleShowMore = () => {
        setDisplayedChars(displayedChars + increment);
    };

    const resetDisplay = () => {
        setDisplayedChars(750);
    };

    const isCompleteDisplay = user && user.about && displayedChars >= user.about.length;
    const isShortabout = user && user.about && user.about.length <= 750;

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

    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setUser(data)
        // setImage(data.profilePicture)
        // resetForm()
        setLoading(false)
    }

    useEffect(() => {
        getUser()
        // resetForm()
    }, [userId])
    useEffect(() => {
        //console.log("user=", user)
    }, [user])

    if (!user) return null;



    const handleChange = (event, key) => {
        const updatedUser = { ...newuser, [key]: event.target.value };
        setNewUser(updatedUser);
    };

    const handleClickOpen = () => {
        resetForm()
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
        const updatedUser = { ...newuser, profilePicture: image,userId:user._id };
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
        setUser(data)
        dispatch(setLogin({ user: data, token }))
        setOpen(false)
    }


    return (
        <>
            {!loading ? <WidgetWrapper style={{ position: 'relative' }}>
                {isUser ? (<Box sx={{ position: 'absolute', right: '1.5rem' }}>
                    {!showEditBtn ? (<IconButton sx={{ backgroundColor: palette.neutral.light }} onClick={() => navigate("/myProfile")}>
                        <ManageAccountsOutlined sx={{ fontSize: '1.5rem' }} />
                    </IconButton>) : <IconButton sx={{ backgroundColor: palette.neutral.light }} onClick={handleClickOpen}>
                        <EditIcon sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                    }
                </Box>) : null}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Box sx={{ margin: '0 15px' }}>
                        <UserImage image={user.profilePicture} size="100px" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: "center", flexDirection: 'column', margin: '15px' }}>
                        <h2 style={{ margin: '0px', padding: '0px', wordBreak: 'break-word', marginBottom: '5px' }}>Name: {user.name}</h2>
                        {isUser && <p style={{ margin: '0px', padding: '0px', wordBreak: 'break-word' }}>E-mail: {user.email}</p>}
                    </Box>
                </Box>
                {showAbout ? (
                    user.about ? (
                        <Typography variant="h6" sx={{ margin: '15px 0', textAlign: "justify", whiteSpace: "pre-line" }}>
                            <Divider sx={{ margin: '15px 0' }} />
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
                        </Typography>
                    ) : (
                        <Typography variant="h6" sx={{ margin: '15px 0', textAlign: "justify" }}>
                            <Divider sx={{ margin: '15px 0' }} />
                            About: <Typography color={palette.neutral.medium} sx={{ display: 'inline' }}>N/A</Typography>
                        </Typography>
                    )
                ) : null}
                <Divider sx={{ margin: '15px 0' }} />
                <Typography variant="h6" sx={{ margin: '15px 0', display: 'flex', alignItems: 'center' }}><WorkIcon sx={{ mr: "5px" }} />: {user.occupation ? user.occupation : <Typography color={palette.neutral.medium} >N/A</Typography>}</Typography>
                <Typography variant="h6" sx={{ margin: '15px 0', display: 'flex', alignItems: 'center' }}><CorporateFareIcon sx={{ mr: "5px" }} />: {user.organization ? user.organization : <Typography color={palette.neutral.medium} >N/A</Typography>}</Typography>
                <Typography variant="h6" sx={{ margin: '15px 0', display: 'flex', alignItems: 'center' }}><LocationOnIcon sx={{ mr: "5px" }} />: {user.location ? user.location : <Typography color={palette.neutral.medium} >N/A</Typography>}</Typography>
            </WidgetWrapper> : <></>}
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
                        <Button autoFocus disabled={newuser.name.trim().length===0} color="inherit" onClick={editProfile}>
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
        </>
    )
}

import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import UserImage from 'components/UserImage'
import { ManageAccountsOutlined} from "@mui/icons-material"
import { Box, Divider, Typography, Button, useTheme, IconButton } from '@mui/material'
import WidgetWrapper from 'components/WidgetWrapper'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom"

export default function SideWidget({ userId, showAbout = true }) {
    const navigate=useNavigate()
    const { palette } = useTheme()
    const token = useSelector(state => state.token)
    const id = useSelector(state => state.user._id)
    const [user, setUser] = useState(null)
    const [displayedChars, setDisplayedChars] = useState(750);
    const increment = 1000;
    const [loading, setLoading] = React.useState(true)
    const isUser=userId===id

    const toggleShowMore = () => {
        setDisplayedChars(displayedChars + increment);
    };

    const resetDisplay = () => {
        setDisplayedChars(750);
    };

    const isCompleteDisplay = user && user.about && displayedChars >= user.about.length; // Check if complete content is displayed
    const isShortabout = user && user.about && user.about.length <= 750; // Check if user.about is short

    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        setUser(data)
        setLoading(false)
    }

    useEffect(() => {
        getUser()
    }, [userId])
    useEffect(() => {
        console.log("user=", user)
    }, [user])

    if (!user) return null;

    return (
        <>
            {!loading ? <WidgetWrapper style={{ position: 'relative' }}>
                {isUser && <Box sx={{ position: 'absolute', right: '1.5rem' }}>
                    <IconButton sx={{ backgroundColor: palette.neutral.light }} onClick={()=>navigate("/myProfile")}>
                        <ManageAccountsOutlined sx={{ fontSize: '1.5rem' }} />
                    </IconButton>
                </Box>}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Box sx={{ margin: '0 15px' }}>
                        <UserImage image={user.profilePicture} size="100px" />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: "center", flexDirection: 'column', margin: '15px' }}>
                        <h2 style={{ margin: '0px', padding: '0px', wordBreak: 'break-word', marginBottom: '5px' }}>Name: {user.name}</h2>
                        <p style={{ margin: '0px', padding: '0px', wordBreak: 'break-word' }}>E-mail: {user.email}</p>
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
        </>
    )
}

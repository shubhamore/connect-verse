import React from 'react'
import { Box, IconButton, Typography, useTheme } from "@mui/material"
import Connection from 'components/Connection'
import WidgetWrapper from 'components/WidgetWrapper'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setConnection } from 'state'
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import FlexBetween from 'components/FlexBetween'

export default function ConnectionListWidget({ userId }) {
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const token = useSelector(state => state.token)
    const connections = useSelector(state => state.user.connections)
    const [loading, setLoading] = React.useState(true)
    const [show, setShow] = useState(false);
    
    const getConnections = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/connections/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        dispatch(setConnection({ connections: data }))
        setLoading(false)
    }

    useEffect(() => {
        if(token)
        getConnections()
    }, [userId,token])
    
    if(!connections) return null

    return (
        <WidgetWrapper>
            <FlexBetween style={{ alignItems: 'flex-start' }}>
                <Box>

                    <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: ".25rem" }}>
                        Connection List
                    </Typography>
                    <Typography color={palette.neutral.medium} sx={{ mb: "1rem" }}>{connections.length} connections</Typography>
                </Box>
                <IconButton onClick={() => setShow(!show)} sx={{padding:"0px"}}>

                <ArrowDropDownCircleIcon
                    sx={{
                        cursor: 'pointer',
                        fontSize: '40px',
                        transition: 'transform 0.25s', 
                        transform: show ? 'rotate(0deg)' : 'rotate(180deg)', 
                    }}
                />
                </IconButton>
            </FlexBetween>
            <div
                style={{
                    overflow: 'hidden',
                    maxHeight: show ? '1000px' : '0', 
                    transition: 'max-height 0.75s', 
                }}
            >
                {(show && loading) ? (
                    <Typography>Loading...</Typography>
                ) : show && (
                    <Box display='flex' flexDirection='column' gap='1.5rem'>
                        {connections.map(connection => (
                            <Connection
                                key={connection._id}
                                connectionId={connection._id}
                                name={connection.name}
                                profilePicture={connection.profilePicture}
                            />
                        ))}
                        {connections.length === 0 && <Typography color={palette.neutral.dark}>No connections yet</Typography>}
                    </Box>
                )}
            </div>
        </WidgetWrapper>
    )
}

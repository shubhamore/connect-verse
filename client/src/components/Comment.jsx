import React, { useState, useEffect } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import UserImage from './UserImage'
import { useDispatch, useSelector } from 'react-redux'
import FlexBetween from 'components/FlexBetween'
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment';

export default function Comment({ comment }) {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const token = useSelector(state => state.token)
    const [loading, setLoading] = useState(true)
    const { palette } = useTheme()
    const time = moment(comment.createdAt).fromNow()

    const getUser = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${comment.userId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        setUser(data)
        setLoading(false)
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            {!loading ? <FlexBetween sx={{
                backgroundColor: palette.neutral.light,
                borderRadius: ".25rem",
                padding: '.5rem 1rem',
                margin: "1rem 0rem",
                alignItems: "flex-start"
            }}>
                <Box
                    sx={{cursor:"pointer"}}
                    onClick={() => {
                        navigate(`/profile/${comment.userId}`)
                    }}
                >
                    <UserImage image={user.profilePicture} size="30px" />
                </Box>
                <Box gap=".25rem" sx={{ display: 'flex', flex: '1', marginLeft: '5px', flexDirection: "column" }}>
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
                            {user.name}
                        </Typography>
                        {comment.createdAt && (<>
                            <Typography color={palette.neutral.medium} sx={{ margin: "0", lineHeight: '1' }}>{time}</Typography>
                        </>
                        )}
                    </Box>
                    <Typography>{comment.comment}</Typography>
                </Box>
            </FlexBetween> : <></>}
        </>
    )
}

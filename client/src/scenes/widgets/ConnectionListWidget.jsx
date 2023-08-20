import React from 'react'
import {Box,Typography,useTheme} from "@mui/material"
import Connection from 'components/Connection'
import WidgetWrapper from 'components/WidgetWrapper'
import { useEffect,useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { setConnection } from 'state'

export default function ConnectionListWidget({userId}) {
    const {palette}=useTheme()
    const dispatch=useDispatch()
    const token=useSelector(state=>state.token)
    const connections=useSelector(state=>state.user.connections)
    const [loading,setLoading]=React.useState(true)

    const getConnections=async()=>{
        const response=await fetch(`${process.env.REACT_APP_BASE_URL}/user/connections/${userId}`,{
            method:"GET",
            headers:{Authorization: `Bearer ${token}`}
        })
        const data=await response.json()
        dispatch(setConnection({connections:data}))
        setLoading(false)
    }

    useEffect(()=>{
        getConnections()
    },[])

  return (
    <WidgetWrapper>
        <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{mb:"1.5rem"}}>
            Connection List
        </Typography>
        {!loading?<Box display='flex' flexDirection='column' gap='1.5rem'>
            {connections.map(connection=>(
                <Connection
                    key={connection._id}
                    connectionId={connection._id}
                    name={connection.name}
                />
            ))}
            {connections.length===0&&<Typography color={palette.neutral.dark}>No connections yet</Typography>}
        </Box>:<Typography>Loading...</Typography>}
    </WidgetWrapper>
  )
}

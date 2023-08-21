import React, { useEffect } from 'react'
import { Box, Typography, useTheme, IconButton } from '@mui/material'
import { useSelector,useDispatch } from 'react-redux'
import { setMode, setLogout } from "state"
import { useNavigate } from 'react-router-dom'
import { DarkMode, LightMode } from "@mui/icons-material"
import Form from "./Form"

export default function LoginPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token=useSelector(state=>state.token)
  if(token) navigate("/home")

  const checkLogin=async()=>{
    const data=localStorage.getItem("persist:root")

    if(data){
      const token=JSON.parse(JSON.parse(data).token)
      const response=await fetch(`${process.env.REACT_APP_BASE_URL}/auth/verify`,{
        method:"GET",
        headers:{Authorization:`Bearer ${token}`}
      })
      const result=await response.json()
      if(response.ok) navigate("/home")
      else dispatch(setLogout())
    }
  }


  useEffect(()=>{
    checkLogin()
  },[])
  
  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
      >
        <Typography
          fontWeight="bold"
          fontSize="2rem"
          color="secondary"
          sx={{
            flex: 1,
            textAlign: "center",
            "@media screen and (max-width: 400px)": {
              fontSize: "1.5rem"
            },
            "@media screen and (max-width: 320px)": {
              fontSize: "1.25rem"
            },
            "@media screen and (max-width: 280px)": {
              fontSize: "1rem"
            },
          }}
        >
          Connect Verse
        </Typography>
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === "dark" ? <DarkMode color='primary' sx={{ fontSize: "25px" }} /> : <LightMode sx={{ fontSize: "25px", color: "#ffbc00" }} />}
        </IconButton>
      </Box>
      <Box
        display="flex"
        width="500px"
        maxWidth="90vw"
        flexDirection="column"
        textAlign="center"
        backgroundColor={theme.palette.background.alt}
        borderRadius="1.5rem"
        p="2rem"
        m="2rem auto"
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Connect Verse!
        </Typography>
        <Form />
      </Box>
    </Box>
  )
}

import React from 'react'
import { Box, Typography, useTheme, IconButton } from '@mui/material'
import { useDispatch } from 'react-redux'
import { setMode } from "state"
import { DarkMode, LightMode } from "@mui/icons-material"
import Form from "./Form"

export default function LoginPage() {
  const theme = useTheme()
  const dispatch = useDispatch()

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

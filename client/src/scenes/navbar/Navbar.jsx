import {useState} from 'react'
import {Box,IconButton,InputBase,Typography,Select,MenuItem,FormControl,useTheme,useMediaQuery} from "@mui/material"
import { Search,Message,DarkMode,LightMode,Notifications,Help,Menu,Close,Logout} from "@mui/icons-material"
import { useDispatch,useSelector } from 'react-redux'
import {setMode,setLogout} from "state"
import { useNavigate } from 'react-router-dom'
import FlexBetween from 'components/FlexBetween'

export default function Navbar() {
  // Used when a new menu is required for mobile
  // const [isMobileMenuToggled,setIsMobileMenuToggled] = useState(false)
  // const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user= useSelector(state => state.user)

  const theme = useTheme()
  const neutralLight = theme.palette.neutral.light
  const dark = theme.palette.neutral.dark
  const background = theme.palette.background.default
  const primaryLight = theme.palette.primary.light
  const alt=theme.palette.background.alt

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={alt}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="2rem"
          onClick={()=>navigate("/home")}
          color="secondary"
          sx={{
            "&:hover":{
              cursor:"pointer",
              opacity:0.8,
              transition:"opacity .5s ease-out"
            },
            "@media screen and (max-width: 400px)":{
              fontSize:"1.5rem"
            },
            "@media screen and (max-width: 320px)":{
              fontSize:"1.25rem"
            },
            "@media screen and (max-width: 280px)":{
              fontSize:"1rem"
            },
          }}
          >
          Connect Verse
          </Typography>
      </FlexBetween>
      <FlexBetween gap="1rem" >
        <IconButton onClick={()=>dispatch(setMode())}>
          {theme.palette.mode==="dark"?<DarkMode color='primary' sx={{fontSize:"25px"}}/>:<LightMode sx={{fontSize:"25px", color:"#ffbc00"}}/>}
        </IconButton>
        <IconButton onClick={()=>dispatch(setLogout())}>
          <Logout sx={{fontSize:"25px",color:"red"}}/>
        </IconButton>
      </FlexBetween>
    </FlexBetween>
  )
}

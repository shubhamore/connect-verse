import {ManageAaccountOutlined, ManageAccountsOutlined} from "@mui/icons-material"
import {Box,Typography,Divider,useTheme} from "@mui/material"
import UserImage from "components/UserImage"
import FlexBetween from "components/FlexBetween"
import WidgetWrapper from "components/WidgetWrapper"
import {useSelector} from "react-redux"
import {useEffect,useState} from "react"
import { useNavigate } from "react-router-dom"

const UserWidget=({userId,profilePicture})=>{
    const [user,setUser]=useState(null)
    const {palette} =useTheme()
    const navigate=useNavigate()
    const token = useSelector(state=>state.token)
    const dark=palette.neutral.dark
    const medium=palette.neutral.medium
    const main=palette.neutral.main

    const getUser=async()=>{
        const response =await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}`,{
            method:"GET",
            headers:{Authorization: `Bearer ${token}`}
        })
        const data=await response.json()
        setUser(data)
    }

    useEffect(()=>{
        getUser()
    },[userId])

    if(!user) return null;

    return(
        <WidgetWrapper>
            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={()=>navigate(`/profile/${userId}`)}
            >
                <FlexBetween gap="1rem">
                    <UserImage image={profilePicture}/>
                    <Box>
                        <Typography
                            variant="h4"
                            color={dark}
                            fontWeight="500"
                        >
                            {user.name}
                        </Typography>
                        <Typography color={medium}>{user.connections.length} connections</Typography>
                    </Box>
                </FlexBetween>
                    <ManageAccountsOutlined/>
            </FlexBetween>
        </WidgetWrapper>
    )
}

export default UserWidget
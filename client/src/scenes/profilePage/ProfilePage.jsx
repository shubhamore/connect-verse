import React, { useState, useEffect } from 'react'
import { Box, useMediaQuery } from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Navbar from 'scenes/navbar/Navbar'
import ConnectionListWidget from 'scenes/widgets/ConnectionListWidget'
import MyPostWidget from 'scenes/widgets/MyPostWidget'
import PostsWidget from 'scenes/widgets/PostsWidget'
import UserWidget from 'scenes/widgets/UserWidget'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const { userId } = useParams()
  const token = useSelector(state => state.token)
  const isNonMobileScreen = useMediaQuery("(min-width:1000px")

  const getUser = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await response.json()
    setUser(data)
  }

  useEffect(() => {
    getUser()
  }, [])

  if (!user) return <div>Loading...</div>

  return (
    <div>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
          <UserWidget userId={userId} profilePicture={user.profilePicture} />
          <Box m="2rem 0"/>
          <ConnectionListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreen ? "42%" : undefined}
          mt={isNonMobileScreen ? undefined : "2rem"}
        >
          <PostsWidget userId={userId} isProfile={true}/>
        </Box>
        {isNonMobileScreen && (
          <Box flexBasis="26%">

          </Box>
        )}
      </Box>
    </div>
  )
}

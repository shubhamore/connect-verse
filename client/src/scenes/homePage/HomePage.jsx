import { Box, useMediaQuery } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import Navbar from 'scenes/navbar/Navbar'
import ConnectionListWidget from 'scenes/widgets/ConnectionListWidget'
import MyPostWidget from 'scenes/widgets/MyPostWidget'
import PostsWidget from 'scenes/widgets/PostsWidget'
import SideWidget from 'scenes/widgets/SideWidget'
import UserWidget from 'scenes/widgets/UserWidget'
import state from 'state'

export default function HomePage() {
  const isNonMobileScreen=useMediaQuery("(min-width:1000px")
  const {_id,profilePicture,name}=useSelector(state=>state.user)

  return (
    <div>
      <Navbar/>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen?"flex":"block"}
        gap="0.5rem"
        justifyContent="space-between"
        // marginTop="5rem"
      >
        {isNonMobileScreen&&<Box flexBasis={isNonMobileScreen?"26%":undefined}>
          {/* <UserWidget userId={_id} profilePicture={profilePicture}/> */}
          <SideWidget userId={_id} showAbout={false} />
          <Box m="2rem 0"/>
        </Box>}
        <Box
          flexBasis={isNonMobileScreen?"42%":undefined}
          // mt={isNonMobileScreen?undefined:"2rem"}
        >
          <MyPostWidget name={name} profilePicture={profilePicture}/>
          <Box m="2rem 0"/>
          <PostsWidget Id={_id}/>
        </Box>
        {isNonMobileScreen&&(
          <Box flexBasis="26%">
          <ConnectionListWidget userId={_id} showConnect={true}/>
            
          </Box>
        )}
      </Box>
    </div>
  )
}

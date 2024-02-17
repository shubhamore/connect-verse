import { Box, useMediaQuery } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Navbar from 'scenes/navbar/Navbar'
import ConnectionListWidget from 'scenes/widgets/ConnectionListWidget'
import UserWidget from 'scenes/widgets/UserWidget'
import { useParams } from 'react-router-dom'
import PostWidget from 'scenes/widgets/PostWidget'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Loading from 'components/Loading'

export default function PostSharePage() {
    const { postId } = useParams()
    const isNonMobileScreen = useMediaQuery("(min-width:1000px")
    const { _id, profilePicture } = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    const [loading, setLoading] = React.useState(true)
    const [posts, setPosts] = React.useState([])

    const getPost = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post/share/${postId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()
        //console.log("getPost=", data)
        setPosts(data)
        setLoading(false)
    }

    useEffect(() => {
        getPost()
    }, [postId])

    return (
        <div>
            <Navbar />
            {!loading ? <Box
                width="100%"
                padding="2rem 6%"
                display={isNonMobileScreen ? "flex" : "block"}
                gap="0.5rem"
                justifyContent="space-between"
            >
                <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
                    <UserWidget userId={_id} profilePicture={profilePicture} />
                    <Box m="2rem 0" />
                    <ConnectionListWidget userId={_id} />
                </Box>
                <Box
                    flexBasis={isNonMobileScreen ? "42%" : undefined}
                    mt={isNonMobileScreen ? undefined : "2rem"}
                >
                    <PostWidget
                        postId={posts._id}
                        userId={posts.userId}
                        name={posts.name}
                        desc={posts.desc}
                        postImg={posts.postImg}
                        likes={posts.likes}
                        comments={posts.comments}
                        isEdited={posts.isEdited}
                        createdAt={posts.createdAt}
                    />
                </Box>
                {isNonMobileScreen && (
                    <Box flexBasis="26%">

                    </Box>
                )}
            </Box> : (
                <Loading loading={loading}/>
            )}
        </div>
    )
}

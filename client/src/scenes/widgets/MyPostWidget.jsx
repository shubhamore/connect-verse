import React, { useState } from 'react'
import { EditOutlined, DeleteOutlined, AttachFileOutlined, GifBoxOutlined, ImageOutlined, MicOutlined, MoreHorizOutlined } from '@mui/icons-material'
import { Box, Divider, Typography, InputBase, useTheme, Button, IconButton, useMediaQuery } from "@mui/material"
import FlexBetween from 'components/FlexBetween'
import Dropzone from 'react-dropzone'
import UserImage from 'components/UserImage'
import WidgetWrapper from 'components/WidgetWrapper'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from 'state'

export default function MyPostWidget({ profilePicture, name }) {
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const [isImage, setIsImage] = React.useState(false)
    const [image, setImage] = React.useState(null)
    const [post, setPost] = React.useState("")
    const { _id } = useSelector(state => state.user)
    const token = useSelector(state => state.token)
    const isNonMobileScreen = useMediaQuery("(min-width:1000px)")
    const mediumMain = palette.neutral.mediumMain
    const medium = palette.neutral.medium
    const [imageName, setImageName] = useState("")

    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result)
            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    function toggleImage() {
        if (isImage) {
            setImage(null)
            setImageName("")
        }
        setIsImage(!isImage)
    }

    const handlePost = async () => {
        const formData = new FormData()
        formData.append("userId", _id)
        formData.append("desc", post.trim())
        if (image) {
            formData.append("postImg", image)
        }
        const urlEncoded = new URLSearchParams(formData)

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/post`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: urlEncoded
        })

        const data = await response.json()
        dispatch(setPosts({ posts: data }))
        setImage(null)
        if(isImage) toggleImage()
        setPost("")
    }

    return (
        <WidgetWrapper>
            <Box gap="1.5rem">
                <Box gap="1rem" sx={{display:"flex",alignItems:"center",justifyContent:'flex-start'}}>
                    <UserImage image={profilePicture} />
                    <Typography
                        variant="h4"
                        color={palette.neutral.dark}
                        fontWeight="500"
                    >
                        {name}
                    </Typography>
                </Box>
                <InputBase
                    placeholder="What's on your mind?"
                    multiline
                    onChange={e => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "2rem",
                        padding: '1rem 2rem',
                        marginTop: "1rem",
                    }}
                />
            </Box>
            {post.length>4000&&<Typography color="error.main">Post can't be more than 4000 characters</Typography>}
            {isImage && <Box
                border={`1px solid ${medium}`}
                borderRadius="5px"
                mt='1rem'
                p="1rem"
            >
                <FlexBetween>
                    <Dropzone
                        acceptedFiles=".jpg,.jpeg,.png"
                        multiple={false}
                        onDrop={async (acceptedFiles) => {
                            setImageName(acceptedFiles[0].name)
                            setImage(await convertToBase64(acceptedFiles[0]))
                        }}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <Box
                                {...getRootProps()}
                                border={`2px dashed ${palette.primary.main}`}
                                p="1rem"
                                width="100%"
                                sx={{
                                    "&:hover": {
                                        cursor: "pointer"
                                    },
                                }}
                            >
                                <input {...getInputProps()} />
                                {!image ? (
                                    <p>Add Image Here</p>
                                ) : (
                                    <FlexBetween>
                                        <Typography>{imageName}</Typography>
                                        <IconButton>
                                            <EditOutlined />
                                        </IconButton>
                                    </FlexBetween>
                                )}
                            </Box>
                        )}
                    </Dropzone>
                    {image && (<Box sx={{ width: "15%", textAlign: "center" }}>
                        <IconButton onClick={() => setImage(null)} >
                            <DeleteOutlined />
                        </IconButton>
                    </Box>
                    )}
                </FlexBetween>
            </Box>}

            <Divider sx={{ margin: "1.25rem 0" }} />

            <FlexBetween>
                <FlexBetween gap="0.2rem" onClick={toggleImage} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
                    <ImageOutlined sx={{ color: mediumMain }} />
                    <Typography color={mediumMain}>{!isImage ? "Add" : "Remove"} Image</Typography>
                </FlexBetween>
                <Button
                    disabled={!post || post.length>4000||post.trim().length===0}
                    onClick={handlePost}
                    sx={{
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        borderRadius: "3rem",
                    }}
                >
                    POST
                </Button>
            </FlexBetween>
        </WidgetWrapper>
    )
}

import React, { useState } from 'react'
import { Box, Button, TextField, Typography, useTheme } from "@mui/material"
import EditOutlinedIcon from "@mui/icons-material/EditOutlined"
import { Formik } from 'formik'
import * as yup from 'yup'
import { useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { setLogin } from 'state'
import Dropzone from 'react-dropzone'
import FlexBetween from 'components/FlexBetween'
import { toast } from "react-toastify"

const registerSchema = yup.object().shape({
    email: yup.string().email("Invalid email").required("This Field is required"),
    password: yup.string().min(6, "Password must contain minimum of 6 Characters").required("This Field is required"),
    name: yup.string().required("This Field is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("This Field is required"),
    profilePicture: yup.string()
})

const loginSchema = yup.object().shape({
    email: yup.string().email("Invalid Email").required("This Field is required"),
    password: yup.string().min(6, "Password must contain minimum of 6 characters").required("This Field is required")
})

const initialValuesRegister = {
    name: "",
    email: "",
    password: "",
    profilePicture: "",
    confirmPassword: ""
}

const initialValuesLogin = {
    email: "",
    password: ""
}

export default function Form() {
    const [pageType, setPageType] = useState("login")
    const [profilePictureName, setProfilePictureName] = useState("")
    const isLogin = pageType === 'login'
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()

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

    const register = async (formData, onSubmitProps) => {
        const savedUserResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            }
        )
        const savedUser = await savedUserResponse.json()
        if (savedUserResponse.status === 201) {
            toast.success("User Registered Successfully")
            setPageType("login")
            onSubmitProps.resetForm()
        }
        else if (savedUserResponse.status === 409) {
            console.log("user already exists")
            toast.error("User already exists with the entered email")
        }
        else {
            toast.error("Oops! Something went wrong")
            console.log(savedUserResponse)
        }
    }

    const login = async (formData, onSubmitProps) => {
        const loggedInResponse = await fetch(
            `${process.env.REACT_APP_BASE_URL}/auth/login`,
            {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        const loggedIn = await loggedInResponse.json()
        if (loggedInResponse.status === 200) {
            onSubmitProps.resetForm()
            dispatch(setLogin({
                user: loggedIn.user,
                token: loggedIn.accessToken
            }))
            navigate("/home")
        }
        else if (loggedInResponse.status === 400 || loggedInResponse.status === 404) {
            toast.error("Invalid Credentials")
        }
        else {
            console.log("error occurred while loggin in")
            console.log(loggedInResponse)
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps)
        else await register(values, onSubmitProps)
    }

    return (
        <Formik
            onSubmit={handleFormSubmit}
            initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
            validationSchema={isLogin ? loginSchema : registerSchema}
        >
            {({
                values,
                errors,
                touched,
                handleBlur,
                handleSubmit,
                setFieldValue,
                resetForm,
            }) => (
                <form onSubmit={handleSubmit}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "bold",
                                color: palette.primary.main,
                                marginBottom: "1rem",
                            }}
                        >
                            {isLogin ? "Login" : "Register"}
                        </Typography>
                        {!isLogin && (
                            <>
                                <TextField
                                    label="Name"
                                    variant="outlined"
                                    name="name"
                                    value={values.name}
                                    onChange={(e) => setFieldValue("name", e.target.value)}
                                    onBlur={handleBlur}
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                    sx={{ marginBottom: "1rem", width: "100%" }}
                                />
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    value={values.email}
                                    onChange={(e) => setFieldValue("email", e.target.value)}
                                    onBlur={handleBlur}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    sx={{ marginBottom: "1rem", width: "100%" }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    name="password"
                                    value={values.password}
                                    onChange={(e) => setFieldValue("password", e.target.value)}
                                    onBlur={handleBlur}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    sx={{ marginBottom: "1rem", width: "100%" }}
                                />
                                <TextField
                                    label="Confirm Password"
                                    type="password"
                                    variant="outlined"
                                    name="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
                                    onBlur={handleBlur}
                                    error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                    sx={{ marginBottom: "1rem", width: "100%" }}
                                />
                                <Box
                                    border={`1px solid ${palette.neutral.medium}`}
                                    borderRadius="5px"
                                    p="1rem"
                                    sx={{ width: "100%" }}
                                >
                                    <Dropzone
                                        acceptedFiles=".jpg,.jpeg,.png"
                                        multiple={false}
                                        onDrop={async (acceptedFiles) => {
                                            setProfilePictureName(acceptedFiles[0].name)
                                            setFieldValue(
                                                "profilePicture",
                                                await convertToBase64(acceptedFiles[0])
                                            )
                                        }}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <Box
                                                {...getRootProps()}
                                                border={`2px dashed ${palette.primary.main}`}
                                                p="1rem"
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer"
                                                    },
                                                }}
                                            >
                                                <input {...getInputProps()} />
                                                {!values.profilePicture ? (
                                                    <p>Add Picture Here</p>
                                                ) : (
                                                    <FlexBetween>
                                                        <Typography>{profilePictureName}</Typography>
                                                        <EditOutlinedIcon />
                                                    </FlexBetween>
                                                )}
                                            </Box>
                                        )}
                                    </Dropzone>
                                </Box>
                            </>
                        )}
                        {isLogin && (
                            <>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    value={values.email}
                                    onChange={(e) => setFieldValue("email", e.target.value)}
                                    onBlur={handleBlur}
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    sx={{ marginBottom: "1rem", width: "100%" }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    variant="outlined"
                                    name="password"
                                    value={values.password}
                                    onChange={(e) => setFieldValue("password", e.target.value)}
                                    onBlur={handleBlur}
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                    sx={{ marginBottom: "1rem", width: "100%" }}
                                />
                            </>
                        )}
                        <Box
                            sx={{ width: "100%" }}
                        >
                            <Button
                                fullWidth
                                type='submit'
                                sx={{
                                    m: '1rem 0',
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    "&:hover": { color: palette.primary.main },
                                }}
                            >
                                {isLogin ? "Login" : "Register"}
                            </Button>
                            <Typography
                                onClick={() => {
                                    setPageType(isLogin ? "register" : "login")
                                    resetForm()
                                }}
                                sx={{
                                    textDecoration: "underline",
                                    color: palette.primary.main,
                                    marginBottom: "1rem",
                                    cursor: "pointer",
                                    "&:hover": {
                                        color: palette.primary.dark
                                    }
                                }}
                            >
                                {isLogin ? "Don't have an account? Sign Up here." : "Already have an account? Login here."}
                            </Typography>
                        </Box>
                    </Box>
                </form>
            )}
        </Formik>
    )
}

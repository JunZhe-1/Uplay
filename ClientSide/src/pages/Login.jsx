import React, { useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';


function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            emailAddress: "",
            password: ""
        },
        validationSchema: yup.object({  
            emailAddress: yup.string().trim()
                .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/, 'Enter a valid email address')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(50, 'Password must be at most 50 characters')
                .required('Password is required')
                
        }),
        onSubmit: (data) => {
            data.emailAddress = data.emailAddress.trim().toLowerCase();
            data.password = data.password.trim();
            http.post("/UplayUser/login", data)
                .then((res) => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    setUser(res.data.user);
                    console.log(res.data.uplayuser);
                    var id = res.data.uplayuser.userId
                    console.log(id)
                    try {
                        http.get(`/Member/${id}`)  
                            .then((respose) => {
                                // Assuming memberStatusRes.data.status contains the user status
                                const userStatus = respose.data.memberStatus;
                                if (localStorage.getItem("memberStatus")) {
                                    localStorage.removeItem("memberStatus");
                                }
                                localStorage.setItem("memberStatus", userStatus);
                                console.log(localStorage.getItem("memberStatus"))
                                if (userStatus == null) {
                                localStorage.setItem("memberStatus","Guest")}
                            })
                            .catch((error) => {
                                console.error("Error fetching user status:", error);
                                if (localStorage.getItem("memberStatus")) {
                                    localStorage.removeItem("memberStatus");
                                }
                                // If there is an error, set user status to "Guest"
                                localStorage.setItem("memberStatus", "Guest");
                            });
                    } catch {
                        if (localStorage.getItem("memberStatus")) {
                            localStorage.removeItem("memberStatus");
                        }
                        localStorage.setItem("memberStatus", "Guest");
                    }
                    navigate("/")
                    
                })
                .catch(function (err) {
                    toast.error(err.response.data.message);
                });
        }
    });

    return (
        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h5" sx={{ my: 2 }}>
                Login
            </Typography>
            <Box component="form" sx={{ maxWidth: '500px' }}
                onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Email"
                    name="emailAddress"
                    value={formik.values.emailAddress}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
                    helperText={formik.touched.emailAddress && formik.errors.emailAddress}
                />
                <TextField
                    fullWidth margin="dense" autoComplete="off"
                    label="Password"
                    name="password" type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }}
                    type="submit">
                    Login
                </Button>
            </Box>

            <ToastContainer />
        </Box>
    );
}

export default Login;
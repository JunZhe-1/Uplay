import React, { useContext, useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import {
    useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

function Login() {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const { executeRecaptcha } = useGoogleReCaptcha();



    const formik = useFormik({
        initialValues: {
            emailAddress: "",
            password: "",
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
        onSubmit: async (data) => {
            data.emailAddress = data.emailAddress.trim().toLowerCase();
            data.password = data.password.trim();


            try {
                const recaptchaToken = await executeRecaptcha('log_in');
                console.log(recaptchaToken)
                // Add the reCAPTCHA token to the form data
                data.recaptchaToken = recaptchaToken;
                console.log(recaptchaToken)
                const response = await http.post("/UplayUser/login", data);
                localStorage.setItem("accessToken", response.data.accessToken);
                setUser(response.data.user);
                console.log(response.data);
                var id = response.data.user.userId;
                console.log(id);
                try {
                    const memberStatusRes = await http.get(`/Member/${id}`);
                    navigate("/");
                    window.location.reload();
                    const userStatus = memberStatusRes.data.memberStatus;
                    localStorage.setItem("memberStatus", userStatus || "Guest");
                    console.log(localStorage.getItem("memberStatus"));
                } catch (error) {
                    console.error("Error fetching user status:", error);
                    localStorage.setItem("memberStatus", "Guest");
                }
            } catch (err) {
                toast.error(err.response.data.message);
            }
        }
    });

    return (

        <Box sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography variant="h4" sx={{ my: 2, fontWeight: 'bold', color: '#f4511e' }}>
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

                <Button fullWidth variant="contained" sx={{ mt: 2, background: '#f4511e', color: 'white', fontWeight: 'bold' }}
                    type="submit">
                    Login
                </Button>
            </Box>

            <ToastContainer />
        </Box>
      
            );
}

export default Login;

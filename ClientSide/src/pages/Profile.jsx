import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function Profiles() {
    const [profileList, setProfileList] = useState([]);
    const [user, setUser1] = useState(null);

    const [memberstatus, setmemberstatus] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get('/UplayUser/auth');
                setUser1(response.data.user);

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (localStorage.getItem('accessToken')) {
            fetchUser();
        }
    }, []);

    const formik = useFormik({
        initialValues: {
            userName: profileList.userName,
            emailAddress: profileList.emailAddress,
            password: ""

        },
        validationSchema: yup.object({
            userName: yup.string().trim()
                .min(1, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required'),
            emailAddress: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(250, 'Password must be at most 50 characters')
                .required('Password is required')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
                    "At least 1 letter and 1 number")

        }),
        onSubmit: (data) => {

            data.userName = data.userName.trim();
            data.emailAddress = data.emailAddress.trim().toLowerCase();
            data.password = data.password.trim();
            console.log(data)
            http.put(`/UplayUser/${user.userId}`, data)
                .then((res) => {
                    console.log(res.data);

                    navigate("/");
                });
        }
    });

    useEffect(() => {

        if (user) {
            const getProfile = async () => {
                try {
                    const response = await http.get(`/UplayUser/${user.userId}`);
                    setProfileList(response.data);
                    console.log(response.data);
                    formik.setValues({
                        userName: response.data.userName,
                        emailAddress: response.data.emailAddress,
                        password: ""
                    });
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };
            const getMemberStatus = async () => {
                try {
                    const response1 = await http.get(`/Member/${user.userId}`)
                    if (response1.headers['content-length'] == 0) {
                        setmemberstatus("Non-Member")

                    }
                    else {
                        console.log(response1)
                        setmemberstatus(response1.data.memberStatus)

                    }

                } catch (error) {
                    console.error('Error fetching memberstatus:', error);
                }


            };

            getProfile();
            getMemberStatus();

        }
    }, [user]);
    const handleNavigate = () => {
        navigate("/buymember");
    };


    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box component="form" marginBottom={4} marginTop={4} onSubmit={formik.handleSubmit}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" style={{ fontSize: '23px' }}>
                                Member Type:
                            </Typography>
                            <Typography variant="h6" style={{ marginBottom: '20px' }}>
                                {memberstatus}
                            </Typography>
                            <Typography variant="h6" style={{ fontSize: '23px' }}>
                                User Name:
                            </Typography>
                            {user && (
                                <>
                            {user.emailAddress.toLowerCase() === "admin@gmail.com" ? (
                                <TextField
                                    fullWidth
                                    label=""
                                    name="userName"
                                    value={formik.values.userName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.userName && Boolean(formik.errors.userName)}
                                    helperText={formik.touched.userName && formik.errors.userName}
                                    InputLabelProps={{ shrink: Boolean(formik.values.userName) || formik.values.userName === '' }}
                                    style={{ marginBottom: '10px' }}
                                    disabled={true}
                                />) : <TextField
                                fullWidth
                                label=""
                                name="userName"
                                value={formik.values.userName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.userName && Boolean(formik.errors.userName)}
                                helperText={formik.touched.userName && formik.errors.userName}
                                InputLabelProps={{ shrink: Boolean(formik.values.userName) || formik.values.userName === '' }}
                                style={{ marginBottom: '10px' }} // Adjust spacing here
                                    />}
                                </>
                            )}
                           
                            <Typography variant="h6" style={{ fontSize: '23px', marginTop: '20px' }}>
                                Email Address:
                            </Typography>

                            {user && (
                                <>
                            {user.emailAddress.toLowerCase() === "admin@gmail.com" ? (
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label=""
                                name="emailAddress"
                                value={formik.values.emailAddress}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
                                helperText={formik.touched.emailAddress && formik.errors.emailAddress}
                                InputLabelProps={{ shrink: Boolean(formik.values.emailAddress) || formik.values.emailAddress === '' }}
                                style={{ marginBottom: '10px' }} // Adjust spacing here
                                disabled={true}
                            />):<TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label=""
                                name="emailAddress"
                                value={formik.values.emailAddress}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
                                helperText={formik.touched.emailAddress && formik.errors.emailAddress}
                                InputLabelProps={{ shrink: Boolean(formik.values.emailAddress) || formik.values.emailAddress === '' }}
                                style={{ marginBottom: '10px' }} // Adjust spacing here
                            />


                            }
                                </>
                            )}
                            <Typography variant="h6" style={{ fontSize: '23px', marginTop: '20px' }}>
                                Change Password:
                            </Typography>
                            <TextField
                                label="New Password"
                                margin="normal"
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                name="password"
                                type="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                InputLabelProps={{ style: { marginTop: '5px' } }} // Adjust marginTop here
                                style={{ marginBottom: '10px' }} // Adjust spacing here
                            />

                            <Button variant="contained" color="primary" style={{ marginTop: '20px' }} type="submit">
                                Update details
                            </Button>

                            <Button variant="contained" color="primary" style={{ marginTop: '20px', marginLeft: '20px' }} onClick={handleNavigate}>
                                Become a Member
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );

}

export default Profiles;
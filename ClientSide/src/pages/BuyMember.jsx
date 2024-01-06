import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function BuyMember() { 
    const [user, setUser] = useState(null);
    const [defaultName, setDefaultName] = useState("");
    const [defaultNRIC, setDefaultNRIC] =useState("");
    const [defaultMemberStatus, setDefaultMemberStatus] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get('/UplayUser/auth');
                setUser(response.data.user);
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
            name: defaultName,
            nric: defaultNRIC,
            memberStatus: defaultMemberStatus

        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(1, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required'),
            nric: yup.string().trim()
                .matches(/^[stST]\d{7}[a-zA-Z]$/, 'Invalid NRIC format')
                .required('NRIC is required')

        }),
        onSubmit: (data) => {

            data.name = data.name.trim();
            data.nric = data.nric.trim().toLowerCase();
            data.memberStatus = "NTUC Member";
            console.log(data)
            http.post("/Member", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/profile");
                });
        }


    });
    useEffect(() => {

        if (user) {
            const getMemberdata = async () => {
                try {
                    const response1 = await http.get(`/Member/${user.userId}`)
                    if (response1.headers['content-length'] == 0) {
                        setDefaultName("")
                        setDefaultNRIC("")
                        setDefaultMemberStatus("User")

                    }
                    else {
                        console.log(response1)
                        setDefaultName(response1.data.name)
                        setDefaultNRIC(response1.data.nric)
                        setDefaultMemberStatus(response1.data.memberStatus)

                    }

                } catch (error) {
                    console.error('Error fetching memberstatus:', error);
                }


            };

            getMemberdata();

        }
    }, [user]);



    return (
                <Box component="form" marginBottom={4} marginTop={4} onSubmit={formik.handleSubmit}>

                            <Typography variant="h6" style={{ fontSize: '23px' }}>
                                Current Member Type:
                            </Typography>
                            <Typography variant="h6" style={{ marginBottom: '20px' }}>
                                {defaultMemberStatus}
                            </Typography>
                            <Typography variant="h6" style={{ fontSize: '23px' }}>
                                Name:
                            </Typography>
                            <TextField
                                fullWidth
                                label="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                InputLabelProps={{ shrink: Boolean(formik.values.name) || formik.values.name === '' }}
                                style={{ marginBottom: '10px' }} // Adjust spacing here
                            />
                            <Typography variant="h6" style={{ fontSize: '23px', marginTop: '20px' }}>
                                NRIC:
                            </Typography>
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="nric"
                                name="nric"
                                value={formik.values.nric}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.nric && Boolean(formik.errors.nric)}
                                helperText={formik.touched.nric && formik.errors.nric}
                                InputLabelProps={{ shrink: Boolean(formik.values.nric) || formik.values.nric === '' }}
                                style={{ marginBottom: '10px' }} // Adjust spacing here
                            />

                            <Button variant="contained" color="primary" style={{ marginTop: '20px' }} type="submit">
                                Buy Member
            </Button>




                </Box>

    );




}

export default BuyMember;
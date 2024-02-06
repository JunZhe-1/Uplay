import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid,Select } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem } from '@mui/material';
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
    const [defaultDateOfBirth, setDefaultDateOfBirth] = useState("");
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
    const today = new Date().toISOString().split('T')[0];
    const formik = useFormik({
        initialValues: {
            name: defaultName,
            nric: defaultNRIC,
            dob: defaultDateOfBirth||today,
            memberStatus: defaultMemberStatus,
            years:1

        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(1, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required'),
            nric: yup.string().trim()
                .matches(/^\d{3}[a-zA-Z]$/, 'Invalid NRIC format')
                .required('NRIC is required'),
            dob: yup.date().required('Date of Birth is required'),
            years: yup.number().oneOf([1, 2, 3], 'Please select a valid number of years').required('Years is required'),
            

        }),
        onSubmit: (data) => {

            data.name = data.name.trim();
            data.nric = data.nric.trim().toLowerCase();
            data.memberStatus = "NTUC";
            const dobDate = new Date(data.dob);
            const formattedDateOfBirth = dobDate.toISOString().split('T')[0];

            // Assign the formatted date to the data.dateOfBirth property
            data.dateOfBirth = formattedDateOfBirth;
            console.log(data)
            http.post("/Member", data,2)
                .then((res) => {
                    console.log(res.data);
                    navigate("/profile");
                    localStorage.removeItem("memberStatus")
                    localStorage.setItem("memberStatus","NTUC")

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
                        setDefaultDateOfBirth(today)

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
                                NRIC last 4 digit (e.g. 123A):
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
            <Typography variant="h6" style={{ fontSize: '23px', marginTop: '20px' }}>
                Date of Birth:
            </Typography>
            <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Date of Birth"
                type="date"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
                helperText={formik.touched.dob && formik.errors.dob}
                InputLabelProps={{ shrink: true }}
                style={{ marginBottom: '10px' }}
            />
            <Typography variant="h6" style={{ fontSize: '23px', marginTop: '20px' }}>
                No. of years to subscribe:
            </Typography>
            <Select
                label="Years"
                name="years"
                value={formik.values.years}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.years && Boolean(formik.errors.years)}
                style={{ marginBottom: '10px' }}
            >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
            </Select>
             
            
             <Button variant="contained" color="primary" style={{ marginTop: '20px' }} type="submit">
                                Buy Membership
            </Button>




                </Box>

    );




}

export default BuyMember;
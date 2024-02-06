import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    TextField, Button, Box, Typography, Grid, Card, CardContent, Input, IconButton,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , Dialog, InputLabel, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem 
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { ToastContainer, toast } from 'react-toastify';

import ContactMailIcon from '@mui/icons-material/ContactMail';
import http from '../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function Userprofile() {
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
            password: "",
            oldpassword:""


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
            oldpassword: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(250, 'Password must be at most 50 characters')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,"At least 1 letter and 1 number"),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(250, 'Password must be at most 50 characters')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,"At least 1 letter and 1 number")

        }),
        onSubmit: async (data) => {

            data.userName = data.userName.trim();
            data.emailAddress = data.emailAddress.trim().toLowerCase();

            if (data.password != "" && data.oldpassword != "") {
                try {
                    const response = await http.post('/UplayUser/validatePassword', {
                        userId: user.userId,
                        oldPassword: data.oldpassword
                    });

                    // Validation successful, proceed to update the password
                    const newPassword = data.password.trim();
                    data.password = newPassword;

                } catch (error) {
                    // Old password validation failed
                    console.error('Error validating old password:', error);
                    formik.setErrors({ oldpassword: "Invalid old password." });
                    return;
                }

            }
            
            console.log(data)
            http.put(`/UplayUser/${user.userId}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/");
                    
                })
                .catch((error) => {
                    console.error('Error updating user details:', error);
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
        <Box sx={{marginLeft:'-100vh'}}>
         <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
    <Link to="/" style={{ textDecoration: 'none', marginBottom: '10px' }}>
      <Button variant="outlined" startIcon={<HomeIcon />}>
        Home
      </Button>
    </Link>
    <Link to="/about" style={{ textDecoration: 'none', marginBottom: '10px' }}>
      <Button variant="outlined" startIcon={<InfoIcon />}>
        About
      </Button>
    </Link>
    <Link to="/contact" style={{ textDecoration: 'none', marginBottom: '10px' }}>
      <Button variant="outlined" startIcon={<ContactMailIcon />}>
        Contact
      </Button>
    </Link>
    {/* Add more links as needed */}
  </nav></Box>

    );

}

export default Userprofile;
import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , TextField, Dialog, InputLabel, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem 
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import Rating from 'react-rating-stars-component';
import { tr } from 'date-fns/locale';

function Password_Current() {

    const [ErrorMsg, SetErrorMSg] = useState("");
    const [GetError, SetError] = useState(true);
    const { user } = useContext(UserContext);


    const [user1, setUser1] = useState(null);

    const navigate = useNavigate();


    // you can either use between these two methods
    const { id } = useParams();
    // const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get('/UplayUser/auth');
                setUser1(response.data.user);
                console.log(user.userId)
                console.log(user1.userId)

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (localStorage.getItem('accessToken')) {
            fetchUser();
        }
    }, []);
    const handleSubmit = async (data) => {
        const newRefex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/;


        if (data.oldpassword.trim() === "" ) {
            console.log("enter");

            SetError(false);
            SetErrorMSg("password is required");
            return;
        } else if (!newRefex.test(data.oldpassword)) {
            SetError(false);
            SetErrorMSg("password must have at least 1 letter and 1 number ");
            return;
        } else {
            try {
                const response = await http.post('/UplayUser/validatePassword', {
                    userId: user.userId,
                    oldPassword: data.oldpassword
                });
                if (response.message === "Old password is incorrect") {
                    SetError(false);
                    return;
                }
                SetError(true);
                navigate("/password_change")

            } catch (error) {
                console.error('Error validating old password:', error);
                formik.setErrors({ oldpassword: "Invalid old password." });
                return;
            }
        }
    };
    const formik = useFormik({
        initialValues: {
            oldpassword: ""
           
        },
        validationSchema: yup.object({
            oldpassword: yup.string().trim()
                // .min(8, 'Password must be at least 8 characters')
                // .max(250, 'Password must be at most 50 characters')
                // .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "At least 1 letter and 1 number"),
                // .min(8, 'Password must be at least 8 characters')
                // .max(50, 'Password must be at most 50 characters')
                // .required('Password is required'),
          
        }),
        onSubmit: handleSubmit,
    
    });



    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '75vh',
            position: 'relative',
        }}>
            <Box sx={{ width: '62vh', height: '15vh', padding: '17vh', border: '1px solid black', background: '#FCFCFC', borderRadius: '10px' }}>
                <form onSubmit={formik.handleSubmit}>
                    <Typography sx={{ marginLeft: '-15vh', marginTop: '-15vh' , cursor:'pointer'}} onClick={() => navigate('/profile')} ><ArrowBackIcon /></Typography>

                    <Typography sx={{ my: 2, color: 'black', fontWeight: '600', textAlign: 'center', fontSize: '28px', padding: '0 0 2vh 0' }}>Enter Your Current Password</Typography>
                    <TextField
                        fullWidth
                        label="Old password"
                        margin="normal"
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        name="oldpassword"
                        type="password"
                        value={formik.values.oldpassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.oldpassword && Boolean(formik.errors.oldpassword)}
                        helperText={formik.touched.oldpassword && formik.errors.oldpassword}
                        InputLabelProps={{ style: { marginTop: '5px' } }} 
                        style={{ marginBottom: '10px' }} 
                    />
   {GetError === false ? (
                        <Typography sx={{ color: 'red' }}>{ErrorMsg}</Typography>
                    ) : (
                        <Typography sx={{ visibility: 'hidden' }}>Correct Password</Typography>
                    )}
                    <Box sx={{ mt: 2, padding: '2vh 0 0vh 0', minHeight: '2rem' }}>
                        <Button variant="contained" type="submit" style={{ width: '100%', padding: '8px', fontSize: '15px', background: '#f4511e' }}>
                            CONFIRM
                        </Button>
                    </Box>

              
                </form>
            </Box>
        </Box>
    );
}

export default Password_Current;
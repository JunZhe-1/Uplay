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
import password from './Password_Current';

function Password_Change() {
    const [profileList, setProfileList] = useState([]);
    const [ErrorMsg, SetErrorMSg] = useState("");
    const [GetError, SetError] = useState(true);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
 

    const [compare, setCompare] = useState();
    const [Getpassword, setpassword] = useState({
        password: "",
        confirmPassword: ""})

    // you can either use between these two methods
    const { id } = useParams();
    // const { user } = useContext(UserContext);


    useEffect(() => {
        if (user) {
            const getProfile = async () => {
                try {
                    console.log(user.userId);
                    const response = await http.get(`/UplayUser/${user.userId}`);
                    setProfileList(response.data);
                    console.log(response.data);
                    formik.setValues({
                        userName: response.data.userName,
                        emailAddress: response.data.emailAddress,
                        password: "",
                        confirmPassword:""
                    });
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };
            getProfile();
        }
    }, [user]);
    const formik = useFormik({
        initialValues: Getpassword,
        enableReinitialize: true,
        validationSchema: yup.object({
            password: yup.string().trim(),
                // .min(8, 'Password must be at least 8 characters')
                // .max(250, 'Password must be at most 50 characters')
                // .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "At least 1 letter and 1 number"),
            confirmPassword: yup.string().trim()
                // .min(8, 'Password must be at least 8 characters')
                // .max(250, 'Password must be at most 50 characters')
                // .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "At least 1 letter and 1 number")
        }),
        onSubmit: (data) => {

            const newRefex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/;
            if(data.confirmPassword.trim() == "" || data.password.trim() == ""){
                SetError(false);
                SetErrorMSg("password and confirm password are required");
                return;
            }

         
            else if (!newRefex.test(data.password)) 
            {
                SetError(false);

                SetErrorMSg("password must have at least 1 letter and 1 number ");
                return;


            }
            else if(data.password != data.confirmPassword)
            {
                SetError(false);

                SetErrorMSg("password and confirm password must be match");
                return;


            }
            else {
                console.log(user.userId)
                SetError(true);
                data.password = data.password.trim();
                console.log(data)
                http.put(`/UplayUser/${user.userId}`, data)
                    .then((res) => {
                        console.log(res.data);
                        alert("Profile updated successfully")
                        navigate("/");
                    })
                    .catch((error) => {
                        console.error('Error updating user details:', error);
                    });
            }

            
                

            // http.post("/Voucher/add", Getpassword)
        //     .then((res) => {
        //         // navigate to change new password
        //         navigate("/");
        //     })
        //     .catch(function (err) {
        //         SetError(true);
        //         toast.error(`${err.response.data.message}`);
        //         console.log(err.response.data.message);
        //     });
        }
    });
    
    const process_passwordChange = () => {
      
    console.log(Getpassword);
        // http.post("/Voucher/add", Getpassword)
        //     .then((res) => {
        //         // navigate to change new password
        //         navigate("/");
        //     })
        //     .catch(function (err) {
        //         SetError(true);
        //         toast.error(`${err.response.data.message}`);
        //         console.log(err.response.data.message);
        //     });
    };
    

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            position: 'relative',
        }}>
            <Box sx={{ width: '63vh', height: '27.5vh', padding: '17vh', border: '1px solid black', background: '#FCFCFC', borderRadius: '10px' }}>
                <form onSubmit={formik.handleSubmit}>
                <Typography sx={{ marginLeft: '-15vh', marginTop: '-15vh' , cursor:'pointer'}} onClick={() => navigate('/profile')} ><ArrowBackIcon /></Typography>

                    <Typography sx={{ my: 2, color: 'black', fontWeight: '600', textAlign: 'center', fontSize: '32px', padding: '0 0 2vh 0' }}>Enter Your New Password</Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="New Password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.password && formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    <Box sx={{ padding: '10px' }}></Box>

                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />

                    {GetError === false ? (
                        <Typography sx={{ color: 'red' }}>{ErrorMsg}</Typography>
                    ) : (
                        <Typography sx={{ visibility: 'hidden' }}>Correct Password</Typography>
                    )}

                    <Box sx={{ mt: 2, padding: '3vh 0 0vh 0' }}>
                        <Button variant="contained" type="submit" style={{ width: '100%', padding: '8px', fontSize: '15px', background: '#f4511e' }}>
                            CONFIRM
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
export default Password_Change;

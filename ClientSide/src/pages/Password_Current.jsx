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


    // you can either use between these two methods
    const { id } = useParams();
    // const { user } = useContext(UserContext);

    
    const formik = useFormik({
        initialValues: {
            password: ""
           
        },
        validationSchema: yup.object({
            password: yup.string().trim()
                // .min(8, 'Password must be at least 8 characters')
                // .max(50, 'Password must be at most 50 characters')
                // .required('Password is required'),
          
        }),
        onSubmit: (values) => {
            
            const newRefex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/;
            if( values.password.trim() == ""){
                SetError(false);
                SetErrorMSg("password is required");
                return;
            }
            else if (!newRefex.test(values.password)) 
            {
                SetError(false);

                SetErrorMSg("password must have at least 1 letter and 1 number ");
                return;


            }
            else{
SetError(true);
                values.password = values.toString().trim();

            // http.post("/Voucher/add", values)
            //     .then((res) => {
            //         // navigate to change new password
            //         navigate("/");
            //     })
            //     .catch(function (err) {
            //         SetError(true);
            //         toast.error(`${err.response.data.message}`);
            //         console.log(err.response.data.message);
            //     })
        }
    }
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
                    <Typography sx={{ marginLeft: '-15vh', marginTop: '-15vh' }}><ArrowBackIcon /></Typography>

                    <Typography sx={{ my: 2, color: 'black', fontWeight: '600', textAlign: 'center', fontSize: '32px', padding: '0 0 2vh 0' }}>Enter Your Current Password</Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Current Password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(formik.touched.password && formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
   {GetError === false ? (
                        <Typography sx={{ color: 'red' }}>{ErrorMsg}</Typography>
                    ) : (
                        <Typography sx={{ visibility: 'hidden' }}>Correct Password</Typography>
                    )}
                    <Box sx={{ mt: 2, padding: '3vh 0 0vh 0', minHeight: '2rem' }}>
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
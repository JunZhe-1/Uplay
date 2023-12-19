import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VoucherAdd() {
    const navigate = useNavigate();
    const formit = useFormik({
        initiaValues: {
            Voucher_Name: "",
            Start_Date: "",
            End_Date: "",
            Discount_In_percentage: "",
            Discount_In_value: "",
            member_type:""
        }, validationSchema: yup.object({
            Voucher_Name:
        })
    })


}
export default VoucherAdd;
import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import da from 'date-fns/locale/da';
function VoucherAdd() {

    const navigate = useNavigate();

 

    const formik = useFormik({
        initialValues: {
            Voucher_Name: "",
            Start_Date: "",
            End_Date: "",
            Discount_In_percentage: "",
            Discount_In_value: "",
            member_type: "Uplay",
            Discount_type:""

        },
        validationSchema: yup.object({
            Voucher_Name: yup.string().trim()
                .min(3, 'Voucher_Name must be at least 3 characters')
                .max(100, 'Voucher_Name must be at most 100 characters')
                .required('Voucher_Name is required'),

        }),
        onSubmit: (data) => { 
            data.Voucher_Name = data.Voucher_Name.trim();
            data.Start_Date = new Date(data.Start_Date).toISOString();
            data.End_Date = new Date(data.End_Date).toISOString();
            data.Discount_In_percentage = data.Discount_In_percentage;
            data.Discount_In_value = data.Discount_In_value;
            data.member_type = data.member_type;
            data.Discount_type = data.Discount_type;



            http.post("/Voucher/add", data)
                .then((res) => {
                    console.log(res.data);
                    console.log("done");
                    // navigate("/Voucher/add");
                })
                .catch(function (err) {
                    console.log(err.response);  // Log the response object
                    if (err.response && err.response.data && err.response.data.message) {
                        toast.error(err.response.data.message);
                    } else if (err.message) {
                        toast.error(err.message);
                    } else {
                        toast.error("An error occurred. Please try again later.");
                    }
                });


        }
    });


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>

        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Tutorial
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth margin="dense" autoComplete="off"
                            label="Voucher_Name"
                            name="Voucher_Name"
                            value={formik.values.Voucher_Name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Voucher_Name && Boolean(formik.errors.Voucher_Name)}
                            helperText={formik.touched.Voucher_Name && formik.errors.Voucher_Name}
                        />
                        <DatePicker
                            fullWidth
                            margin="dense"
                            label="Start_Date"
                            inputVariant="outlined"
                                format="dd/MM/yyyy"
                            value={formik.values.Start_Date}
                            onChange={(date) => formik.setFieldValue('Start_Date', date)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Start_Date && Boolean(formik.errors.Start_Date)}
                            helperText={formik.touched.Start_Date && formik.errors.Start_Date}
                        />
                        <DatePicker
                            fullWidth
                            margin="dense"
                            label="End_Date"
                            inputVariant="outlined"
                            format="dd/MM/yyyy"
                            value={formik.values.End_Date}
                            onChange={(date) => formik.setFieldValue('End_Date', date)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.End_Date && Boolean(formik.errors.End_Date)}
                            helperText={formik.touched.End_Date && formik.errors.End_Date}
                            />
                            <FormControl fullWidth margin="dense" error={formik.touched.Discount_In_value && Boolean(formik.errors.Discount_In_value)}>
                                <InputLabel htmlFor="member_type">Type of Customer</InputLabel>
                                <Select
                                    name="member_type"
                                    value={formik.values.member_type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="off"
                                >
                                    <MenuItem value="Uplay">Uplay</MenuItem>
                                    <MenuItem value="NTUC">NTUC</MenuItem>
                                    <MenuItem value="Guess">Guess</MenuItem>
                                    {/* Add more MenuItem components as needed */}
                                </Select>
                                <FormHelperText>{formik.touched.Discount_In_value && formik.errors.Discount_In_value}</FormHelperText>
                            </FormControl>
                            <RadioGroup
                                row
                                aria-label="Discount_type"
                                name="Discount_type"
                                value={formik.values.Discount_type}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    if (e.target.value === "Percentage") {
                                        formik.setFieldValue("Discount_In_value", "");
                                    }
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.Discount_type && formik.errors.Discount_type ? 'true' : undefined}
                            >
                                <FormControlLabel
                                    value="Percentage"
                                    control={<Radio color="primary" />}
                                    label="Percentage"
                                />
                                <FormControlLabel
                                    value="Value"
                                    control={<Radio color="primary" />}
                                    label="Value"
                                />
                            </RadioGroup>


                            {formik.values.Discount_type === "Percentage" ? (
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Discount_In_percentage"
                                    name="Discount_In_percentage"
                                    value={formik.values.Discount_In_percentage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    error={formik.touched.Discount_In_percentage && Boolean(formik.errors.Discount_In_percentage)}
                                    helperText={formik.touched.Discount_In_percentage && formik.errors.Discount_In_percentage}
                                    error={formik.touched.Discount_In_percentage && formik.errors.Discount_In_percentage ? 'true' : undefined}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Discount_In_value"
                                    name="Discount_In_value"
                                    value={formik.values.Discount_In_value}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    error={formik.touched.Discount_In_value && Boolean(formik.errors.Discount_In_value)}
                                    helperText={formik.touched.Discount_In_value && formik.errors.Discount_In_value}
                                    error={formik.touched.Discount_In_value && formik.errors.Discount_In_value ? 'true' : undefined}
                                />
                            )}

                       
                    </Grid>
                    
                   
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
            </Box>
        </LocalizationProvider>

    );





}
export default VoucherAdd;
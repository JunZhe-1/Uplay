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
    FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';

function VoucherAdd() {

    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);


    const formik = useFormik({
        initialValues: {
            Voucher_Name: "",
            Start_Date: "", // Initialize as null or a default date
            End_Date: "",   // Initialize as null or a default date
            Voucher_Description:"",
            Discount_In_Value: 0,
            Limit_Value: 0,
            Member_Type: "Uplay",
        },
        validationSchema: yup.object({
            Voucher_Name: yup.string().trim()
                .min(3, 'Voucher Name must be at least 3 characters')
                .max(50, 'Voucher name must be at most 50 characters')
                .required('Voucher Name is required'),
            Voucher_Description: yup.string().trim()
                .min(1, 'Voucher description must be at least 3 characters')
                .max(50, 'Voucher description must be at most 50 characters')
                .required('voucher Description is required'),
            Discount_In_Value: yup.number()
                .min(1, ' Value must be at least 1')
                .max(1000, 'value must be at most 1000')
                .required('value is required'),
            Limit_Value: yup.number()
                .min(0, 'Limit value must start from 0')
                .max(10000, 'invalid Value')
                .required('limit value is required'),
            Start_Date: yup.date().required('Start date is required'),
            End_Date: yup.date().required('End date is required'),
            Member_Type: yup.string()
                .required('Member type is required'),
        }),
        onSubmit: (voucher) => {
            
            if (imageFile) {
                voucher.ImageFile = imageFile;
            }
           
            voucher.Voucher_Name = voucher.Voucher_Name.trim();
            voucher.Voucher_Description = voucher.Voucher_Description.trim();
            voucher.Limit_Value = parseInt(voucher.Limit_Value)
            voucher.Discount_In_Value = parseInt(voucher.Discount_In_Value);

            http.post("/Voucher/add", voucher)
                .then((res) => {
                    navigate("/Voucher");
                })
                .catch(function (err) {
                   
                    toast.error(`${err.response.data.message}`);
                    console.log(err.response.data.message);
                })
        }
    });


    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                    
                })
                .catch(function (error) {
                    console.log(error.response);
                    toast.error(`${error.response.data.message}`);

                });
        }
    };



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',

            }}>
                <Typography variant="h5" sx={{ my: 2 }} >
                    Add Voucher

                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={8}>
                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Voucher_Name"
                                name="Voucher_Name"
                                value={formik.values.Voucher_Name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(formik.touched.Voucher_Name && formik.errors.Voucher_Name)}
                                helperText={formik.touched.Voucher_Name && formik.errors.Voucher_Name}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Voucher_Description"
                                name="Voucher_Description"
                                value={formik.values.Voucher_Description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(formik.touched.Voucher_Description && formik.errors.Voucher_Description)}
                                helperText={formik.touched.Voucher_Description && formik.errors.Voucher_Description}
                            />



                            <DatePicker
                                fullWidth
                                margin="dense"
                                label="Start_Date"
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                value={formik.values.Start_Date}
                                onChange={(date) => {
                                    formik.setFieldValue('Start_Date', date);
                                    formik.setFieldError('Start_Date', ''); // Clear validation error
                                }}
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
                                onChange={(date) => {
                                    formik.setFieldValue('End_Date', date);
                                    formik.setFieldError('End_Date', ''); // Clear validation error
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.End_Date && Boolean(formik.errors.End_Date)}
                                helperText={formik.touched.End_Date && formik.errors.End_Date}
                            />


                            <FormControl fullWidth margin="dense"
                                error={Boolean(formik.touched.Member_Type && formik.errors.Member_Type)}
                            >
                                <InputLabel htmlFor="Member_Type">Type of Customer</InputLabel>
                                <Select
                                    name="Member_Type"
                                    value={formik.values.Member_Type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    autoComplete="off"
                                >
                                    <MenuItem value="Uplay">Uplay</MenuItem>
                                    <MenuItem value="NTUC">NTUC</MenuItem>
                                    <MenuItem value="Guest">Guest</MenuItem>
                                </Select>
                                {formik.touched.Member_Type && formik.errors.Member_Type && (
                                    <FormHelperText>{formik.errors.Member_Type}</FormHelperText>
                                )}
                            </FormControl>
                           
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Discount_In_Value"
                                    name="Discount_In_Value"
                                    value={formik.values.Discount_In_Value}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    error={Boolean(formik.touched.Discount_In_Value && formik.errors.Discount_In_Value)}
                                    helperText={formik.touched.Discount_In_Value && formik.errors.Discount_In_Value}
                            />

                            <TextField
                                fullWidth
                                margin="dense"
                                autoComplete="off"
                                label="Limit_Value"
                                name="Limit_Value"
                                value={formik.values.Limit_Value}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                type="number"
                                error={Boolean(formik.touched.Limit_Value && formik.errors.Limit_Value)}
                                helperText={formik.touched.Limit_Value && formik.errors.Limit_Value}
                            />
                            
                            <Grid item xs={12} md={6} lg={4}>
                                <Box sx={{ textAlign: 'left', mt: 2 }} >
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" multiple type="file"
                                            onChange={onFileChange} />
                                    </Button>
                                    {
                                        imageFile && (
                                            <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                                <img alt="event"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                </Box>
                            </Grid>

                        </Grid>
                   

                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" type="submit" style={{ width: '100%' }}>

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
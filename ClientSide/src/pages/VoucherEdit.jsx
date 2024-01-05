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
import da from 'date-fns/locale/da';

function VoucherEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [voucherinfo, setVoucher] = useState({
        Voucher_Name: "",
        Start_Date: new Date(), 
        End_Date: new Date(),  
        Discount_In_Percentage: "",
        Discount_In_Value: "",
        Member_Type: "Uplay",
        Discount_type: "Percentage"
    });
    useEffect(() => {
        http.get(`/Voucher/getOne/${id}`).then((res) => {
            console.log(res.data.Start_Date);

            setVoucher({
                ...res.data,
                Start_Date: new Date(res.data.Start_Date),
                End_Date: new Date(res.data.End_Date),
            });        
            
        });
    }, []);

    console.log(voucherinfo);

    const formik = useFormik({
        initialValues: voucherinfo,
        enableReinitialize: true,

        validationSchema: yup.object({
            Voucher_Name: yup.string().trim()
                .min(3, 'Voucher_Name must be at least 3 characters')
                .max(100, 'Voucher_Name must be at most 100 characters')
                .required('Voucher_Name is required'),
            Discount_In_Percentage: yup.number()
                .min(0, 'Discount Percent cannot below than 0%')
                .max(100, 'Discount Percent cannot above 100%'),
            Discount_In_Value: yup.number()
                .min(0, 'Discount Value cannot below than $0')
                .max(1000, 'Too Much'),

            Start_Date: yup.date().required('Start date is required'),
            End_Date: yup.date().required('End date is required'),
            Member_Type: yup.string()
                .required('Member type is required')
        }),
        onSubmit: (voucher) => {
            console.log(voucher);

            voucher.Voucher_Name = voucher.Voucher_Name.trim();
            //  voucher.Start_Date = new Date(voucher.Start_Date).toISOString();
            // voucher.End_Date = new Date(voucher.End_Date).toISOString();
            if (voucher.Discount_type === "Value") {
                voucher.Discount_In_Value = parseInt(voucher.Discount_In_Value);
                voucher.Discount_In_Percentage = 0;
            } else if (voucher.Discount_type === "Percentage") {
                voucher.Discount_In_Percentage = parseInt(voucher.Discount_In_Percentage);
                voucher.Discount_In_Value = 0;
            }
            http.put(`/Voucher/update/${id}`, voucher)
                .then((res) => {
                    console.log(res.voucher);
                    navigate("/Voucher");
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                })

        }
    });


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>

            <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Edit Voucher
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
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



                            <DatePicker
                                fullWidth
                                margin="dense"
                                label="Start_Date"
                                inputVariant="outlined"
                                format="dd/MM/yyyy"
                                value={formik.values.Start_Date || null}
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
                                value={formik.values.End_Date || null}
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
                                    <MenuItem value="Guess">Guess</MenuItem>
                                </Select>
                                {formik.touched.Member_Type && formik.errors.Member_Type && (
                                    <FormHelperText>{formik.errors.Member_Type}</FormHelperText>
                                )}
                            </FormControl>

                            <RadioGroup
                                row
                                aria-label="Discount_type"
                                name="Discount_type"
                                value={formik.values.Discount_type || ''}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    if (e.target.value === "Percentage") {
                                        formik.setFieldValue("Discount_In_Value", "");
                                        formik.setFieldValue("Discount_In_Percentage", 0);
                                    } else if (e.target.value === "Value") {
                                        formik.setFieldValue("Discount_In_Percentage", "");
                                        formik.setFieldValue("Discount_In_Value", 0);
                                    }
                                }}

                                onBlur={formik.handleBlur}
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
                                    label="Discount_In_Percentage"
                                    name="Discount_In_Percentage"
                                    value={formik.values.Discount_In_Percentage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    error={Boolean(formik.touched.Discount_In_Percentage && formik.errors.Discount_In_Percentage)}
                                    helperText={formik.touched.Discount_In_Percentage && formik.errors.Discount_In_Percentage}
                                />
                            ) : (
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
                            )}




                        </Grid>


                    </Grid>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>

                </Box>


                <ToastContainer />
            </Box>
        </LocalizationProvider>

    );





}
export default VoucherEdit;
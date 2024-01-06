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
import da from 'date-fns/locale/da';


function EventAdd() {

    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);


    const formik = useFormik({
        initialValues: {
            Event_Name: "",
            Event_Description: "", // Initialize as null or a default date
            Event_Fee_Guest: 0,   // Initialize as null or a default date
            Event_Fee_Uplay: 0, 
            Event_Fee_NTUC: 0,
            Vacancies: 0,
            ImageFile: "",

        },
        validationSchema: yup.object({
            Event_Name: yup.string().trim()
                .min(3, 'Event_Name must be at least 3 characters')
                .max(100, 'Event_Name must be at most 100 characters')
                .required('Event_Name is required'),
            Event_Description: yup.string().trim()
                .min(3, 'Event_Description must be at least 3 characters')
                .max(200, 'Event_Description must be at most 100 characters')
                .required('Event_Description is required'),
            Event_Fee_Guest: yup.number()
                .min(1, 'Event_Fee_Guest Percent cannot below than 0%')
                .max(10000, 'Event_Fee_Guest Percent cannot above 100%')
                .required('Event_Name is required'),            
            Event_Fee_Uplay: yup.number()
                .min(1, 'Event_Fee_Guest Percent cannot below than 0%')
                .max(10000, 'Event_Fee_Guest Percent cannot above 100%')
                .required('Event_Name is required'),            
            Event_Fee_NTUC: yup.number()
                .min(1, 'Event_Fee_Guest Percent cannot below than 0%')
                .max(10000, 'Event_Fee_Guest Percent cannot above 100%')
                .required('Event_Name is required'),
            
            Vacancies: yup.number()
                .min(1, 'Vacancies Value cannot below than $0')
                .required('Event_Name is required'),
            


        }),
        onSubmit: (data) => {

            data.Event_Name = data.Event_Name.trim();
            if (imageFile) {
                data.imageFile = imageFile;
            }
            console.log(data);
            
         


            http.post("/Event/add_event", data)
                .then((res) => {

                   // navigate("/Voucher");
                })
                .catch(function (err) {

                    toast.error(`${err.response.data.message}`);
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
                });
        }
    };



    return (


        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Event

            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event_Name"
                            name="Event_Name"
                            value={formik.values.Event_Name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.touched.Event_Name && formik.errors.Event_Name)}
                            helperText={formik.touched.Event_Name && formik.errors.Event_Name}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event_Description"
                            name="Event_Description"
                            value={formik.values.Event_Description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.touched.Event_Description && formik.errors.Event_Description)}
                            helperText={formik.touched.Event_Description && formik.errors.Event_Description}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event_Fee_Guest"
                            name="Event_Fee_Guest"
                            value={formik.values.Event_Fee_Guest}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="number"
                            error={Boolean(formik.touched.Event_Fee_Guest && formik.errors.Event_Fee_Guest)}
                            helperText={formik.touched.Event_Fee_Guest && formik.errors.Event_Fee_Guest}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event_Fee_Uplay"
                            name="Event_Fee_Uplay"
                            value={formik.values.Event_Fee_Uplay}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="number"
                            error={Boolean(formik.touched.Event_Fee_Uplay && formik.errors.Event_Fee_Uplay)}
                            helperText={formik.touched.Event_Fee_Uplay && formik.errors.Event_Fee_Uplay}
                        />

                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event_Fee_NTUC"
                            name="Event_Fee_NTUC"
                            value={formik.values.Event_Fee_NTUC}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="number"
                            error={Boolean(formik.touched.Event_Fee_NTUC && formik.errors.Event_Fee_NTUC)}
                            helperText={formik.touched.Event_Fee_NTUC && formik.errors.Event_Fee_NTUC}
                        />



                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Vacancies"
                            name="Vacancies"
                            value={formik.values.Vacancies}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            type="number"
                            error={Boolean(formik.touched.Vacancies && formik.errors.Vacancies)}
                            helperText={formik.touched.Vacancies && formik.errors.Vacancies}
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
                <Box sx={{ mt: 5 }}>
                    <Button variant="contained" type="submit">
                        Add
                    </Button>
                </Box>
            </Box>

            <ToastContainer />
        </Box>
        );

}
export default EventAdd;

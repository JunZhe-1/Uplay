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
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

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

function EventEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [imageFile, setimageFile] = useState(null);


    const [Eventinfo, setEvent] = useState({
        Event_Name: "",
        Event_Description: "",
        Event_Location: "",
        Event_Category: "Sports & Wellness",

        Event_Fee_Guest: 0,  
        Event_Fee_Uplay: 0,
        Event_Fee_NTUC: 0,
        Vacancies: 0,
    });

    useEffect(() => {
        http.get(`/Event/getEvent/${id}`).then((res) => {
            setimageFile(res.data.imageFile);
            setEvent(res.data);

        });
    }, []);


    const formik = useFormik({
        initialValues: Eventinfo,
        enableReinitialize: true,
        validationSchema: yup.object({
            Event_Name: yup.string().trim()
                .min(3, 'Event Name must be at least 3 characters')
                .max(50, 'Event Name must be at most 50 characters')
                .required('Event Name is required'),
            Event_Description: yup.string().trim()
                .min(3, 'Event Description must be at least 3 characters')
                .max(600, 'Event Description must be at most 300 characters')
                .required('Event Description is required'),
            Event_Location: yup.string().trim()
                .min(3, 'Event location format error')
                .max(300, 'Event location error')
                .required('Event location is required'),
            Event_Fee_Guest: yup.number()
                .min(1, 'Event Fee Guest Percent cannot below than 1')
                .max(1000, 'Event Fee Guest Percent cannot above 1000')
                .required('Event Fee Guest is required'),
            Event_Fee_Uplay: yup.number()
                .min(1, 'Event Fee Uplay Percent cannot below than 1')
                .max(1000, 'Event Fee Uplay Percent cannot above 1000')
                .required('Event Fee Uplay is required'),
            Event_Fee_NTUC: yup.number()
                .min(1, 'Event Fee Ntuc Percent cannot below than 1')
                .max(1000, 'Event Fee Ntuc Percent cannot above 1000')
                .required('Event_Name is required'),

            Vacancies: yup.number()
                .min(1, 'Vacancies Value cannot below than 0')
                .max(10000, 'maximun is 10000')
                .required('Vacancies is required'),


        }),
        onSubmit: (data) => {
            data.Event_Name = data.Event_Name.trim();
            data.Event_Description = data.Event_Description.trim();
            data.Event_Location = data.Event_Location.trim();
            if (imageFile) {
                data.imageFile = imageFile;
                
            }
            http.put(`/Event/update/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    console.log(res.data.imageFile);
                    navigate("/Event");
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
                    setimageFile(res.data.filename);
                })
                .catch(function (error) {
                    toast.error(`${error.response.data.message}`);

                    console.log(error.response);
                });
        }
    };

    return (

    
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Event

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
                            multiline
                            rows={4}
                            margin="dense"
                            autoComplete="off"
                            label="Event Description"
                            name="Event_Description"
                            value={formik.values.Event_Description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.touched.Event_Description && formik.errors.Event_Description)}
                            helperText={formik.touched.Event_Description && formik.errors.Event_Description}
                        />

                        <FormControl fullWidth margin="dense"
                            error={Boolean(formik.touched.Event_Category && formik.errors.Event_Category)}
                        >
                            <InputLabel htmlFor="Event_Category">Event Category</InputLabel>
                            <Select
                                name="Event_Category"
                                value={formik.values.Event_Category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                autoComplete="off"
                            >
                                <MenuItem value="Dine & Wine">Dine & Wine</MenuItem>
                                <MenuItem value="Family Bonding">Family Bonding</MenuItem>
                                <MenuItem value="Hobbies & Wellness">Hobbies & Wellness</MenuItem>
                                <MenuItem value="Sports & Wellness">Sports & Wellness</MenuItem>
                                <MenuItem value="Travel">Travel</MenuItem>
                            </Select>
                            {formik.touched.Event_Category && formik.errors.Event_Category && (
                                <FormHelperText>{formik.errors.Event_Category}</FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Event Location"
                            name="Event_Location"
                            value={formik.values.Event_Location}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={Boolean(formik.touched.Event_Location && formik.errors.Event_Location)}
                            helperText={formik.touched.Event_Location && formik.errors.Event_Location}
                        />


                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Event Fee Guest"
                                    name="Event_Fee_Guest"
                                    value={formik.values.Event_Fee_Guest}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    error={Boolean(formik.touched.Event_Fee_Guest && formik.errors.Event_Fee_Guest)}
                                    helperText={formik.touched.Event_Fee_Guest && formik.errors.Event_Fee_Guest}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Event Fee Uplay"
                                    name="Event_Fee_Uplay"
                                    value={formik.values.Event_Fee_Uplay}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    error={Boolean(formik.touched.Event_Fee_Uplay && formik.errors.Event_Fee_Uplay)}
                                    helperText={formik.touched.Event_Fee_Uplay && formik.errors.Event_Fee_Uplay}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    margin="dense"
                                    autoComplete="off"
                                    label="Event Fee NTUC"
                                    name="Event_Fee_NTUC"
                                    value={formik.values.Event_Fee_NTUC}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    type="number"
                                    error={Boolean(formik.touched.Event_Fee_NTUC && formik.errors.Event_Fee_NTUC)}
                                    helperText={formik.touched.Event_Fee_NTUC && formik.errors.Event_Fee_NTUC}
                                />
                            </Grid>
                        </Grid>



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
                    <Button variant="contained" type="submit" style={{ width: '100%' }}>
                        Add Event
                    </Button>
                </Box>
                <Box sx={{ mt: 1 }}>
                    <Link to="/Event" sx={{ color: 'white', textDecoration: 'none' }}>
                        <Button variant="contained" style={{ width: '100%' }}>
                            Cancel
                        </Button>
                    </Link>

                </Box>
            </Box>

            <ToastContainer />
        </Box>
    );

}


export default EventEdit;
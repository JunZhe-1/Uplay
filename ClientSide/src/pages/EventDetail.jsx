import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
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


function EventDetail() {
    const { id } = useParams();
    const [imageFile, setimageFile] = useState(null);

    const [EventDetail, setEvent] = useState({
        Event_Name: "",
        Event_Description: "",
        Event_Location: "",
        Event_Category: "Sports & Wellness",
        Event_Fee_Guest: 0,
        Event_Fee_Uplay: 0,
        Event_Fee_NTUC: 0,
        Vacancies: 0

    });

    useEffect(() => {
        http.get(`/Event/getEvent/${id}`).then((res) => {
            setimageFile(res.data.imageFile);
            console.log(res.data);
            setEvent(res.data);

        });
    }, []);


    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: '100%', border: 0 }}>
                <TableBody>
                    <TableRow><TableCell colSpan={2} >  <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>{EventDetail.Event_Name.toUpperCase()}</Typography></TableCell></TableRow>

                    <TableRow>
                        {/* this column use 2 to show the image */}
                        <TableCell colSpan={2} sx={{ width: '200vh' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                                <img
                                    alt="Event"
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                    style={{ width: '90%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                                />
                            </Box>
                        </TableCell>
                    </TableRow>

                    {/* this row is for showing event description */}
                    <TableRow>
                        <TableCell sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%', width:'65%', padding:'30px' }}>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>Description</Typography>
                            <Typography variant="body1">
                                {EventDetail.Event_Description}
                            </Typography>
                        </TableCell>

                        <TableCell rowSpan={2} sx={{ borderLeft: '1px #E0E0E0 solid' }}>
                            <Typography variant="h5" sx={{padding:'12px', color: '#F9F6EE', fontWeight: 'bold', textAlign: 'center', borderRadius: '8px 8px 0px 0px', background: '#E6533F' }}>Event Price</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                                <TableCell sx={{ borderRight: 'solid 1px #E0E0E0', textAlign: 'center', padding: '5px 30px 5px 30px', marginLeft:'-2vh' }}>
                                    <Typography>Guest <br /> $ {EventDetail.Event_Fee_Guest} </Typography>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center', padding: '5px 30px 5px 30px' }}>
                                    <Typography sx={{}}>Uplay <br />$ {EventDetail.Event_Fee_Uplay}</Typography>
                                </TableCell>
                                <TableCell sx={{ borderLeft: 'solid 1px #E0E0E0', textAlign: 'center', padding: '5px 30px 5px 30px', marginRight:'-2vh' }}>
                                    <Typography sx={{}}>NTUC <br /> $ {EventDetail.Event_Fee_NTUC}</Typography>
                                </TableCell>

                            </Box>
                            <br />
                            <Typography variant="h5" sx={{
                                cursor: 'pointer', color: '#F9F6EE',fontSize:'18px',padding:'8px', textAlign: 'center', borderRadius: '5px', background: '#E6533F',  transition: 'background 0.3s ease', // Add transition for smooth hover effect
                                '&:hover': {
                                    background: '#FF8C5E', // Change to the desired hover background color
                                },
                            }}>Event Price</Typography>

                        </TableCell>


                    </TableRow>

                    {/* this row is for showing event Location */}
                    <TableRow>
                        <TableCell sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%', width: '65%', padding: '30px' }}>
                            <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>Location</Typography>
                            <Typography variant="body1">
                                {EventDetail.Event_Location}
                            </Typography>
                        </TableCell>                    </TableRow>
                </TableBody>
            </TableContainer>
        </Paper>


    )
}
export default EventDetail;
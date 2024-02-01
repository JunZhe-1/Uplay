import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Grid, Card, CardContent,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions

} from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { useParams, useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';
import global from '../global';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import da from 'date-fns/locale/da';


function HomePage() {
    const [imageFile, setimageFile] = useState(null);
    const [EventListBackup, setEventBackup] = useState([]);
    const [reloadPage, setReloadPage] = useState(true);

    useEffect(() => {
        getEvents();
        
    }, []);

    const getEvents = () => {
        http.get(`/Event`).then((res) => {
            const today = new Date();
            console.log(res.data.Event_Launching_Date > today);
            const filteredEvents = res.data.filter(event => new Date(event.Event_Launching_Date) > today && event.Event_Status === true);
            const firstFourEvents = filteredEvents.slice(0, 4); // Take only the first four events
            var memstat = localStorage.getItem("memberStatus")
            console.log(memstat)
            setEventBackup(firstFourEvents);
            console.log(filteredEvents);
           
        });
    };


    return (
        <Box>
            <Box style={{ width: '100%',  marginTop:'2vh' }}>
                <img
                    alt="data"
                    src={`./image/uplayhome.jpg`}
                    style={{
                        width: '100%',
                        objectFit: 'cover',
                    }}
                /></Box>
            <Box>
                <Typography variant="h4" style={{ textAlign: 'center', padding:'18px' }}>
                    <b>About Uplay</b>
                </Typography><br />
                <Typography>UPlay, powered by NTUC Club, is a phygital (physical + digital) concierge of curatorial recreation experiences to enhance the social well-being of all workers.</Typography>
                <br /> <br />
                <Typography>More than just a booking platform, UPlay aspires to connect people from all walks of life, forging new relationships over time as they find a common thread through shared interests. Union and companies can also join us in creating fun and engaging communities while cultivating deep connections and lifelong relationships.

</Typography>
            </Box>
            <Box>  <br />  <br />  <Typography variant="h4" style={{ textAlign: 'center', padding: '18px' }}>
                <b>Up Coming Events</b>
            </Typography><br />

                <Grid container spacing={3}>
                    {EventListBackup.map((data) => (
                        <Grid item xs={12} md={6} lg={3} key={data.id}>
                            <Card
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 8px 5px rgba(0, 0, 0, 0.2)',
                                    height: '100%',
                                }}
                            >
                                {data.imageFile && (
                                    <Box
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '100%',
                                            overflow: 'hidden',
                                            maxHeight: '200px', // Adjust the max height of the image
                                        }}
                                    >
                                        <img
                                            alt="data"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${data.imageFile}`}
                                            style={{
                                                height:'20vh',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </Box>
                                )}
                                <CardContent
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mb: 2, fontSize: '20px' }}>
                                        <b> {data.Event_Name}</b>
                                    </Typography>

                                    <Typography variant="h6" sx={{ mb: 2, fontSize: '16px' }}>
                                     Available from: <b>   {dayjs.utc(data.Event_Launching_Date).format(global.datetimeFormat1)}</b>
                                    </Typography>
                                    
                                    <Box sx={{ flexGrow: 1 }}></Box>
                                    {/*<Link to={`/Event/getEvent/${data.Event_ID}`}>*/}
                                    {/*    <Button className="add_btn"*/}
                                    {/*        sx={{*/}
                                    {/*            fontSize: '16px',*/}
                                    {/*            padding: '1px',*/}
                                    {/*            width: '100%',*/}
                                    {/*            border: '1px #E6533F solid',*/}
                                    {/*            backgroundColor: 'white',*/}
                                    {/*            color: '#E6533F',*/}
                                    {/*            transition: 'background-color 0.2s ease-in-out, color 0.5s ease-in-out',*/}
                                    {/*            '&:hover': {*/}
                                    {/*                backgroundColor: '#E6533F',*/}
                                    {/*                color: 'white',*/}
                                    {/*            },*/}
                                    {/*        }}*/}
                                    {/*    >*/}
                                    {/*        <b>See Detail</b>*/}
                                    {/*    </Button>*/}
                                    {/*</Link>*/}

                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box style={{ width: '100%', marginTop: '10vh'}}>
                    <img
                        alt="data"
                        src={`./image/contact.png`}
                        style={{
                            width: '100%',
                            objectFit: 'fit',
                        }}
                    /></Box>

            </Box>
        </Box>
    );


}
export default HomePage;
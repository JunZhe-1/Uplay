import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , TextField, Dialog, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions,Select,MenuItem
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
import Rating from 'react-rating-stars-component';

function EventDetail() {
    const { id } = useParams();
    const [imageFile, setimageFile] = useState(null);
    const { user } = useContext(UserContext);
    const [EventDetail, setEvent] = useState({
        Event_ID: "",
        Event_Name: "",
        Event_Description: "",
        Event_Location: "",
        Event_Category: "Sports & Wellness",
        Event_Fee_Guest: 0,
        Event_Fee_Uplay: 0,
        Event_Fee_NTUC: 0,
        Vacancies: 0,
        User_ID: user.userId
    });

    useEffect(() => {
        http.get(`/Event/getEvent/${id}`).then((res) => {
            setimageFile(res.data.imageFile);
            console.log(res.data);
            setEvent(res.data);
        });
        http.get(`/Event/getreview/${id}`).then((res) => {
            setreview(res.data);
        });
    }, []);

    const formik = useFormik({
        initialValues: {
            Event_Review: "",
            Rating: 0,
            User_ID: user.userId,
            Event_ID: EventDetail.Event_ID,
            Sort: "htl"
        },
        validationSchema: yup.object({
            Event_Review: yup.string().trim()
                .min(3, 'Event review must be at least 3 characters')
                .max(50, 'Event review must be below 50 characters for user conciseness.'),
            Rating: yup.number()
                .min(1, 'Rating cannot be below 1')
                .max(5, 'Rating cannot be above 5')
                .required('Rating is required'),
            Sort: yup.string().required('order is required')

        }),
        onSubmit: (event) => {
            console.log(user.userId, EventDetail.Event_ID);
            event.Event_Review = event.Event_Review.trim();
            event.Rating = parseInt(event.Rating);
            event.User_ID = user.userId;
            event.Event_ID = EventDetail.Event_ID;

            console.log(event);
            http.post("Event/review", event)
                .then((res) => {
                    console.log(res.data);
                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                    console.log(err.response.data.message);
                })
        }
    });

    const columns = [
        //{ id: 'no', label: 'No', minWidth: 15 },
        { id: 'rating', label: 'Rating', minWidth: 2 },
        { id: 'eventReview', label: 'Event Review', minWidth: 15 },
    ];

    const [reviewData, setreview] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    function createData(no, rating, eventReview) {
        return { no, rating, eventReview };
    }

    let num = 1;
    const rows = reviewData.map((item) => {
        const Rating = item.Rating;
        const Event_Review = item.Event_Review;

        return createData(num++, Rating, Event_Review);
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', border: 0, marginTop: '3vh' }}>
            <form onSubmit={formik.handleSubmit}>
                <TableContainer sx={{ maxHeight: '100%', border: 0 }}>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Typography variant="h5" sx={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>{EventDetail.Event_Name.toUpperCase()}</Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
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

                        <TableRow>
                            <TableCell sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%', width: '65%', padding: '30px' }}>
                                <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>Description</Typography>
                                <Typography variant="body1">
                                    {EventDetail.Event_Description}
                                </Typography>
                            </TableCell>

                            <TableCell rowSpan={2} sx={{ borderLeft: '1px #E0E0E0 solid' }}>
                                <Typography variant="h5" sx={{ padding: '12px', color: '#F9F6EE', fontWeight: 'bold', textAlign: 'center', borderRadius: '8px 8px 0px 0px', background: '#E6533F' }}>Event Price</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px' }}>
                                    <TableCell sx={{ borderRight: 'solid 1px #E0E0E0', textAlign: 'center', padding: '5px 30px 5px 30px', marginLeft: '-2vh' }}>
                                        <Typography>Guest <br /> $ {EventDetail.Event_Fee_Guest} </Typography>
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'center', padding: '5px 30px 5px 30px' }}>
                                        <Typography sx={{}}>Uplay <br />$ {EventDetail.Event_Fee_Uplay}</Typography>
                                    </TableCell>
                                    <TableCell sx={{ borderLeft: 'solid 1px #E0E0E0', textAlign: 'center', padding: '5px 30px 5px 30px', marginRight: '-2vh' }}>
                                        <Typography sx={{}}>NTUC <br /> $ {EventDetail.Event_Fee_NTUC}</Typography>
                                    </TableCell>
                                </Box>
                                <br />
                                <Typography
                                    variant="h5"
                                    sx={{
                                        cursor: new Date(EventDetail.Event_Launching_Date) > new Date() ? 'auto' : 'pointer',
                                        fontSize: '18px',
                                        padding: '8px',
                                        textAlign: 'center',
                                        borderRadius: '5px',
                                        transition: 'background 0.3s ease',
                                        color: new Date(EventDetail.Event_Launching_Date) > new Date() ? 'grey' : '#F9F6EE',
                                        background: new Date(EventDetail.Event_Launching_Date) > new Date() ? 'lightgrey' : '#E6533F',
                                        '&:hover': {
                                            background: new Date(EventDetail.Event_Launching_Date) > new Date() ? 'lightgrey' : '#FF8C5E',
                                        },
                                    }}
                                >
                                    Book Now
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%', width: '65%', padding: '30px' }}>
                                <Typography variant="h6" sx={{ color: 'black', fontWeight: 'bold' }}>Location</Typography>
                                <Typography variant="body1">
                                    {EventDetail.Event_Location}
                                </Typography><br /><br />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                   
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Typography variant="h4" style={{ color: '#E6533F', marginTop: '3vh' }}><br /><b>Event Review</b></Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <Typography variant="h7">
                                    <br />
                                    <b>Write Your Review</b>
                                </Typography>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <Rating
                                    count={5}
                                    onChange={(rating) => formik.setFieldValue('Rating', rating)}
                                    value={formik.values.Rating}
                                    size={36}
                                    style={{ color: '#FF5733', activeColor: 'yellow' }}
                                />
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={100} lg={25}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            margin="dense"
                                            autoComplete="off"
                                            label="Event Review"
                                            name="Event_Review"
                                            value={formik.values.Event_Review}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={Boolean(formik.touched.Event_Review && formik.errors.Event_Review)}
                                            helperText={formik.touched.Event_Review && formik.errors.Event_Review}
                                        />
                                    </Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>
                                <Box sx={{ mt: 5 }}>
                                    <Button variant="contained" type="submit">
                                        Share Your Review
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </TableContainer>
                <Select
                    label="Years"
                    name="years"
                    value={formik.values.Sort}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Sort && Boolean(formik.errors.sort)}
                    style={{ marginBottom: '10px' }}
                >
                    <MenuItem value={"htl"}>  Highest rating to Lowest</MenuItem>
                    <MenuItem value={"lth"}>  Lowest rating to highest</MenuItem>
                    <MenuItem value={"nto"}> Newest to Oldest</MenuItem>
                </Select>

                <TableContainer style={{ height: '380px' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" colSpan={4} style={{ fontSize: '25px', fontWeight: 'bold', color: 'black', textAlign: 'center' }}>
                                   
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ top: 20, minWidth: column.minWidth, fontWeight: 'bold' }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>

            </form>
            <ToastContainer />
            <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default EventDetail;

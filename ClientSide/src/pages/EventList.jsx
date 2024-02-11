import React, { useEffect, useState, useContext, navigate } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {

    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Switch
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { AccountCircle, AccessTime, Search, Settings, Clear, Visibility, Edit, Delete, Block } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import Tutorials from './Tutorials';
import UserContext from '../contexts/UserContext';



function EventList() {
    const navigate = useNavigate();
    const [EventList, setEventList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    const [voucher_id, setid] = useState('');


    useEffect(() => {
        getEventList();
    }, []);

    const getEventList = () => {
        http.get('/Event').then((res) => {
            setEventList(res.data);
            console.log(res.data.Event_Fee_Guest);
            console.log(res.data);

        })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });
    };


    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchsender();
        }
    };


    const [showSearchInput, setShowSearchInput] = useState(true); 


    const toggleSearchInput = (id, status) => {
        console.log("triggle points");
        var j = !status
        console.log(j,id);

        http.put(`/Event/updateStatus/${id}`, j)
        .then((res) => {
            if (search === ""){
            console.log("update status sucessfully");
            getEventList();
        }else{
            searchsender();
        }

        })
            .catch(function (err) {
                toast.error(`${err.response.data.message}`);
            });
    };


    const onClickSearch = () => {
        searchsender();
    }

    const onClickClear = () => {
        setSearch('');
        getEventList();
    };

    const searchsender = () => {
        if (search.trim() !== '') {
            http.get(`/Event?search=${search}`).then((res) => {
                setEventList(res.data);
            });
        }

    };

    const [open, setOpen] = useState(false);

    const handleOpen = (id) => {
        setOpen(true);
        setid(id);

    };

    const handleClose = () => {
        setOpen(false);
        setid(null)
    };

    const deleteVoucher = (id) => {
        http.delete(`/Event/delete/${id}`)
            .then((res) => {
                setOpen(false);
                getEventList();
            });
    };



    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2, color: 'black', fontWeight: 'bold' }}>
                Event Management
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                        user.emailAddress.toLowerCase() === "admin@gmail.com" && (
                        <Link to="/Event/add_event" style={{ textDecoration: 'none' }}>
                            <Button variant='contained' style={{ background: 'grey' }}>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>



            
            


            <Paper sx={{ width: '100%', overflow: 'hidden'}}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ width: '20%' }}>Image</TableCell>
                                <TableCell style={{ width: '20%' }}>Name</TableCell>
                                <TableCell style={{ width: '20%' }}>Start from</TableCell>
                                <TableCell style={{ width: '20%' }}>Location</TableCell>
                                <TableCell style={{ width: '20%' }}>Category</TableCell>
                                <TableCell style={{ width: '20%', textAlign: 'center' }}> Uplay Price</TableCell>
                                <TableCell style={{ width: '20%' }}>Vacancy</TableCell>
                                <TableCell style={{ width: '20%' }}></TableCell>
                                <TableCell style={{ width: '20%' }}></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {EventList
                                .sort((a, b) => new Date(a.UpdatedAt) - new Date(b.UpdatedAt))
                                .map((data, index) => (
                                    <TableRow key={index}>
                                        <TableCell style={{ width: '20%' }}>
                                            {data.imageFile && (
                                                <Box>
                                                    <img
                                                        alt="tutorial"
                                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${data.imageFile}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                                                    />
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell style={{ width: '20%' }}>{data.Event_Name}</TableCell>
                                        <TableCell style={{ width: '20%' }}>{dayjs.utc(data.Event_Launching_Date).format(global.datetimeFormat1)}</TableCell>
                                        <TableCell style={{ width: '20%' }}>{data.Event_Location}</TableCell>
                                        <TableCell style={{ width: '20%' }}>{data.Event_Category}</TableCell>
                                        <TableCell style={{ width: '20%', textAlign: 'center' }}>
${data.Event_Fee_Uplay}
                                        </TableCell>
                                        <TableCell style={{ width: '20%' }}>{data.Vacancies} </TableCell>
                                        <TableCell>

                                            <Switch
                                                checked={data.Event_Status}
                                                onChange={() => toggleSearchInput(data.Event_ID, data.Event_Status)}
                                            color="primary"
                                        /></TableCell>


                                        <TableCell style={{ width: '20%' }}>
                                            <Link to={`/Event/editevent/${data.Event_ID}`}>
                                                <IconButton color="primary" sx={{ padding: '4px', color: '#0096FF' }}>
                                                    <Edit />
                                                </IconButton>

                                            </Link>
                                        </TableCell>

                                        <TableCell style={{ width: '20%' }}>
                                            <IconButton color="primary" onClick={() => handleOpen(data.Event_ID)} style={{ color: 'red' }}>
                                                <Clear />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Paper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Event
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to Delete this Event, ID ${voucher_id} ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={() => deleteVoucher(voucher_id)}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer /> </Box>




    );
}

export default EventList;
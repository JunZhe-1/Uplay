import React, { useEffect, useState, useContext, navigate } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { AccountCircle, AccessTime, Search, Settings, Clear, Visibility, Edit, Delete, Block } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import Tutorials from './Tutorials';



function EventList() {
    const navigate = useNavigate();
    const [VoucherList, setVoucherList] = useState([]);
    const [search, setSearch] = useState('');
    const [voucher_id, setid] = useState('');


    useEffect(() => {
        getVoucherList();
    }, []);

    const getVoucherList = () => {
        http.get('/Event').then((res) => {
            setVoucherList(res.data);
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





    const onClickSearch = () => {
        searchsender();
    }

    const onClickClear = () => {
        setSearch('');
        getVoucherList();
    };

    const searchsender = () => {
        if (search.trim() !== '') {
            http.get(`/Event?search=${search}`).then((res) => {
                setVoucherList(res.data);
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
                getVoucherList();
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
            </Box>



            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ImageFile</TableCell>
                                <TableCell>Event Name</TableCell>
                                <TableCell>Event Description</TableCell>
                                <TableCell>GUEST Fee</TableCell>
                                <TableCell>NTUC Fee</TableCell>
                                <TableCell>Uplay Fee</TableCell>
                                <TableCell>Vacancy</TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {VoucherList
                                .sort((a, b) => new Date(a.end_Date) - new Date(b.end_Date))
                                .map((data, index) => (


                                    <TableRow key={index}>
                                        <TableCell> {
                                            data.ImageFile && (
                                                <Box >
                                                    <img
                                                        alt="tutorial"
                                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${data.ImageFile}`}
                                                        style={{ width: '40%', height: '40%', objectFit: 'cover' }}
                                                    />

                                                </Box>
                                            )
                                        }</TableCell>
                                        <TableCell>{data.Event_Name}</TableCell>
                                        <TableCell>{data.Event_Description}</TableCell>
                                        <TableCell>{data.Event_Fee_Guest}</TableCell>
                                        <TableCell>{data.Event_Fee_NTUC}</TableCell>
                                        <TableCell>{data.Event_Fee_Uplay}</TableCell>
                                        <TableCell>{data.Vacancies}</TableCell>

                                        <TableCell> <IconButton color="primary"
                                            onClick={() => handleOpen(data.Event_ID)}>
                                            <Clear />
                                        </IconButton></TableCell>
                                        <TableCell> <Link to={`/Voucher/update/${data.Event_ID}`}>
                                            <IconButton color="primary" sx={{ padding: '4px' }}>
                                                <Edit />
                                            </IconButton>
                                        </Link></TableCell>





                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Voucher
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to Delete this Voucher?
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
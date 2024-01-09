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
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import global from '../global';
import Tutorials from './Tutorials';

function VoucherList() {
    const navigate = useNavigate();
    const [VoucherList, setVoucherList] = useState([]);
    const [search, setSearch] = useState('');
    const [voucher_id, setid] = useState('');

    // get all the voucher first
    useEffect(() => {
        getVoucherList();
    }, []);

    const getVoucherList = () => {
        http.get('/Voucher/admin').then((res) => {
            setVoucherList(res.data);

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
            http.get(`/Voucher/admin?search=${search}`).then((res) => {
                setVoucherList(res.data);
            });
        }

    };
    const [open, setOpen] = useState(false);

    const handleOpen = (id) => {
        setOpen(true);
        setid(id);
        console.log("id: " + id);
        console.log("voucher: " + voucher_id);

    };

    const handleClose = () => {
        setOpen(false);
        setid(null)
    };

    const deleteVoucher = (id) => {
        http.delete(`/Voucher/delete/${id}`)
            .then((res) => {
                setOpen(false);
                getVoucherList();
            });
    };




    return (
        <Box>
        <Typography variant="h5" sx={{ my: 2, color: 'black', fontWeight: 'bold' }}>
            Voucher Management
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
                                <TableCell>imageFile</TableCell>
                            <TableCell>Voucher Name</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                                <TableCell>member type</TableCell>
                            <TableCell>Discount</TableCell>
                           
                        </TableRow>
                    </TableHead>

                    <TableBody>
                            {VoucherList
                                .sort((a, b) => new Date(a.end_Date) - new Date(b.end_Date))    
                                .map((data, index) => (


                                    <TableRow key={index}>
                                        <TableCell style={{ width: '20%', height: '20%' }}> {
                                            data.ImageFile && (
                                                <Box  >
                                                    <img
                                                        alt="tutorial"
                                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${data.ImageFile}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                                                    />

                                                </Box>
                                            )
                                        }</TableCell>
                                    <TableCell>{data.Voucher_Name}</TableCell>
                                        <TableCell>{dayjs.utc(data.Start_Date).format(global.datetimeFormat)}</TableCell>
                                        <TableCell>{dayjs.utc(data.End_Date).format(global.datetimeFormat)}</TableCell>
                                        <TableCell>{data.Member_Type}</TableCell>
                                    <TableCell>
                                        <>
                                            {data.Discount_type == "Value" ? (
                                                <>
                                                    ${data.Discount_In_Value}
                                                </>
                                            ) : (
                                                <>
                                                        {data.Discount_In_Percentage}%
                                                </>
                                            )}
                                        </>

                                        </TableCell>
                                        <TableCell> <IconButton color="primary"
                                            onClick={() => handleOpen(data.Voucher_ID)}>
                                            <Clear />
                                        </IconButton></TableCell>
                                        <TableCell> <Link to={`/Voucher/update/${data.Voucher_ID}`}>
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

export default VoucherList;
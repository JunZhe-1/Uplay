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

function VoucherList() {
    const navigate = useNavigate();
    const [VoucherList, setVoucherList] = useState([]);
    const [search, setSearch] = useState('');

    // get all the voucher first
    useEffect(() => {
        getVoucherList();
    }, []);

    const getVoucherList = () => {
        http.get('/Voucher').then((res) => {
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
            http.get(`/Voucher?search=${search}`).then((res) => {
                setVoucherList(res.data);
            });
        }

    };


    console.log(VoucherList);


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
                                <TableCell>Voucher Name</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>member type</TableCell>
                                <TableCell>Discount</TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {/* {pointList.map((data, index) => ( */}
                            {VoucherList
                                .sort((a, b) => new Date(a.end_Date) - new Date(b.end_Date))
                                .map((data, index) => (


                                    <TableRow key={index}>
                                        <TableCell>{data.voucher_Name}</TableCell>
                                        <TableCell>       {dayjs(data.start_Date).format(global.datetimeFormat)}</TableCell>
                                        <TableCell>{dayjs(data.end_Date).format(global.datetimeFormat)}</TableCell>
                                        <TableCell>{data.member_type}</TableCell>
                                        <TableCell>
                                            <>
                                                {data.discount_type == "Value" ? (
                                                    <>
                                                        ${data.discount_In_value}
                                                    </>
                                                ) : (
                                                    <>
                                                        {data.discount_In_percentage}%
                                                    </>
                                                )}
                                            </>

                                        </TableCell>




                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <ToastContainer /> </Box>




    );
}

export default VoucherList;

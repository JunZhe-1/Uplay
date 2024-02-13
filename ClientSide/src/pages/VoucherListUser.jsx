﻿import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, AppBar, Toolbar, Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,  } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function VoucherListUser() {
    const [VoucherList, setVoucher] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const navigate = useNavigate();


    const { user } = useContext(UserContext);
    console.log(user);

    const getVoucherUser = () => {
        http.get(`/Voucher/uservoucher/${user.userId}`).then((res) => {
            setVoucher(res.data);
            setFilteredVouchers(res.data);
        });
    };

    useEffect(() => {
        getVoucherUser();
    }, []);

    const [vouchercatname, setvouchercategory] = useState("all");


    const filterVouchers = (search) => {
        setvouchercategory(search);
        if (search === 'expiring') {
            const currentDate = new Date();
            const currentDayOfWeek = currentDate.getDay();

            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(currentDate.getDate() - currentDayOfWeek);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const filteredList = VoucherList.filter((x) => {
                const voucherEndDate = new Date(x.End_Date);
                return voucherEndDate >= startOfWeek && voucherEndDate <= endOfWeek;
            });

            setFilteredVouchers(filteredList);
        } else if (search === 'lastest') {
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            const filtermonth = VoucherList.filter((x) => {
                const voucherMonth = new Date(x.Create_date).getMonth() + 1;
                const voucherYear = new Date(x.Create_date).getFullYear();
                return voucherMonth === currentMonth && voucherYear === currentYear;
            });

            setFilteredVouchers(filtermonth);
        } else {
            setFilteredVouchers(VoucherList);
        }
    };



    return (
        <Box style={{ padding: '20px' }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'black', fontWeight: 'bold' }}>
                My Vouchers
            </Typography>

            <AppBar position="static" className="AppBar2" style={{ backgroundColor: 'white', padding: '0px 0px 3vh 0px', marginLeft: '-3vh' }} elevation={0}>
                <Container>
                    <Toolbar disableGutters={true}>
                        <Button onClick={() => filterVouchers('all')}  sx={{
    backgroundColor: vouchercatname === "all" ? "#E6533F" : "white",
    color: vouchercatname === "all" ? "white" : "#E6533F",
    transform: vouchercatname === "all" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: vouchercatname === "all" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            All Vouchers
                        </Button>
                        <Button onClick={() => filterVouchers('lastest')} sx={{
    backgroundColor: vouchercatname === "lastest" ? "#E6533F" : "white",
    color: vouchercatname === "lastest" ? "white" : "#E6533F",
    transform: vouchercatname === "lastest" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: vouchercatname === "lastest" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            Newest
                        </Button>
                        <Button onClick={() => filterVouchers('expiring')} sx={{
    backgroundColor: vouchercatname === "expiring" ? "#E6533F" : "white",
    color: vouchercatname === "expiring" ? "white" : "#E6533F",
    transform: vouchercatname === "expiring" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: vouchercatname === "expiring" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            Expiring
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>

            <Typography variant="h5" sx={{ mb: 2, color: 'black', fontWeight: '20px' }}>
                Results ({filteredVouchers.length})
            </Typography>


            <Grid container spacing={3}>
                {filteredVouchers
                    .sort((a, b) => new Date(a.end_Date) - new Date(b.end_Date))    

                    .map((data) => (
                    <Grid item xs={12} md={6} lg={6} key={data.id}>
                        <Card
                            sx={{
                                display: 'flex',
                                flexDirection: 'row', 
                                boxShadow: '0 8px 5px rgba(0, 0, 0, 0.1)',
                                height: '100%',
                            }}
                        >
                                {data.ImageFile && (
                                <Box
                                    style={{
                                        flex: '0 0 25%',
                                        overflow: 'hidden',
                                      
                                    }}
                                >
                                    <img
                                            alt="data"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${data.ImageFile}`}
                                        style={{
                                            width: '100%',
                                            border:'1px solid grey',
                                            objectFit: 'cover',
                                            height: '100%',

                                        }}
                                    />
                                </Box>
                            )}
                            <CardContent
                                sx={{
                                    flex: '1', 
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    <b>{data.Voucher_Name}</b>
                                </Typography>
                                <Typography
                                    sx={{ color: 'text.secondary', mb: 1, fontSize: '16px' }}
                                >
                                    {data.Voucher_Description}
                                </Typography>
                                <Box sx={{ flexGrow: 1 }}></Box>
                                <Link to={`/Cart/getcart/:id?discount=${data.Discount_In_Value}`} style={{ textDecoration: 'none' }}>
                                <Button
                                    className="add_btn"
                                    sx={{
                                    fontSize: '16px',
                                    padding: '1px',
                                    border: '1px #E6533F solid',
                                    backgroundColor: 'white',
                                    color: '#E6533F',
                                    transition: 'background-color 0.2s ease-in-out, color 0.5s ease-in-out',
                                    '&:hover': {
                                        backgroundColor: '#E6533F',
                                        color: 'white',
                                    },
                                    }}
                                >
                                    <b>Add</b>
                                </Button>
                                </Link>
                                <Typography
                                    sx={{
                                        color: 'text.secondary',
                                        mt: 1,
                                        fontSize: '14px',
                                        display: 'flex',
                                        justifyContent: 'flex-end', // Align horizontally to the right
                                        alignItems: 'flex-end', // Align vertically to the bottom
                                    }}>
                                    Till &nbsp;<b>{dayjs(data.End_Date).format(global.datetimeFormat1)}</b>
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
};
export default VoucherListUser;
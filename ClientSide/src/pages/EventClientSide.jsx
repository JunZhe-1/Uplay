import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Container, AppBar, Toolbar,
Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import EventList from './EventList';
function EventClientSide() {
    const [EventList, setEvent] = useState([]);
    const [search, setSearch] = useState('');

    // user id to get their voucher information
    const { user } = useContext(UserContext);

    const getEvents = () => {
        http.get(`/Event`).then((res) => {
            setEvent(res.data);
            console.log(res.data);
        });
    };


    useEffect(() => {
        getEvents();
    }, []);


    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };


    const searchEvent = () => {
        http.get(`/Event?search=${search}`).then((res) => {
            setEvent(res.data);
        });
    };



    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchEvent();
        }
    };

    const onClickSearch = () => {
        searchEvent();
    }

    const onClickClear = () => {
        setSearch('');
        getEvents();
    };
    return (

<Box style={{ padding: '20px' }}>
    <Typography variant="h5" sx={{ mb: 2, color: 'black', fontWeight: 'bold' }}>
        Events
    </Typography>



    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Input value={search} placeholder="Search"
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown} />
        <IconButton color="primary"
            onClick={onClickSearch}>
            <Search />
        </IconButton>
        <IconButton color="primary"
            onClick={onClickClear}>
            <Clear />
                </IconButton>
            </Box>

            <AppBar position="static" className="AppBar1" style={{ backgroundColor: 'white', padding: '0px 0px 5vh 0px' }} elevation={0}>
                <Container>
                    <Toolbar disableGutters={true}>

                        <Link to="/tutorials" ><Typography>All Categories</Typography></Link>



                        <Link to="/Voucher/uservoucher/:id" ><Typography>Dine & Wine</Typography></Link>

                        <Link to="/register" ><Typography>Family Bonding</Typography></Link>
                        <Link to="/login" ><Typography>Hobbies & Wellness</Typography></Link>
                        <Link to="/login" ><Typography>Sports & Wellness</Typography></Link>
                        <Link to="/login" ><Typography>Travel</Typography></Link>



                    </Toolbar>
                </Container>
            </AppBar>
            <Typography variant="h5" sx={{ mb: 2, color: 'black', fontWeight: '20px' }}>
                Results ({EventList.length})
            </Typography>
        
    <Grid container spacing={3}>
        {EventList.map((data) => (
            <Grid item xs={12} md={6} lg={4} key={data.id}>
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
                        <Typography variant="h6" sx={{ mb: 0, fontSize: '25px' }}>
                            <b> {data.Event_Name}</b>
                        </Typography>
                        <Typography
                            sx={{ color: 'text.secondary', mt:-1, fontSize: '20px' }}
                        >
                            Uplay: <b>&nbsp;${data.Event_Fee_Uplay}</b><br />
                            NTUC: <b>${data.Event_Fee_NTUC}</b>
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}></Box>
                        <Button
                            sx={{
                                fontSize: '16px',
                                padding: '1px',
                                border: '1px #E6533F solid',
                                backgroundColor: 'white',
                                color: '#E6533F',
                            }}
                        >
                            <b>See Detail</b>
                        </Button>
                        
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
</Box>
)
};
export default EventClientSide;
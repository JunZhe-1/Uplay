import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Container, AppBar, Toolbar,
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button
} from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import EventList from './EventList';
function EventClientSide() {
    const [EventList, setEvent] = useState([]);
    const [EventListBackup, setEventBackup] = useState([]);
    const [search, setSearch] = useState('');

    // user id to get their voucher information
    const { user } = useContext(UserContext);

    const getEvents = () => {
        http.get(`/Event`).then((res) => {
            const userEvents = res.data.filter(event =>  event.Event_Status === true);
            setEvent(userEvents);
            setEventBackup(userEvents);
            console.log(res.data);
        });
    };

    const [categoryname, setcategoryname] = useState("all");


    useEffect(() => {
        getEvents();
    }, []);

    const filterEvent = (i) => {
        console.log(i);
        setcategoryname(i);
        if (i) {
            const now = new Date();
            if (i == "all") {
                filterEvent(null);
                setcategoryname("all");
            }
            else if (i == "upcoming") {
                const selectedEvents = EventList.filter((x) => {
                    const eventLaunchingDate = new Date(x.Event_Launching_Date);
                    const comparisonResult = now < eventLaunchingDate ;

                    return comparisonResult;
                });
                setEventBackup(selectedEvents);

            }

            else {
                const selectedEvents = EventList.filter((x) => {
                    const eventLaunchingDate = new Date(x.Event_Launching_Date);
                    const comparisonResult = i === x.Event_Category && now >= eventLaunchingDate;
                    return comparisonResult;
                });
                setEventBackup(selectedEvents);
            }

        }
        else {
            setEventBackup(EventList);
        }


    }



    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };


    const searchEvent = () => {
        http.get(`/Event?search=${search}`).then((res) => {
            setEventBackup(res.data);
            console.log(res.data);
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



            <Box sx={{
                display: 'flex', alignItems: 'center', mb: 2, borderRadius: '8px', justifyContent: 'center', width: '100%', border: '1px #ECECEC solid', padding: '20px', backgroundColor: '#ECECEC'
            }}>
                {/*        <Box style={{ border: 'black 1px solid', borderRadius: '10px' }}>*/}
                <Input
                    value={search}
                    placeholder="Search for events"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                    style={{
                        border: 'black 1px solid',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        padding: '4px 8px 4px 8px',
                        width: '25%',
                        textDecoration: 'none',
                    }}
                />

                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search style={{ color: '#E6533F', fontWeight: 'bold' }} />
                </IconButton>
                {/*<IconButton color="primary"*/}
                {/*    onClick={onClickClear}>*/}
                {/*    <Clear />*/}
                {/*            </IconButton>*/}
                {/*    </Box>*/}
            </Box>

            <AppBar position="static" className="AppBar3" style={{ backgroundColor: 'white', padding: '0 0 6vh 0' }} elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters={true} style={{ whiteSpace: 'nowrap' }}>
                    <Button
  onClick={() => filterEvent('all')}
  sx={{
    backgroundColor: categoryname === "all" ? "#E6533F" : "white",
    color: categoryname === "all" ? "white" : "#E6533F",
    transform: categoryname === "all" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: categoryname === "all" ? "scale(1)" : "scale(1.07)", 
      } }}>
  All Categories
</Button>


                        <Button onClick={() => filterEvent('upcoming')} sx={{ 
                            backgroundColor: categoryname === "upcoming" ? "#E6533F" : "white",
    color: categoryname === "upcoming" ? "white" : "#E6533F",
    transform: categoryname === "upcoming" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: categoryname === "UpComing" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            UpComing
                        </Button>

                        <Button onClick={() => filterEvent('Dine & Wine')} sx={{  backgroundColor: categoryname === "Dine & Wine" ? "#E6533F" : "white",
    color: categoryname === "Dine & Wine" ? "white" : "#E6533F",
    transform: categoryname === "Dine & Wine" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: categoryname === "Dine & Wine" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            Dine & Wine
                        </Button>

                        <Button onClick={() => filterEvent('Family Bonding')} sx={{  backgroundColor: categoryname === "Family Bonding" ? "#E6533F" : "white",
    color: categoryname === "Family Bonding" ? "white" : "#E6533F",
    transform: categoryname === "Family Bonding" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out', 
    '&:hover': {
        transform: categoryname === "Family Bonding" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            Family Bonding
                        </Button>

                        <Button onClick={() => filterEvent('Hobbies & Wellness')} sx={{  backgroundColor: categoryname === "Hobbies & Wellness" ? "#E6533F" : "white",
    color: categoryname === "Hobbies & Wellness" ? "white" : "#E6533F",
    transform: categoryname === "Hobbies & Wellness" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out', 
    '&:hover': {
        transform: categoryname === "Hobbies & Wellness" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            Hobbies & Wellness
                        </Button>

                        <Button onClick={() => filterEvent('Sports & Wellness')} sx={{  backgroundColor: categoryname === "Sports & Wellness" ? "#E6533F" : "white",
    color: categoryname === "Sports & Wellness" ? "white" : "#E6533F",
    transform: categoryname === "Sports & Wellness" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out', 
    '&:hover': {
        transform: categoryname === "Sports & Wellness" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            Sports & Wellness
                        </Button>

                        <Button onClick={() => filterEvent('Travel')} sx={{  backgroundColor: categoryname === "Travel" ? "#E6533F" : "white",
    color: categoryname === "Travel" ? "white" : "#E6533F",
    transform: categoryname === "Travel" ? "scale(1)" : "scale(1)",
    margin: '0 10px 0 0',
    borderRadius: '10px',
    border: 'solid 2px #E6533F',
    padding: '8px 20px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: categoryname === "Travel" ? "scale(1)" : "scale(1.07)", 
      } }}>
                            Travel
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>


            <Typography variant="h5" sx={{ mb: 2, color: 'black', fontWeight: '20px' }}>
                Results ({EventListBackup.length})
            </Typography>

            <Grid container spacing={3}>
                {EventListBackup.map((data) => (
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
                                <Typography variant="h6" sx={{ mb: 2, fontSize: '20px' }}>
                                    <b> {data.Event_Name}</b>
                                </Typography>
                                <Typography
                                    sx={{ color: 'text.secondary', mt: -1, fontSize: '18px' }}
                                >
                                    Uplay: <b>&nbsp;${data.Event_Fee_Uplay}</b><br />
                                    NTUC: <b>${data.Event_Fee_NTUC}</b>
                                </Typography>
                                <Box sx={{ flexGrow: 1 }}></Box>

                                <Link to={`/Event/getEvent/${data.Event_ID}`}>
                                    <Button className="add_btn"
                                        sx={{
                                            fontSize: '16px',
                                            padding: '1px',
                                            width: '100%',
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
                                        <b>See Detail</b>
                                    </Button>
                                </Link>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
         
        </Box>

    )
};
export default EventClientSide;
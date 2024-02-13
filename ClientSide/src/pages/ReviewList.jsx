import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , TextField, Dialog, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem
} from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';

function ReviewList() {
    const { user } = useContext(UserContext);
    const [ list, setlist ] = useState([]);
    const [ user1, setUser ] = useState(null);
    useEffect(() => {


        if (localStorage.getItem("accessToken")) {
            http.get('/UplayUser/auth').then((res) => {
                setUser(res.data.user);
            });
        }
        console.log(user.userId)
        getReview();
    }, []);
    const getReview = () => {
        http.get(`/Event/getuserreview/${user.userId}`).then((res) => {
            setlist(res.data);
            console.log(res.data);
        });
    };

    return (
        <Box Box maxWidth="100%">
            <Typography
                align="center"
                variant="h4"
                fontWeight="bold"
                color="#E8533F"  >Your reviews
            </Typography>

            {list.length > 0 ? (
                <Box width="100%" overflow="auto">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                    <TableCell style={{ width: '10%', textAlign: 'center' }}>Review Id</TableCell>
                                    <TableCell style={{ width: '30%', textAlign: 'center' }}>Review Contents</TableCell>
                                    <TableCell style={{ width: '10%', textAlign: 'center' }}>Rating</TableCell>
                                    <TableCell style={{ width: '10%', textAlign: 'center' }}>Event Id</TableCell>
                                    <TableCell style={{ width: '20%', textAlign: 'center' }}>Event Name</TableCell>
                                    <TableCell style={{ width: '40%', textAlign: 'center' }}>Event Image</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((review, index) => (
                                <TableRow key={review.review_ID} >
                                    <TableCell style={{ width: '10%', textAlign: 'center', height: '100px' }}>{review.review_ID}</TableCell>
                                    <TableCell style={{ width: '30%', textAlign: 'center', height: '100px' }}>{review.event_Review}</TableCell>
                                    <TableCell style={{ width: '10%', textAlign: 'center', height: '100px' }}>{review.rating}</TableCell>
                                    <TableCell style={{ width: '10%', textAlign: 'center', height: '100px' }}>{review.event_ID}</TableCell>
                                    <TableCell style={{ width: '20%', textAlign: 'center', height: '100px' }}>{review.event_Name}</TableCell>
                                    <TableCell style={{ width: '40%' }}>
                                        <img
                                            alt="data"
                                            src={`${import.meta.env.VITE_FILE_BASE_URL}${review.imagefile}`}
                                            style={{
                                                width: '80%', height: '80%', objectFit: 'cover', borderRadius: '10px'
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </Box>
            ) : (
                <Typography align="center">No data available.</Typography>
            )}

        </Box>




    );



}
export default ReviewList;
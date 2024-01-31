import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , TextField, Dialog, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';



function UserList() {

    const [userList, setuserList] = useState([]);
    const [userstatusList, setuserstatusList] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get('/UplayUser/auth');
                console.log(response.data.user);

                try {
                    if (response.data.user.emailAddress === "admin@gmail.com") {
                        const response1 = await http.get('/UplayUser');
                        console.log(response1.data);
                        const filteredUserList = response1.data.filter(user => user.emailAddress !== "admin@gmail.com");
                        await setuserList(filteredUserList);

                        try {
                            const promises = filteredUserList.map(async (user) => {
                                try {
                                    const respose = await http.get(`/Member/${user.userId}`);
                                    if (respose.data.memberStatus == null) {
                                    return "Guest"}
                                    return respose.data.memberStatus;
                                    
                                   
                                } catch (error) {
                                    return "Guest";
                                }
                            });

                            const mylist = await Promise.all(promises);
                            console.log("mylist:"+mylist)
                            setuserstatusList(mylist);
                            console.log(userstatusList);
                        } catch (error) {
                            console.error('Error fetching user status:', error);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching userlist:', error);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        if (localStorage.getItem('accessToken')) {
            fetchUser();
        }

    }, []);

    useEffect(() => {
        // This block will run when userList is updated
        console.log('userList updated:', userList);
    }, [userList]);
    return (

        <Box>
            <Typography
                align="center"
                variant="h4"
                fontWeight="bold"
                color="#E8533F"  >
                User List</Typography>
            <TableContainer>
                <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                        User Id
                        </TableCell>
                        <TableCell>
                            User Email
                        </TableCell>
                        <TableCell>
                        User Name
                        </TableCell>
                        <TableCell>
                        User Type
                        </TableCell>

                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user, index) => (
                            <TableRow key={user.userId}>
                                <TableCell>{user.userId}</TableCell>
                                <TableCell>{user.emailAddress}</TableCell>
                                <TableCell>{user.userName}</TableCell>
                                <TableCell>{ userstatusList[index]}</TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>


                </Table>
            </TableContainer>




        </Box>

    )


}
export default UserList
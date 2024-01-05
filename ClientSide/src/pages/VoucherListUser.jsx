import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import UserContext from '../contexts/UserContext';
import global from '../global';
import VoucherList from './VoucherList';

function VoucherListUser() {
    const [VoucherList, setVoucher] = useState([]);
    const [search, setSearch] = useState('');

    // user id to get their voucher information
    const { user } = useContext(UserContext);


    const getVoucherUser = () => {
        http.get('/tutorial').then((res) => {
            setVoucher(res.data);
        });
    };


}
export default VoucherList;
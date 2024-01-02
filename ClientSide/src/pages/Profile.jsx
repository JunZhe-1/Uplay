import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';
import http from '../http';

function Profiles() {
    const [profileList, setProfileList] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get('/UplayUser/auth');
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (localStorage.getItem('accessToken')) {
            fetchUser();
        }
    }, []);

    useEffect(() => {
        if (user) {
            const getProfile = async () => {
                try {
                    const response = await http.get(`/UplayUser/${user.userId}`);
                    setProfileList(response.data);
                    console.log(response.data);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };

            getProfile();
        }
    }, [user]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box key={profileList.userId} marginBottom={4} marginTop={4}>
                    <Card>
                        <CardContent>
                     
                            <Typography variant="h6" style={{ fontSize: '23px' }}>
                                User Name:
                            </Typography>
                            <Typography variant="body1">{profileList.userName}</Typography>
                            <Typography variant="h6" style={{ fontSize: '23px', marginTop: '35px' }}>
                                Email Address:
                            </Typography>
                            <Typography variant="body1" style={{marginBottom: '35px' }}>{profileList.emailAddress}</Typography>
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                            />
                            <Button variant="contained" color="primary">
                                Update details
                            </Button>


                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );

}

export default Profiles;

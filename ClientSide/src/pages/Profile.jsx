import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';
import http from '../http';

function Profiles() {
    const [profileList, setProfileList] = useState([]);
    const [user, setUser] = useState(null);
    const [memberstatus, setmemberstatus] = useState(false);

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
            const getMemberStatus = async () => {
                try {
                    const response1 = await http.get(`/Member/${user.userId}`)
                    if (response1.headers['content-length'] == 0) {
                        setmemberstatus("Non-Member")

                    }
                    else {
                        console.log(response1)
                        setmemberstatus(response1.data.memberStatus)

                    }

                } catch (error) {
                    console.error('Error fetching memberstatus:', error);
                }


            };

            getProfile();
            getMemberStatus();
        }
    }, [user]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Box key={profileList.userId} marginBottom={4} marginTop={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" style={{ fontSize: '23px' }}>
                                Member Type:
                            </Typography>
                            <Typography variant="h6" style={{  marginBottom: '35px' }}>
                                {memberstatus}
                            </Typography>
                            <Typography variant="h6" style={{ fontSize: '23px' }}>
                                User Name:
                            </Typography>
                            <TextField
                                variant="outlined"
                                value={profileList.userName}
                                fullWidth
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <Typography variant="h6" style={{ fontSize: '23px', marginTop: '35px' }}>
                                Email Address:
                            </Typography>
                            <TextField
                                variant="outlined"
                                value={profileList.emailAddress}
                                fullWidth
                                onChange={(e) => setEmailAddress(e.target.value)}
                            />
                            <Typography variant="h6" style={{ fontSize: '23px', marginTop: '50px' }}>
                                Change Password:
                            </Typography>
                            <TextField
                                label="New Password"
                                type="password"
                                fullWidth
                                margin="normal"
                            />

                            <Button variant="contained" color="primary" style={{ marginTop: '35px' }}>
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

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    TextField, Button, Box, Typography, Grid, Card, CardContent, Input, IconButton,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , Dialog, InputLabel, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem
} from '@mui/material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';

import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function Profiles() {
    const [profileList, setProfileList] = useState([]);
    const { user } = useContext(UserContext);

    console.log(user);
    const [user1, setUser1] = useState(null);

    const [getedit, setedit] = useState(true);

    console.log(user1, user, 'testing');

    const [memberstatus, setmemberstatus] = useState(false);
    const [membername, setmembername] = useState(null);
    const [membernric, setmembernric] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get('/UplayUser/auth');
                setUser1(response.data.user);

            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (localStorage.getItem('accessToken')) {
            fetchUser();
        }
    }, []);

    console.log(profileList.userName);

    const formik = useFormik({
        initialValues: {
            userName: "",
            emailAddress: "",
            // password: "",
            // oldpassword:""

        },
        validationSchema: yup.object({
            userName: yup.string().trim()
                .min(1, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required'),
            emailAddress: yup.string().trim()
                .email('Enter a valid email')
                .max(50, 'Email must be at most 50 characters')
                .required('Email is required'),
            // oldpassword: yup.string().trim()
            //     .min(8, 'Password must be at least 8 characters')
            //     .max(250, 'Password must be at most 50 characters')
            //     .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,"At least 1 letter and 1 number"),
            // password: yup.string().trim()
            //     .min(8, 'Password must be at least 8 characters')
            //     .max(250, 'Password must be at most 50 characters')
            //     .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,"At least 1 letter and 1 number")

        }),
        onSubmit: async (data) => {

            data.userName = data.userName.trim();
            data.emailAddress = data.emailAddress.trim().toLowerCase();
            if (imageFile) {
                data.imageFile = imageFile
            }

            console.log(data)
            http.put(`/UplayUser/${user1.userId}`, data)
                .then((res) => {
                    console.log(res.data);
                    alert("Profile updated successfully")
                    navigate("/");
                })
                .catch((error) => {
                    console.error('Error updating user details:', error);
                });
        }
    });



    console.log('Formik Values:', formik.values);


    useEffect(() => {
        if (user) {
            const getProfile = async () => {
                try {
                    const response = await http.get(`/UplayUser/${user.userId}`);
                    setProfileList(response.data);
                    console.log(response.data);
                    formik.setValues({
                        userName: response.data.userName,
                        emailAddress: response.data.emailAddress
                    });
                    setImageFile(response.data.imageFile);

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
                        setmembername(response1.data.name)
                        setmembernric(response1.data.nric)
                        console.log("name" + membername)

                    }

                } catch (error) {
                    console.error('Error fetching memberstatus:', error);
                }


            };

            getProfile();
            getMemberStatus();

        }
    }, [user1]);
    const handleNavigate = () => {
        navigate("/buymember");
    };


    const changeedit = (j) => {
        setedit(!j);

    }



    console.log(formik);


    const [imageFile, setImageFile] = useState(null);
    


    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);

            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {




                    setImageFile(res.data.filename);
                    const imageFileName = res.data.filename;

                    console.log(imageFileName);
                    http.put(`/UplayUser/image/${user.userId}`, imageFileName, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    })
                        .then((res) => {
                            console.log(res.data, "Update successful");
                        })
                        .catch(function (err) {
                            if (err.response && err.response.status === 400 && err.response.data.errors) {
                                console.log("Validation errors:");
                                for (const field in err.response.data.errors) {
                                    if (err.response.data.errors.hasOwnProperty(field)) {
                                        console.log(`${field}: ${err.response.data.errors[field]}`);
                                    }
                                }
                            } else {
                                console.log("Error:", err.response ? err.response.data : err.message);
                            }
                        });


                    http.put(`/UplayUser/image/${user.userId}`, imageFile, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then((res) => {
                        console.log(res.data, "hodhvuisvjoivhisuhdhushduvh");
                    })
                        .catch(function (err) {

                            if (err.response && err.response.status === 400 && err.response.data.errors) {
                                console.log("Validation errors:");
                                for (const field in err.response.data.errors) {
                                    if (err.response.data.errors.hasOwnProperty(field)) {
                                        console.log(`${field}: ${err.response.data.errors[field]}`);
                                    }
                                }
                            } else {
                                console.log("Error:", err.response ? err.response.data : err.message);
                            }

                        })

                })
                .catch(function (error) {
                    console.log(error);
                    console.log(`${error.response.data.message}`);

                });
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '0vh', position: 'relative', left: '-10px' }}>
                <Box sx={{ padding: '29px' }}>
                    <Box style={{ width: '7%', marginTop: '2vh', marginLeft: '-13.5vh', cursor: 'pointer', position: 'relative' }}>
                        <form onSubmit={formik.handleSubmit}>
                            <Button
                                variant="contained"
                                component="label"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '70%',
                                }}
                            >
                                <input
                                    hidden
                                    accept="image/*"
                                    multiple
                                    type="file"
                                    onChange={onFileChange}
                                    style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0 }}
                                />
                                {imageFile != null ? (<img
                                    alt="data"
                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                    style={{
                                        width: '100%',
                                        height: '10.5vh',
                                        objectFit: 'cover',
                                        borderRadius: '70%',
                                    }}
                                />) : <img
                                    alt="data"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${"account.jpg"}`}
                                    style={{
                                        width: '100%',
                                        height: '10.5vh',
                                        objectFit: 'cover',
                                        borderRadius: '70%',
                                    }}
                                />}

                            </Button>
                        </form>
                    </Box>

     <Typography sx={{ fontSize: '20px', marginLeft: '-2vh', fontWeight: 'bold', marginTop: '-6vh' }}>
    {user.userName}
  </Typography>
  </Box>
  <Typography sx={{  marginLeft: '2vh',marginTop:'1vh' ,color:'#f4511e', fontWeight:'bold'}}>Your Profile</Typography>

                <Typography onClick={() => navigate('/password_current')}
                    sx={{
                        cursor: 'pointer',
                        marginLeft: '2vh',
                        marginTop: '3vh',
                        transition: 'color 0.2s, font-weight 0.2s',

                        '&:hover': {
                            color: '#f4511e',
                            fontWeight: 'bold',

                        },
                    }}

                >
                    Change Password
                </Typography>
                <Typography
                    sx={{
                        cursor: 'pointer',
                        marginLeft: '2vh',
                        marginTop: '3vh',
                        transition: 'color 0.2s, font-weight 0.2s',

                        '&:hover': {
                            color: '#f4511e',
                            fontWeight: 'bold',

                        },
                    }}>Booking History</Typography>
            </Box>

            <Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative', marginTop: '-30vh', marginLeft: '35vh' }}>
                    <Typography style={{ fontSize: '28px', color: '#f4511e', fontWeight: 'bold' }}>
                        Edit Profile
                    </Typography>
                    <div style={{ border: '1px solid grey', width: '110vh', marginTop: '2.5vh' }}></div>

                    {memberstatus === "NTUC" || memberstatus === "Uplay" ? (
                        <>
                            <Typography style={{ marginTop: '5vh', fontSize: '24px', color: '#f4511e', marginLeft: '1vh', fontWeight: 'bold' }}>
                                {memberstatus} Member
                            </Typography>
                            <Typography style={{ marginTop: '1vh', marginLeft: '5vh' }}>
                                <p><b style={{ fontSize: '18px' }}>Name: &nbsp;</b> <span style={{ fontSize: '15px' }}>{membername.toUpperCase()}</span></p>
                            </Typography>
                            <Typography style={{ marginTop: '-3vh', marginLeft: '5vh' }}>
                                <p><b style={{ fontSize: '18px' }}>NRIC: &nbsp;</b> <span style={{ fontSize: '15px' }}>*******{membernric}</span></p>
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="h6" style={{ marginTop: '3vh', fontSize: '18px', marginLeft: '1vh' }}>
                                <p>Not a member or friends of Uplay yet? Click here to beome <span ><Link to="/Event/EventClientSide" style={{ color: '#f4511e', fontWeight: 'bold' }}>Friends Of Uplay</Link> or <Link Link to="/memberpurchase" style={{ color: 'blue', fontWeight: 'bold' }}>NTUC Member</Link></span></p>
                        </Typography>
                    )}


                    <Typography variant="h6" style={{ fontSize: '24px', display: 'flex', color: '#f4511e', fontWeight: 'bold', marginTop: '6vh', marginLeft: '1vh' }}>
                        My Profile
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>

                        <Box onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>

                            <Box sx={{ marginTop: '5vh', display: 'flex', alignItems: 'center' }}  >
                                <Box sx={{ marginRight: '1rem' }}>
                                    <InputLabel sx={{ color: 'black' }}><b > Name:</b></InputLabel>
                                </Box>

                                {user.emailAddress.toLowerCase() === "admin@gmail.com" ? (

                                    <TextField
                                        fullWidth
                                        label=""
                                        name="userName"
                                        value={formik.values.userName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                                        helperText={formik.touched.userName && formik.errors.userName}
                                        InputLabelProps={{ shrink: Boolean(formik.values.userName) || formik.values.userName === '' }}
                                        disabled={true}
                                        style={{ width: '40%' }}
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        label=""
                                        name="userName"
                                        value={formik.values.userName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.userName && Boolean(formik.errors.userName)}
                                        helperText={formik.touched.userName && formik.errors.userName}
                                        style={{ width: '40%' }}
                                        disabled={getedit}
                                        InputLabelProps={{ shrink: Boolean(formik.values.userName) || formik.values.userName === '' }}
                                    />
                                )}


                            </Box>


                            <Box sx={{ marginTop: '5vh', display: 'flex', alignItems: 'center' }}  >
                                <Box sx={{ marginRight: '1rem' }}>
                                    <InputLabel sx={{ color: 'black' }}><b > Email:</b></InputLabel>
                                </Box>

                                {user.emailAddress.toLowerCase() === "admin@gmail.com" ? (

                                    <TextField
                                        fullWidth
                                        label=""
                                        name="emailAddress"
                                        value={formik.values.emailAddress}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
                                        helperText={formik.touched.emailAddress && formik.errors.emailAddress}
                                        InputLabelProps={{ shrink: Boolean(formik.values.emailAddress) || formik.values.emailAddress === '' }}
                                        disabled={true}
                                        style={{ width: '40%' }}
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        label=""
                                        name="emailAddress"
                                        value={formik.values.emailAddress}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
                                        helperText={formik.touched.emailAddress && formik.errors.emailAddress}
                                        style={{ width: '40%' }}
                                        disabled={getedit}
                                        InputLabelProps={{ shrink: Boolean(formik.values.emailAddress) || formik.values.emailAddress === '' }}
                                    />
                                )}


                            </Box>


                            {getedit === true ? (
                                <Box sx={{ mt: 2, display: 'flex', padding: '30px', marginLeft: '20vh' }}>
                                    <Button variant="contained" sx={{
                                        width: '40%',
                                        height: '6vh',
                                        borderRadius: '10px',
                                        alignItems: 'center',
                                        fontSize: '20px',
                                        border: '1px solid #f4511e',
                                        background: 'white',
                                        color: '#f4511e',
                                        fontWeight: 'bold',
                                        transition: 'background 0.3s',
                                        '&:hover': {
                                            background: '#f4511e',
                                            color: 'white',
                                        },
                                    }} onClick={(e) => {
                                        e.preventDefault();
                                        changeedit(getedit);
                                    }}>
                                        Edit
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx={{ mt: 2, display: 'flex', padding: '30px', marginLeft: '20vh' }}>
                                    <Button variant="contained" type="submit" sx={{
                                        width: '40%',
                                        height: '6vh',
                                        borderRadius: '10px',
                                        alignItems: 'center',
                                        fontSize: '20px',
                                        border: '1px solid #f4511e',
                                        background: 'white',
                                        color: '#f4511e',
                                        fontWeight: 'bold',
                                        transition: 'background 0.3s',
                                        '&:hover': {
                                            background: '#f4511e',
                                            color: 'white',
                                        },
                                    }}>
                                        Save
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </form>
                </Box>
            </Box>
            <ToastContainer />

        </Box>



        // <Grid container spacing={2} justifyContent="center">

        //             <Grid item xs={6}>

        //             <Link sx={{ marginLeft: '-20px' }}>Change Password</Link>

        //             <Typography variant="h6" style={{ fontSize: '25px', color:'red',fontWeight:'bold' }}>
        //                                 Edit Profile

        //                             </Typography>


        //             <Typography variant="h6" style={{ marginTop:'4vh',fontSize: '20px' , color:'red', fontWeight:'bold'}}>
        //                                 {memberstatus} Member

        //                             </Typography>

        //                 <Box component="form" marginBottom={0} marginTop={4} onSubmit={formik.handleSubmit}>
        //                     <Card>
        //                         <CardContent>
        //                             <Typography variant="h6" style={{ fontSize: '23px' }}>
        //                                 {memberstatus} Member

        //                             </Typography>

        //                             <Typography variant="h6" style={{ fontSize: '23px' }}>
        //                                 User Name:
        //                             </Typography>
        //                             {user && (
        //                                 <>
        //                             {user.emailAddress.toLowerCase() === "admin@gmail.com" ? (
        //                                 <TextField
        //                                     fullWidth
        //                                     label=""
        //                                     name="userName"
        //                                     value={formik.values.userName}
        //                                     onChange={formik.handleChange}
        //                                     onBlur={formik.handleBlur}
        //                                     error={formik.touched.userName && Boolean(formik.errors.userName)}
        //                                     helperText={formik.touched.userName && formik.errors.userName}
        //                                     InputLabelProps={{ shrink: Boolean(formik.values.userName) || formik.values.userName === '' }}
        //                                     style={{ marginBottom: '10px' }}
        //                                     disabled={true}
        //                                 />) : <TextField
        //                                 fullWidth
        //                                 label=""
        //                                 name="userName"
        //                                 value={formik.values.userName}
        //                                 onChange={formik.handleChange}
        //                                 onBlur={formik.handleBlur}
        //                                 error={formik.touched.userName && Boolean(formik.errors.userName)}
        //                                 helperText={formik.touched.userName && formik.errors.userName}
        //                                 InputLabelProps={{ shrink: Boolean(formik.values.userName) || formik.values.userName === '' }}
        //                                 style={{ marginBottom: '10px' }} // Adjust spacing here
        //                                     />}
        //                                 </>
        //                             )}

        //                             <Typography variant="h6" style={{ fontSize: '23px', marginTop: '20px' }}>
        //                                 Email Address:
        //                             </Typography>

        //                             {user && (
        //                                 <>
        //                             {user.emailAddress.toLowerCase() === "admin@gmail.com" ? (
        //                             <TextField
        //                                 fullWidth
        //                                 margin="dense"
        //                                 autoComplete="off"
        //                                 label=""
        //                                 name="emailAddress"
        //                                 value={formik.values.emailAddress}
        //                                 onChange={formik.handleChange}
        //                                 onBlur={formik.handleBlur}
        //                                 error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
        //                                 helperText={formik.touched.emailAddress && formik.errors.emailAddress}
        //                                 InputLabelProps={{ shrink: Boolean(formik.values.emailAddress) || formik.values.emailAddress === '' }}
        //                                 style={{ marginBottom: '10px' }} // Adjust spacing here
        //                                 disabled={true}
        //                             />):<TextField
        //                                 fullWidth
        //                                 margin="dense"
        //                                 autoComplete="off"
        //                                 label=""
        //                                 name="emailAddress"
        //                                 value={formik.values.emailAddress}
        //                                 onChange={formik.handleChange}
        //                                 onBlur={formik.handleBlur}
        //                                 error={formik.touched.emailAddress && Boolean(formik.errors.emailAddress)}
        //                                 helperText={formik.touched.emailAddress && formik.errors.emailAddress}
        //                                 InputLabelProps={{ shrink: Boolean(formik.values.emailAddress) || formik.values.emailAddress === '' }}
        //                                 style={{ marginBottom: '10px' }} // Adjust spacing here
        //                             />


        //                             }
        //                                 </>
        //                             )}
        //                             <Typography variant="h6" style={{ fontSize: '23px', marginTop: '20px' }}>
        //                                 Change Password:
        //                             </Typography>
        //                             <TextField
        //                                 label="Old password"
        //                                 margin="normal"
        //                                 fullWidth
        //                                 margin="dense"
        //                                 autoComplete="off"
        //                                 name="oldpassword"
        //                                 type="password"
        //                                 value={formik.values.oldpassword}
        //                                 onChange={formik.handleChange}
        //                                 onBlur={formik.handleBlur}
        //                                 error={formik.touched.oldpassword && Boolean(formik.errors.oldpassword)}
        //                                 helperText={formik.touched.oldpassword && formik.errors.oldpassword}
        //                                 InputLabelProps={{ style: { marginTop: '5px' } }} // Adjust marginTop here
        //                                 style={{ marginBottom: '10px' }} // Adjust spacing here
        //                             />
        //                             <TextField
        //                                 label="New Password"
        //                                 margin="normal"
        //                                 fullWidth
        //                                 margin="dense"
        //                                 autoComplete="off"
        //                                 name="password"
        //                                 type="password"
        //                                 value={formik.values.password}
        //                                 onChange={formik.handleChange}
        //                                 onBlur={formik.handleBlur}
        //                                 error={formik.touched.password && Boolean(formik.errors.password)}
        //                                 helperText={formik.touched.password && formik.errors.password}
        //                                 InputLabelProps={{ style: { marginTop: '5px' } }} // Adjust marginTop here
        //                                 style={{ marginBottom: '10px' }} // Adjust spacing here
        //                             />

        //                             <Button variant="contained" color="primary" style={{ marginTop: '20px' }} type="submit">
        //                                 Update details
        //                             </Button>

        //                             {/* Conditionally render "Become a Member" button */}
        //                             {user?.emailAddress.toLowerCase() !== "admin@gmail.com" &&memberstatus !== "NTUC" &&(


        //                                 <Button
        //                                     variant="contained"
        //                                     color="primary"
        //                                     style={{ marginTop: '20px', marginLeft: '20px' }}
        //                                     onClick={handleNavigate}
        //                                 >
        //                                     Become a Member
        //                                     </Button>


        //                             )}
        //                             {user?.emailAddress.toLowerCase() !== "admin@gmail.com" && memberstatus == "NTUC" && (


        //                                 <Button
        //                                     variant="contained"
        //                                     color="primary"
        //                                     style={{ marginTop: '20px', marginLeft: '20px' }}
        //                                     onClick={handleNavigate}
        //                                 >
        //                                     Check your member profile
        //                                 </Button>


        //                             )}
        //                         </CardContent>
        //                     </Card>
        //                 </Box>
        //             </Grid>
        //         </Grid>
    );

}

export default Profiles;
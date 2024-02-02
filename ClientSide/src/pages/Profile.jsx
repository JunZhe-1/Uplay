import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {    Drawer, List, ListItem, ListItemIcon, ListItemText,
    TextField, Button, Box, Typography, Grid, Card, CardContent, Input, IconButton,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , Dialog, InputLabel, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem } from '@mui/material';
import http from '../http';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useFormik } from 'formik';
import * as yup from 'yup';
import UserContext from '../contexts/UserContext';

function Profiles() {
    const [profileList, setProfileList] = useState([]);
    const [user, setUser1] = useState(null);

    const [memberstatus, setmemberstatus] = useState(false);
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

    const formik = useFormik({
        initialValues: {
            userName: profileList.userName,
            emailAddress: profileList.emailAddress,
            password: "",
            oldpassword:""


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
            oldpassword: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(250, 'Password must be at most 50 characters')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,"At least 1 letter and 1 number"),
            password: yup.string().trim()
                .min(8, 'Password must be at least 8 characters')
                .max(250, 'Password must be at most 50 characters')
                .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,"At least 1 letter and 1 number")

        }),
        onSubmit: async (data) => {

            data.userName = data.userName.trim();
            data.emailAddress = data.emailAddress.trim().toLowerCase();

            if (data.password != "" && data.oldpassword != "") {
                try {
                    const response = await http.post('/UplayUser/validatePassword', {
                        userId: user.userId,
                        oldPassword: data.oldpassword
                    });

                    // Validation successful, proceed to update the password
                    const newPassword = data.password.trim();
                    data.password = newPassword;

                } catch (error) {
                    // Old password validation failed
                    console.error('Error validating old password:', error);
                    formik.setErrors({ oldpassword: "Invalid old password." });
                    return;
                }

            }
            
            console.log(data)
            http.put(`/UplayUser/${user.userId}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/");
                })
                .catch((error) => {
                    console.error('Error updating user details:', error);
                });
        }
    });

    useEffect(() => {

        if (user) {
            const getProfile = async () => {
                try {
                    const response = await http.get(`/UplayUser/${user.userId}`);
                    setProfileList(response.data);
                    console.log(response.data);
                    formik.setValues({
                        userName: response.data.userName,
                        emailAddress: response.data.emailAddress,
                        password: ""
                    });
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
    const handleNavigate = () => {
        navigate("/buymember");
    };


    return (
<Box>
  <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '0vh', position: 'relative', left: '-10px' }}>
    <Box sx={{padding:'29px'}}>
  <Box style={{ width: '6%', marginTop: '2vh',marginLeft:'-13.5vh' }}>
                                                <img
                                                    alt="data"
                                                    src={`/image/dp/${Math.floor(Math.random() * 7) + 1}.png`}
                                                    style={{
                                                        width: '100%',
                                                        height: '9vh',
                                                        objectFit: 'cover',
                                                        borderRadius: '70%'
                                                    }}
                                                />
                                            </Box>
     <Typography sx={{ fontSize: '20px', marginLeft: '-3vh', fontWeight: 'bold', marginTop: '-7vh' }}>
    lucas lau jia yuan bib
  </Typography>
  </Box>

     <Typography sx={{cursor:'pointer',  marginLeft: '2vh' }}>Change Password</Typography>
    <Typography sx={{ marginLeft: '2vh',cursor:'pointer' ,marginTop:'2vh'}}>Booking History</Typography>
  </Box>

  <Box sx={{ display: 'flex', flexDirection: 'column', position: 'relative', marginTop: '-20vh', marginLeft: '35vh' }}>
    <Typography variant="h6" style={{ fontSize: '30px', color: '#f4511e', fontWeight: 'bold' }}>
      Edit Profile
    </Typography>
    <div style={{ border: '1px solid grey', width: '110vh', marginTop: '2.5vh' }}></div>

    {memberstatus === "NTUC" || memberstatus === "Uplay" ? (
      <>
        <Typography variant="h6" style={{ marginTop: '5vh', fontSize: '20px', color: '#f4511e', marginLeft: '1vh', fontWeight: 'bold' }}>
          {memberstatus} Member
        </Typography>
        <Typography style={{ marginTop: '1vh', marginLeft: '5vh' }}>
          <p><b style={{ fontSize: '18px' }}>Name: &nbsp;</b> <span style={{ fontSize: '15px' }}>Lucas</span></p>
        </Typography>
        <Typography style={{ marginTop: '-3vh', marginLeft: '5vh' }}>
          <p><b style={{ fontSize: '18px' }}>NRIC: &nbsp;</b> <span style={{ fontSize: '15px' }}>414J</span></p>
        </Typography>
      </>
    ) : (
      <Typography variant="h6" style={{ marginTop: '3vh', fontSize: '18px', marginLeft: '1vh' }}>
        <p>Not a member yet? Click here to join <span ><Link style={{ color: '#f4511e', fontWeight: 'bold' }}>Uplay</Link> or <Link style={{ color: 'blue', fontWeight: 'bold' }}>NTUC</Link></span></p>
      </Typography>
    )}
  </Box>
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
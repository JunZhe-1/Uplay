import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {    Drawer, List, ListItem, ListItemIcon, ListItemText,
    TextField, Button, Box, Typography, Grid, Card, CardContent, Input, IconButton,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , Dialog, InputLabel, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem } from '@mui/material';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';

import Cancel from '@mui/icons-material/Cancel';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import UserContext from '../contexts/UserContext';
  
function MemberPurchase()
{
const [user, setUser] = useState(null);
    const [defaultName, setDefaultName] = useState("");
    const [defaultNRIC, setDefaultNRIC] = useState("");
    const [defaultMemberStatus, setDefaultMemberStatus] = useState("");
    const [defaultDateOfBirth, setDefaultDateOfBirth] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
    const navigate = useNavigate();

    const [userselect, setuserselect] = useState(null);

    const userselect_member = (selected_member) =>{
      setuserselect(selected_member);
    }

    


    const formik = useFormik({
        initialValues: {
            name: '',
            nric: '',
            dateofbirth: '',
            memberStatus: '',
            years : 1,

            
        },
        validationSchema: yup.object({
            name: yup.string().trim()
                .min(1, 'Name must be at least 3 characters')
                .max(50, 'Name must be at most 50 characters')
                .required('Name is required'),
            nric: yup.string().trim()
                .matches(/^\d{3}[a-zA-Z]$/, 'Invalid NRIC format')
                .required('NRIC is required'),
            dateofbirth: yup.date().required('Date of Birth is required'),



        }),

        onSubmit: (data) => {
            // Move the form submission logic here
            data.name = data.name;
            data.nric = data.nric;
            data.memberStatus = "NTUC"
            data.dateofbirth = data.dateofbirth
            localStorage.removeItem("name")
            localStorage.setItem("name", data.name);
            localStorage.removeItem("nric")
            localStorage.setItem("nric", data.nric);
            localStorage.removeItem("dob")
            localStorage.setItem("dob", data.dateofbirth)   
            if (userselect == "Basic") {
                data.years = 1
            }
            else if (userselect == "Standard") {
                data.years = 2
            }
            else if (userselect == "Premium") {
            data.years = 3}
            http.post("/Member", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/profile");
                    localStorage.removeItem("memberStatus")
                    localStorage.setItem("memberStatus", "NTUC")
                });
        }
    });


    


return (
   
<Box > 
           

                 

{userselect === null ?(

    <Box >
    <Typography variant="h5" sx={{ my: 2, textAlign:"center" , fontWeight:'bold'}} >
                     Purchase Membership
                </Typography>
        <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh', // Adjust the height as needed
      }}>
        
       <Table>
        <TableRow>

        <TableCell>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          
        //   border:'2px solid red'
        }}
      >
        <Box sx={{border:'black solid 1px',padding:'0 0 0px 0', cursor:'pointer'}} onClick={() => userselect_member("Basic")} >
        <Box
          width={0}
          height={0}
          borderTop={50}
          borderRight={0}
          borderBottom={40}
          borderLeft={300}
          borderColor="#f4511e transparent transparent #f4511e" // Adjust the color as needed
        />
        <Box >
            <Typography sx={{fontSize:'25px', color:'white', fontWeight:'bold', marginTop:'-10vh', textAlign:'center'}}> 1 Years Member</Typography>
       
        </Box>
        <Box sx={{marginTop:'8vh'}}>
        <Typography sx={{textAlign:'center', marginTop:'-2vh'}}> <span style={{fontSize:'40px', fontWeight:'bold'}}>$117</span><b> for 12 months</b> </Typography>


            <Typography sx={{fontSize:'16px', padding:'5px', marginTop:'3vh'}}>Uplay Promotion :  &nbsp; <b>YES</b>  <CheckCircleRounded sx={{color:'#f4511e', marginBottom:'-5px'}}/> </Typography>
            <Typography sx={{fontSize:'16px', padding:'5px'}}>Special Voucher :  &nbsp; <b>YES</b>  <CheckCircleRounded sx={{color:'#f4511e', marginBottom:'-5px'}}/></Typography>
            <Typography sx={{fontSize:'16px', padding:'5px'}}>Uplay Points : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>No</b>  <Cancel sx={{color:'#f4511e', marginBottom:'-5px'}}/></Typography>

            <Typography sx={{fontSize:'16px', padding:'5px', marginBottom:'5vh'}}></Typography>
            <Typography sx={{fontSize:'20px', padding:'10px' ,background:'#f4511e',color:'white', marginTop:'0vh', textAlign:'center'}}> <b>Select</b>  </Typography>

        </Box>
        </Box>
      </Box>
    </TableCell>




      
        <TableCell>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          
        //   border:'2px solid red'
        }}
      >
        <Box sx={{border:'black solid 1px',padding:'0 0 0px 0', cursor:'pointer'}} onClick={() => userselect_member("Standard")}>
        <Box
          width={0}
          height={0}
          borderTop={50}
          borderRight={0}
          borderBottom={40}
          borderLeft={300}
          borderColor="#f4511e transparent transparent #f4511e" // Adjust the color as needed
        />
        <Box >
                                            <Typography sx={{ fontSize: '25px', color: 'white', fontWeight: 'bold', marginTop: '-10vh', textAlign: 'center' }}> 2 Years Member</Typography>
       
        </Box>
        <Box sx={{marginTop:'8vh'}}>
        <Typography sx={{textAlign:'center', marginTop:'-2vh'}}> <span style={{fontSize:'40px', fontWeight:'bold'}}>$234</span><b> for 24 months</b> </Typography>


            <Typography sx={{fontSize:'16px', padding:'5px', marginTop:'3vh'}}>Uplay Promotion :  &nbsp; <b>YES</b>  <CheckCircleRounded sx={{color:'#f4511e', marginBottom:'-5px'}}/> </Typography>
            <Typography sx={{fontSize:'16px', padding:'5px'}}>Special Voucher :  &nbsp; <b>YES</b>  <CheckCircleRounded sx={{color:'#f4511e', marginBottom:'-5px'}}/></Typography>
            <Typography sx={{fontSize:'16px', padding:'5px'}}>Uplay Points : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Yes</b>  <CheckCircleRounded sx={{color:'#f4511e', marginBottom:'-5px'}}/></Typography>

            <Typography sx={{fontSize:'16px', padding:'5px', marginBottom:'5vh'}}></Typography>
            <Typography sx={{fontSize:'20px', padding:'10px' ,background:'#f4511e',color:'white', marginTop:'0vh', textAlign:'center'}}> <b>Select</b>  </Typography>

        </Box>
        </Box>
      </Box>
    </TableCell>


         
    <TableCell>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          
        //   border:'2px solid red'
        }}
      >
        <Box sx={{border:'black solid 1px',padding:'0 0 0px 0', cursor:'pointer'}} onClick={() => userselect_member("Premium")}>
        <Box
          width={0}
          height={0}
          borderTop={50}
          borderRight={0}
          borderBottom={40}
          borderLeft={300}
          borderColor="#f4511e transparent transparent #f4511e" // Adjust the color as needed
        />
        <Box >
                                            <Typography sx={{ fontSize: '25px', color: 'white', fontWeight: 'bold', marginTop: '-10vh', textAlign: 'center' }}> 3 Years Member</Typography>
       
        </Box>
        <Box sx={{marginTop:'8vh'}}>
        <Typography sx={{textAlign:'center', marginTop:'-2vh'}}> <span style={{fontSize:'40px', fontWeight:'bold'}}>$351</span><b> for 36 months</b> </Typography>


            <Typography sx={{fontSize:'16px', padding:'5px', marginTop:'3vh'}}>Uplay Promotion :  &nbsp; <b>YES</b>  <CheckCircleRounded sx={{color:'#f4511e', marginBottom:'-5px'}}/> </Typography>
            <Typography sx={{fontSize:'16px', padding:'5px'}}>Special Voucher :  &nbsp; <b>YES</b>  <CheckCircleRounded sx={{color:'#f4511e', marginBottom:'-5px'}}/></Typography>
            <Typography sx={{fontSize:'16px', padding:'5px'}}>Uplay Points : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Yes</b>  <CheckCircleRounded sx={{color:'#f4511e', marginBottom:'-5px'}}/></Typography>

            <Typography sx={{fontSize:'16px', padding:'5px', marginBottom:'5vh'}}></Typography>
            <Typography sx={{fontSize:'20px', padding:'10px' ,background:'#f4511e',color:'white', marginTop:'0vh', textAlign:'center'}}> <b>Select</b>  </Typography>

        </Box>
        </Box>
      </Box>
    </TableCell>
</TableRow>
        
        
</Table>
        </Box>

            </Box>):(
            



            <Typography> <Box  sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '75vh',
            position: 'relative',
        }} >
            <Box sx={{ width: '62vh', marginTop: '15vh', padding: '17vh 16vh 10vh 16vh', border: '1px solid black', background: '#FCFCFC', borderRadius: '10px' }}>
                <form onSubmit={formik.handleSubmit}>
                    <Typography sx={{ marginLeft: '-15vh', marginTop: '-15vh' , cursor:'pointer'}} onClick={() => setuserselect(null)} ><ArrowBackIcon /></Typography>

                    <Typography sx={{ my: 2, color: 'black', fontWeight: '600', textAlign: 'center', fontSize: '28px', padding: '0 0 2vh 0' }}>{userselect} Plan</Typography>
                  
                  
                    <Box sx={{ marginTop: '1vh', display: 'flex', alignItems: 'center' , marginLeft:'2vh'}}  >
  <Box sx={{ marginRight: '1rem' }}>
    <InputLabel sx={{color:'black'}}><b > Name:</b></InputLabel>
  </Box>

                    <TextField
                        fullWidth
                        label="Name"
                        margin="normal"
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        style={{ width: '79%' }}
                        />
                    
                    </Box>
                    

                    <Box sx={{ marginTop: '1vh', display: 'flex', alignItems: 'center' , marginLeft:'-9.5vh'}}  >
  <Box sx={{ marginRight: '1rem' }}>
    <InputLabel sx={{color:'black'}}><b > NRIC last 4 digit:</b></InputLabel>
  </Box>

                    <TextField
                        fullWidth
                        label="NRIC"
                        margin="normal"
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        name="nric"
                        value={formik.values.nric}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.nric && Boolean(formik.errors.nric)}
                        helperText={formik.touched.nric && formik.errors.nric}
                        style={{ width: '67%' }}
                        />
                    
                    </Box>



                    <Box sx={{ marginTop: '1vh', display: 'flex', alignItems: 'center' , marginLeft:'-6vh'}}  >
  <Box sx={{ marginRight: '1rem' }}>
    <InputLabel sx={{color:'black'}}><b > Date Of Birth:</b></InputLabel>
  </Box>

                    <TextField
                        fullWidth
                        margin="dense"
                        autoComplete="off"
                        label="Date of Birth"
                        type="date"
                        name="dateofbirth"
                        value={formik.values.dateofbirth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.dateofbirth && Boolean(formik.errors.dateofbirth)}
                        helperText={formik.touched.dateofbirth && formik.errors.dateofbirth}
                        InputLabelProps={{ shrink: true }}
                        style={{ width: '70%' }}
                        />
                    
                    </Box>
                    

   {/* {GetError === false ? (
                        <Typography sx={{ color: 'red' }}>{ErrorMsg}</Typography>
                    ) : (
                        <Typography sx={{ visibility: 'hidden' }}>Correct Password</Typography>
                    )} */}
                 <Typography sx={{marginLeft:'10vh', marginTop:'1vh',visibility: 'hidden' }}>Correct Password</Typography>
                 <Typography sx={{marginLeft:'10vh',visibility: 'hidden' }}>Correct Password</Typography>

                  <Box sx={{ mt: 2, padding: '2vh 0 0vh 0', minHeight: '2rem' }}>
                  <Button
                        variant="contained"
                        type="submit"
                        sx={{
                          width: '100%',
                          padding: '8px',
                          fontSize: '15px',
                          background: '#f4511e',
                          marginBottom:'0vh',
                          '&:hover': {
                          color:'white',
                          background:'#c2380f'
                          },
                        }}> CONFIRM</Button>

</Box>


              
                </form>
            </Box>
        </Box></Typography>)}

</Box>
);
}
 export default MemberPurchase;

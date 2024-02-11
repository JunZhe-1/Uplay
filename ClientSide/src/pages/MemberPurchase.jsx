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
            dob: '',
            memberStatus: '',
            
        },
        validationSchema: yup.object({
            years: yup.number().oneOf([1, 2, 3], 'Please select a valid number of years').required('Years is required'),
        }),
        onSubmit: (data) => {
            // Move the form submission logic here
            data.name = defaultName;
            data.nric = defaultNRIC;
            data.memberStatus = defaultMemberStatus
            data.dob = defaultDateOfBirth
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
        <Box sx={{border:'black solid 1px',padding:'0 0 0px 0', cursor:'pointer'}} onClick={() => userselect_member("basic")} >
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
            <Typography sx={{fontSize:'25px', color:'white', fontWeight:'bold', marginTop:'-10vh', textAlign:'center'}}> Basic</Typography>
       
        </Box>
        <Box sx={{marginTop:'8vh'}}>
        <Typography sx={{textAlign:'center', marginTop:'-2vh'}}> <span style={{fontSize:'40px', fontWeight:'bold'}}>$3.0</span><b> /12mo</b> </Typography>


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
            <Typography sx={{fontSize:'25px', color:'white', fontWeight:'bold', marginTop:'-10vh', textAlign:'center'}}> Standard</Typography>
       
        </Box>
        <Box sx={{marginTop:'8vh'}}>
        <Typography sx={{textAlign:'center', marginTop:'-2vh'}}> <span style={{fontSize:'40px', fontWeight:'bold'}}>$9.6</span><b>/ 24mo</b> </Typography>


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
            <Typography sx={{fontSize:'25px', color:'white', fontWeight:'bold', marginTop:'-10vh', textAlign:'center'}}> Premium</Typography>
       
        </Box>
        <Box sx={{marginTop:'8vh'}}>
        <Typography sx={{textAlign:'center', marginTop:'-2vh'}}> <span style={{fontSize:'40px', fontWeight:'bold'}}>$16.9</span><b>/ 36mo</b> </Typography>


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
                    

                    <Box sx={{ marginTop: '1vh', display: 'flex', alignItems: 'center' , marginLeft:'3vh'}}  >
  <Box sx={{ marginRight: '1rem' }}>
    <InputLabel sx={{color:'black'}}><b > NRIC:</b></InputLabel>
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
                        style={{ width: '80%' }}
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
                        name="dob"
                        value={formik.values.dob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.dob && Boolean(formik.errors.dob)}
                        helperText={formik.touched.dob && formik.errors.dob}
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

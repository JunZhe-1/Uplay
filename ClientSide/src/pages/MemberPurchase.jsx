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
            http.post("/Member", data, 2)
                .then((res) => {
                    console.log(res.data);
                    navigate("/profile");
                    localStorage.removeItem("memberStatus")
                    localStorage.setItem("memberStatus", "NTUC")
                });
        }
    });


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get('/UplayUser/auth');
                setUser(response.data.user);
                setDefaultName(localStorage.getItem("name"));
                setDefaultNRIC(localStorage.getItem("nric"));
                setDefaultMemberStatus(localStorage.getItem("memstate"));
                setDefaultDateOfBirth(localStorage.getItem("dob"));
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (localStorage.getItem('accessToken')) {
            fetchUser();
        }
    }, []);
    

return (
   
<Box > 
           

                  <Typography variant="h5" sx={{ my: 2, textAlign:"center" }} >
                     Purchase Membership
                </Typography>
    <Box >

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
        <Box sx={{border:'black solid 1px',padding:'0 0 0px 0', cursor:'pointer'}}>
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
        <Box sx={{border:'black solid 1px',padding:'0 0 0px 0', cursor:'pointer'}}>
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
        <Box sx={{border:'black solid 1px',padding:'0 0 0px 0', cursor:'pointer'}}>
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



       
        </Box>
      
</Box>
);
}
 export default MemberPurchase;

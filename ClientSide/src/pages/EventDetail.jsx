import React, { useEffect, useState, useContext } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Input, IconButton, Button,
    Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell
    , TextField, Dialog, InputLabel, TablePagination, DialogTitle, DialogContent, DialogContentText, DialogActions, Select, MenuItem
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../contexts/UserContext';
import Rating from 'react-rating-stars-component';
import { ContactSupport } from '@mui/icons-material';

function EventDetail() {
    const { id } = useParams();
    const [reviewSuccess, setReviewSuccess] = useState(null);
    const [imageFile, setimageFile] = useState(null);
    const { user } = useContext(UserContext);
    console.log(user);
    const [sequence, setsequence] = useState("htl");
    const [showMessage, setShowMessage] = useState(true);

    const [EventDetail, setEvent] = useState({
        Event_ID: "",
        Event_Name: "",
        Event_Description: "",
        Event_Location: "",
        Event_Category: "Sports & Wellness",
        Event_Fee_Guest: 0,
        Event_Fee_Uplay: 0,
        Event_Fee_NTUC: 0,
        Vacancies: 0,
        User_ID: user.userId
    });
console.log(localStorage["memberStatus"]);


useEffect(() => {
  let timeoutId;

  if (reviewSuccess) {
    timeoutId = setTimeout(() => {
      setReviewSuccess(false);
    }, 3000);
  }

  return () => {
    clearTimeout(timeoutId);
  };
}, [reviewSuccess]);

    useEffect(() => {


      if (localStorage.getItem("accessToken")) {
        http.get('/UplayUser/auth').then((res) => {
            setUser(res.data.user);
      });
    }
        http.get(`/Event/getEvent/${id}`).then((res) => {
            setimageFile(res.data.imageFile);
            console.log(res.data);
            setEvent(res.data);
        });
        getReview();
    }, []);

    useEffect(() => {
      // Set a timeout to hide the message after 3 seconds
      const timeoutId = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
  
      // Cleanup the timeout to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }, []); 


    const getReview = () => {
        http.get(`/Event/getreview/${id}`).then((res) => {
            setreview(res.data);
            console.log(res.data);  
        });
    };

    const formik = useFormik({
        initialValues: {
            Event_Review: "",
            Rating: 0,
            User_ID: user.userId,
            Event_ID: EventDetail.Event_ID,
            Sort: "htl"
        },
        validationSchema: yup.object({
            Event_Review: yup.string().trim()
                .min(3, 'Event review must be at least 3 characters')
                .max(500, 'Event review must be below 50 characters for user conciseness.'),
            Rating: yup.number()
                .min(1, 'Rating cannot be below 1')
                .max(5, 'Rating cannot be above 5')
                .required('Rating is required'),
            Sort: yup.string().required('order is required')

        }),
        onSubmit: (event) => {
            console.log(user.userId, EventDetail.Event_ID);
            event.Event_Review = event.Event_Review.trim();
            event.Rating = parseInt(event.Rating);
            event.User_ID = user.userId;
            event.Event_ID = EventDetail.Event_ID;
            console.log(sequence);
            console.log(event);
            http.post("Event/review", event)
                .then((res) => {
                  console.log("enter")
                    setReviewSuccess(true);
                    getReview();
                    formik.setFieldValue('Event_Review', '');
                    formik.setFieldValue('Rating', 0);




                })
                .catch(function (err) {
                    toast.error(`${err.response.data.message}`);
                    console.log(err.response.data.message);
                })
        }
    });


    const columns = [
        //{ id: 'Name', label: 'No', minWidth: 15 },
        { id: 'name', label: 'User', minWidth: 2 }, // Update id to 'name'
        { id: 'rating', label: 'Rating', minWidth: 2 },
        { id: 'eventReview', label: 'Event Review', minWidth: 15 },
        { id: 'userProfile', label: 'Profile', },

    ];

    const imgno = () => {
        return Math.floor(Math.random() * 7) + 1;
    };

    const [randomImgNo, setRandomImgNo] = useState(imgno()); // Initialize with the initial random value



    const [reviewData, setreview] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    function createData(rating, eventReview, name, userProfile) {
        return { rating, eventReview, name ,userProfile};
    }

    const rows = reviewData.map((item) => {
        const Rating = (item.rating).toString();
        const Event_Review = item.event_Review;
        const User = item.name;
        const userProfile = item.userProfile;
console.log(userProfile);
        return createData(Rating, Event_Review, User, userProfile);
    });
    let sortedRows = rows; // Create a copy of the original rows to avoid mutating the state directly

    switch (formik.values.Sort) {
        case "htl":
        case "htl": // Highest to Lowest rating
            for (let i = 0; i < sortedRows.length - 1; i++) {
                for (let j = 0; j < sortedRows.length - i - 1; j++) {
                    if (sortedRows[j].rating < sortedRows[j + 1].rating) {
                        let temp = sortedRows[j];
                        sortedRows[j] = sortedRows[j + 1];
                        sortedRows[j + 1] = temp;
                    }
                }
            }
            
            break;
        case "lth":
            for (let i = 0; i < sortedRows.length - 1; i++) {
                for (let j = 0; j < sortedRows.length - i - 1; j++) {
                    if (sortedRows[j].rating > sortedRows[j + 1].rating) {
                        let temp = sortedRows[j];
                        sortedRows[j] = sortedRows[j + 1];
                        sortedRows[j + 1] = temp;
                    }
                }
            }
            break;
        case "nto":
            // No sorting needed as we are displaying reviews in the order they were fetched
            sortedRows.reverse()
            break;
        default:
            break;
    }



    const handleChangePage = (event, newPage) => {
        setPage(newPage);

    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          border: 0,
          marginTop: "3vh",
          padding: "0 0 10vh 0",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <TableContainer sx={{ maxHeight: "100%", border: 0 }}>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {EventDetail.Event_Name.toUpperCase()}
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} sx={{ width: "200vh" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "60vh",
                    }}
                  >
                    <img
                      alt="Event"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                      style={{
                        width: "90%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  </Box>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    maxWidth: "100%",
                    width: "65%",
                    padding: "30px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "29px",
                    }}
                  >
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {EventDetail.Event_Description}
                  </Typography>
                </TableCell>

                <TableCell rowSpan={2} sx={{ borderLeft: "1px #E0E0E0 solid" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      padding: "12px",
                      color: "#F9F6EE",
                      fontWeight: "bold",
                      textAlign: "center",
                      borderRadius: "8px 8px 0px 0px",
                      background: "#E6533F",
                    }}
                  >
                    Event Price
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0 20px",
                    }}
                  >

{localStorage["memberStatus"].toUpperCase() === "UPLAY" ? (
  <>
    <TableCell
      sx={{
        borderRight: "solid 1px #E0E0E0",
        textAlign: "center",
        padding: "5px 30px 5px 30px",
        marginLeft: "-2vh",
      }}
    >
      <Typography>
        Guest <br /> $ {EventDetail.Event_Fee_Guest}{" "}
      </Typography>
    </TableCell>
    <TableCell
      sx={{ textAlign: "center", padding: "5px 30px 5px 30px" }}
    >
      <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: '#E6533F' }}>
        Uplay <br />$ {EventDetail.Event_Fee_Uplay}
      </Typography>
    </TableCell>
    <TableCell
      sx={{
        borderLeft: "solid 1px #E0E0E0",
        textAlign: "center",
        padding: "5px 30px 5px 30px",
        marginRight: "-2vh",
      }}
    >
      <Typography sx={{}}>
        NTUC <br /> $ {EventDetail.Event_Fee_NTUC}
      </Typography>
    </TableCell>
  </>
) : localStorage["memberStatus"].toUpperCase() === "GUEST" ? (
  <>
    <TableCell
      sx={{
        borderRight: "solid 1px #E0E0E0",
        textAlign: "center",
        padding: "5px 30px 5px 30px",
        marginLeft: "-2vh",
      }}
    >
      <Typography>
        Uplay <br />$ {EventDetail.Event_Fee_Uplay}
      </Typography>
    </TableCell>
    <TableCell
      sx={{ textAlign: "center", padding: "5px 30px 5px 30px" }}
    >
      <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: '#E6533F' }}>
        Guest <br /> $ {EventDetail.Event_Fee_Guest}{" "}
      </Typography>
    </TableCell>
    <TableCell
      sx={{
        borderLeft: "solid 1px #E0E0E0",
        textAlign: "center",
        padding: "5px 30px 5px 30px",
        marginRight: "-2vh",
      }}
    >
      <Typography sx={{}}>
        NTUC <br /> $ {EventDetail.Event_Fee_NTUC}
      </Typography>
    </TableCell>
  </>
) : (
  <>
    <TableCell
      sx={{
        borderRight: "solid 1px #E0E0E0",
        textAlign: "center",
        padding: "5px 30px 5px 30px",
        marginLeft: "-2vh",
      }}
    >
      <Typography>
        Guest <br /> $ {EventDetail.Event_Fee_Guest}{" "}
      </Typography>
    </TableCell>
    <TableCell
      sx={{ textAlign: "center", padding: "5px 30px 5px 30px" }}
    >
      <Typography sx={{ fontWeight: 'bold', fontSize: '20px', color: '#E6533F' }}>
        NTUC <br /> $ {EventDetail.Event_Fee_NTUC}
      </Typography>
    </TableCell>
    <TableCell
      sx={{
        borderLeft: "solid 1px #E0E0E0",
        textAlign: "center",
        padding: "5px 30px 5px 30px",
        marginRight: "-2vh",
      }}
    >
      <Typography sx={{}}>
        Uplay <br />$ {EventDetail.Event_Fee_Uplay}
      </Typography>
    </TableCell>
  </>
)}

                  
                  </Box>
                  <br />
                  <Link sx={{textDecoration:"none"}}   className="custom-link"
 to={"/Cart/adduser" }state = {{event_ID: EventDetail.Event_ID, userId: user.userId}}>
                    <Typography
                      variant="h5"
                      sx={{ textDecoration:"none",
                        cursor:
                          new Date(EventDetail.Event_Launching_Date) >
                          new Date()
                            ? "auto"
                            : "pointer",
                        fontSize: "18px",
                        padding: "8px",
                        textAlign: "center",
                        borderRadius: "5px",
                        transition: "background 0.3s ease",
                        color:
                          new Date(EventDetail.Event_Launching_Date) >
                          new Date()
                            ? "grey"
                            : "#F9F6EE",
                        background:
                          new Date(EventDetail.Event_Launching_Date) >
                          new Date()
                            ? "lightgrey"
                            : "#E6533F",
                        "&:hover": {
                          background:
                            new Date(EventDetail.Event_Launching_Date) >
                            new Date()
                              ? "lightgrey"
                              : "#FF8C5E",
                        },
                      }}
                    >
                      Book Now
                    </Typography>
                  </Link>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    maxWidth: "100%",
                    width: "65%",
                    padding: "30px",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "29px",
                    }}
                  >
                    Location
                  </Typography>
                  <Typography variant="body1">
                    {EventDetail.Event_Location}
                  </Typography>
                  <br />
                  <br />
                </TableCell>
              </TableRow>
            </TableBody>

            <TableBody>
              <TableRow>
                <TableCell>
                  <Typography
                    variant="h4"
                    style={{ color: "#E6533F", marginTop: "3vh" }}
                  >
                    <br />
                    <b>Event Review</b>
                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Typography variant="h7">
                    <br />
                    <b>Write Your Review</b>
                    &nbsp;
                { reviewSuccess && (
  <span
    style={{
      color: "green",
      fontWeight: "bold",
      fontSize: "20px",
    }}
  >
    <br /> Event Review Submitted Successfully!
  </span>
)}

                  </Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Rating
                    count={5}
                    onChange={(Rating) =>
                      formik.setFieldValue("Rating", Rating)
                    }
                    value={formik.values.Rating}
                    size={36}
                    style={{ color: "#FF5733", activeColor: "yellow" }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={1} lg={25}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        margin="dense"
                        autoComplete="off"
                        label="Event Review"
                        name="Event_Review"
                        value={formik.values.Event_Review}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={Boolean(
                          formik.touched.Event_Review &&
                            formik.errors.Event_Review
                        )}
                        helperText={
                          formik.touched.Event_Review &&
                          formik.errors.Event_Review
                        }
                      />
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Box sx={{ mt: 5, marginTop: "-2vh" }}>
                    <Button variant="contained" type="submit">
                      Share Your Review
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </TableContainer>


<br />
<Box ><Typography variant='h4' style={{ color: "#E6533F", marginTop: "3vh", fontWeight:'bold' }}>User Reviews</Typography>
<Box sx={{textAlign:"right", marginTop:'-6vh'}}> <Select
                      name="Sort"
                      value={formik.values.Sort}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Sort && Boolean(formik.errors.Sort)}
                      style={{ marginBottom: "10px", marginLeft: "auto" }}
                      onChange={(event) => {
                            formik.handleChange(event);
                            setsequence(event.target.value); // Update sequence state
                          console.log(event.target.value)
                        }}
                    >
                      <MenuItem value={"htl"}>
                        Highest rating to Lowest
                      </MenuItem>
                      <MenuItem value={"lth"}>
                        Lowest rating to highest
                      </MenuItem>
                      <MenuItem value={"nto"}>Newest to Oldest</MenuItem>
                    </Select></Box></Box>


          <TableContainer style={{ height: "800px", marginTop: "9vh" }}>
            <Table stickyHeader aria-label="sticky table">
              {/* <TableHead>
                <TableRow>
                  <TableCell><Typography variant='h4' style={{ color: "#E6533F", marginTop: "3vh", fontWeight:'bold' }}>User Reviews</Typography></TableCell>
                  <TableCell style={{ textAlign: "right" }}>

                    <Select
                      name="Sort"
                      value={formik.values.Sort}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.Sort && Boolean(formik.errors.Sort)}
                      style={{ marginBottom: "10px", marginLeft: "auto" }}
                    >
                      <MenuItem value={"htl"}>
                        Highest rating to Lowest
                      </MenuItem>
                      <MenuItem value={"lth"}>
                        Lowest rating to highest
                      </MenuItem>
                      <MenuItem value={"nto"}>Newest to Oldest</MenuItem>
                    </Select>
                  </TableCell>
                </TableRow>
              </TableHead> */}
              <TableBody>
                {sortedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.no}>
                      <TableCell colSpan={3} sx={{ backgroundColor: row["name"] === user.userName ? '#f0f0f0' : 'inherit' }}>
                      <Box style={{ width: "5%", marginTop: "0vh" }}>
          {row["userProfile"] !==  null ? (
            <img
              alt="data"
              src={`${import.meta.env.VITE_FILE_BASE_URL}${row["userProfile"]}`}
              style={{
                width: "100%",
                height: "7.2vh",
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
          ) : (
            <img
              alt="data"
              src={`/image/user.png`}
              style={{
                width: "100%",
                height: "7.2vh",
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
          )}
        </Box>

                        <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                          {row["name"]}
                        </span>
                        <br />
                              <Rating
                                  key={row["rating"]} 
                              value={parseFloat(row["rating"])}
                              readOnly
                              size={20}
                              precision={1}
                              edit={false}
                              /> 

                        <br />
                        <span style={{ fontSize: "16px" }}>
                          {row["eventReview"]}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </form>
        <ToastContainer />
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
}

export default EventDetail;
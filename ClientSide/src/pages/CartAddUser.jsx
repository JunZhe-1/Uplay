import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";
import da from "date-fns/locale/da";

function CartAddUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const [imageFile, setimageFile] = useState(null);
  const { user } = useContext(UserContext);
  const { event_ID } = location.state;

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
    User_ID: user.userId,
  });

  useEffect(() => {
    http.get(`/Event/getEvent/${event_ID}`).then((res) => {
      setimageFile(res.data.imageFile);
      console.log(res.data);
      setEvent(res.data);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      Booking_Date: "",
      Booking_Quantity: 1,
      Event_ID: event_ID || 0,
    },
    validationSchema: yup.object({
      Booking_Date: yup.date().required("Booking date is required"),
      Booking_Quantity: yup
        .number()
        .min(0, "Booking Quantity cannot be below 0")
        .max(10, "Booking Quantity cannot be above 10")
        .required("Booking Quantity is required"),
      Event_ID: yup
        .number()
        .min(0, "Event ID cannot be below 0")
        .max(1000, "Event ID cannot be above 1000")
        .required("Event ID is required"),
    }),

    onSubmit: (data) => {
      data.Booking_Quantity = parseInt(data.Booking_Quantity);
      data.Event_ID = parseInt(data.Event_ID);
      console.log("onsubmit:", data);

      http
        .post("/Cart/add", data)
        .then((res) => {
          console.log("Success");
          toast.success("Cart added successfully");
          navigate("/Cart/getuser/:id");
        })
        .catch(function (err) {
          console.log(err.response.data);
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  console.log(formik);

  return (
    <Box>
      <Typography variant="h3" align="center" sx={{ my: 1 }}>
        Add {EventDetail.Event_Name.toUpperCase()} to Cart
      </Typography>
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
            height: "80%",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </Box>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <Grid container spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={formik.values.Booking_Date}
                  onChange={(date) =>
                    formik.setFieldValue("Booking_Date", date)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="dense"
                      autoComplete="off"
                      label="Booking Date"
                      name="Booking_Date"
                      error={Boolean(
                        formik.touched.Booking_Date &&
                          formik.errors.Booking_Date
                      )}
                      helperText={
                        formik.touched.Booking_Date &&
                        formik.errors.Booking_Date
                      }
                    />
                  )}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Booking Quantity"
                name="Booking_Quantity"
                value={formik.values.Booking_Quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                error={Boolean(
                  formik.touched.Booking_Quantity &&
                    formik.errors.Booking_Quantity
                )}
                helperText={
                  formik.touched.Booking_Quantity &&
                  formik.errors.Booking_Quantity
                }
              />

              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Event ID"
                name="Event_ID"
                value={formik.values.Event_ID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="hidden"
                sx={{ display: "none" }}
                error={Boolean(
                  formik.touched.Event_ID && formik.errors.Event_ID
                )}
                helperText={formik.touched.Event_ID && formik.errors.Event_ID}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }}>
          <Button variant="contained" type="submit" style={{ width: "100%", background: "#E8533F" }} >
            Add to Cart
          </Button>
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
}
export default CartAddUser;

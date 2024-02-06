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
import { useParams, useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";

function CartEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);

  const [cartinfo, setCart] = useState({
    Booking_Date: new Date(),
    Booking_Quantity: 0,
    UserId: 0,
    Event_ID: 0,
  });

  useEffect(() => {
    http
      .get(`/Cart/get/${id}`)
      .then((res) => {
        console.log(res.data);
         const bookingDate = new Date(res.data.Booking_Date.replace(" ", "T"));
        setCart({
          Booking_Date: bookingDate,
          Booking_Quantity: res.data.Booking_Quantity,
          UserId: res.data.userId,
          Event_ID: res.data.event_ID,
        });
      })
      .catch(function (err) {
        toast.error(`${err.response.data.message}`);
      });
  }, []);

  const formik = useFormik({
    initialValues: cartinfo,
    enableReinitialize: true,

    validationSchema: yup.object({
      Booking_Date: yup.date().required("Booking date is required"),
      Booking_Quantity: yup
        .number()
        .min(0, "Booking Quantity cannot be below 0")
        .max(10, "Booking Quantity cannot be above 10")
        .required("Booking Quantity is required"),
      UserId: yup
        .number()
        .min(0, "User ID cannot be below than 0")
        .max(1000, "User ID cannot be above 1000"),
      Event_ID: yup
        .number()
        .min(0, "Event ID cannot be below 0")
        .max(1000, "Event ID cannot be above 1000")
        .required("Event ID is required"),
    }),
    onSubmit: (data) => {
      data.Booking_Quantity = parseInt(data.Booking_Quantity);
      data.UserId = parseInt(data.UserId);
      data.Event_ID = parseInt(data.Event_ID);

      console.log("onsubmit:", data);
      http
        .put(`/Cart/update/${id}`, data)
        .then((res) => {
          console.log(res.data);
          navigate("/Cart");
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  console.log(formik);

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Cart
      </Typography>
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
                label="User ID"
                name="UserId"
                value={formik.values.UserId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                error={Boolean(
                  formik.touched.UserId && formik.errors.UserId
                )}
                helperText={formik.touched.UserId && formik.errors.UserId}
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
                type="number"
                error={Boolean(
                  formik.touched.Event_ID && formik.errors.Event_ID
                )}
                helperText={formik.touched.Event_ID && formik.errors.Event_ID}
              />

            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }}>
          <Button variant="contained" type="submit" style={{ width: "100%" }}>
            Update
          </Button>
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
}
export default CartEdit;

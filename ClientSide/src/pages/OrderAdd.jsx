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
import { useNavigate } from "react-router-dom";
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

function OrderAdd() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      UserId: 1,
      Booking_Date: "",
      Booking_Quantity: 1,
      Event_ID: 0,
      Price: 0,
    },
    validationSchema: yup.object({
      UserId: yup
        .number()
        .min(0, "UserId cannot be below 0")
        .max(100000, "UserId cannot be above 100000")
        .required("UserId is required"),
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
      Price: yup
        .number()
        .min(0, "Price cannot be below 0")
        .max(100000, "Price cannot be above 1000")
        .required("Price is required"),
    }),

    onSubmit: (data) => {
      data.UserId = parseInt(data.UserId);
      data.Booking_Quantity = parseInt(data.Booking_Quantity);
      data.Event_ID = parseInt(data.Event_ID);
      data.Price = parseInt(data.Price);
      console.log("onsubmit:", data);

      http
        .post("/Order/add", data)
        .then((res) => {
          console.log("Success");
          toast.success("Order added successfully");
          navigate("/Order");
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
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Cart
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <Grid container spacing={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TextField
                  fullWidth
                  margin="dense"
                  autoComplete="off"
                  label="UserId"
                  name="UserId"
                  value={formik.values.UserId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  type="number"
                  error={Boolean(formik.touched.UserId && formik.errors.UserId)}
                  helperText={formik.touched.UserId && formik.errors.UserId}
                />
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
                type="number"
                error={Boolean(
                  formik.touched.Event_ID && formik.errors.Event_ID
                )}
                helperText={formik.touched.Event_ID && formik.errors.Event_ID}
              />

              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Price"
                name="Price"
                value={formik.values.Price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="number"
                error={Boolean(formik.touched.Price && formik.errors.Price)}
                helperText={formik.touched.Price && formik.errors.Price}
              />
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }}>
          <Button
            variant="contained"
            type="submit"
            style={{ backgroundColor: "#1e4bf4", width: "100%" }}
          >
            Add
          </Button>
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
}
export default OrderAdd;

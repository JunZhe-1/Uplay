import React, { useEffect, useState, useContext } from "react";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { Cancel } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import UserContext from "../contexts/UserContext";
import http from "../http";
import global from "../global";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E8533F", // Orange
    },
    secondary: {
      main: "#0096ff", // Blue
    },
  },
});

const PaymentConfirmation = () => {

  return (
    <ThemeProvider theme={theme}>
      <br />
      <Box textAlign="center" mt={10}>
        <Cancel
          sx={{ color: "red", fontSize: "76px", marginBottom: "16px" }}
        />
        <Typography variant="h4" gutterBottom>
          Booking cancelled
        </Typography>
        <Typography variant="body1">Your booking purchase has failed</Typography>
        <Box mt={4}>
          <Button
            component={Link}
            to="/Cart/getcart/:id"
            variant="contained"
            color="primary"
          >
            Continue
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default PaymentConfirmation;

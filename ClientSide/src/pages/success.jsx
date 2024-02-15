import React, { useEffect, useState, useContext } from "react";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
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

//     const { user } = useContext(UserContext);

//     useEffect(() => {
//         getCartList();
//         try {
//             for (const item of CartList) {
//                 http.delete(`/Cart/removeitem/${item.Cart_ID}`).then((res) => {
//                     console.log("Cart item deleted successfully");
//                 });
//             }
//         } catch (error) {
//       console.error("Error adding orders:", error);
//     }
//     }, []);
//   const getCartList = () => {
//     http.get(`/Cart/getcart/${user.userId}`).then((res) => {
//       const cartItems = res.data;
//       console.log(res.data);
//       Promise.all(
//         cartItems.map((item) =>
//           http.get(`/Event/getEvent/${item.event_ID}`).then((eventRes) => ({
//             ...item,
//             eventName: eventRes.data.Event_Name,
//             eventImage: eventRes.data.imageFile,
//             eventFee: eventRes.data.Event_Fee_Guest,
//             eventuplayFee: eventRes.data.Event_Fee_Uplay,
//             eventntucFee: eventRes.data.Event_Fee_NTUC,
//           }))
//         )
//       )
//         .then((updatedCartItems) => {
//           setCartList(updatedCartItems);
//         })
//         .catch((err) => {
//           toast.error(`${err.response.data.message}`);
//         });
//     });
//   };
  
  

  return (
    <ThemeProvider theme={theme}>
      <br />
      <Box textAlign="center" mt={10}>
        <CheckCircle
          sx={{ color: "green", fontSize: "76px", marginBottom: "16px" }}
        />
        <Typography variant="h4" gutterBottom>
          Booking completed successfully
        </Typography>
        <Typography variant="body1">Thank you for your purchase.</Typography>
        <Box mt={4}>
          <Button
            component={Link}
            to="/Order/getorder/:id"
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

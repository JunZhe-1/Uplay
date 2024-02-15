import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Input,
  IconButton,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import {
  AccountCircle,
  AccessTime,
  Search,
  Settings,
  Clear,
  Visibility,
  Edit,
  Delete,
  Block,
} from "@mui/icons-material";
import axios from "axios";
import http from "../http";
import dayjs from "dayjs";
import global from "../global";
import UserContext from "../contexts/UserContext";
import Pagination from "@mui/material/Pagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CheckCircle } from "@mui/icons-material";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";


// Create a custom theme
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

function CartUser() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [CartList, setCartList] = useState([]);
  const [cart_id, setid] = useState("");
  const { user } = useContext(UserContext);
  const [memberstatus, setMemberStatus] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const discount = searchParams.get("discount");

  useEffect(() => {
    http
      .get(`/Member/${user.userId}`)
      .then((memberRes) => {
        const memberstatus = memberRes.data.memberStatus;
        setMemberStatus(memberstatus);
        console.log(memberRes.data.memberStatus);
      })
      .catch((error) => {
        console.error("Error fetching member status:", error);
      });

    getCartList();
  }, []);



  const getCartList = () => {
    http.get(`/Cart/getcart/${user.userId}`).then((res) => {
      const cartItems = res.data;
      console.log(res.data);
      Promise.all(
        cartItems.map(
          (item) =>
            http.get(`/Event/getEvent/${item.event_ID}`).then((eventRes) => ({
              ...item,
              eventName: eventRes.data.Event_Name,
              eventImage: eventRes.data.imageFile,
              eventFee: eventRes.data.Event_Fee_Guest,
              eventuplayFee: eventRes.data.Event_Fee_Uplay,
              eventntucFee: eventRes.data.Event_Fee_NTUC,
            })),
        )
      )
        .then((updatedCartItems) => {
          setCartList(updatedCartItems);
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    });
  };

  const [open, setOpen] = useState(false);

  const handleOpen = (id) => {
    setOpen(true);
    setid(id);
    console.log("id: " + id);
    console.log("cart: " + cart_id);
  };

  const handleClose = () => {
    setOpen(false);
    setid(null);
  };

  const deleteCart = (id) => {
    http.delete(`/Cart/removeitem/${id}`).then((res) => {
      setOpen(false);
      getCartList();
    });
  };


  const handleCheckout = async () => {
    setOpenDialog(true);
    http
      .post("/Cart/checkout")
      .then((res) => {
        console.log("Success");
        window.location.href = res.data.redirectUrl
      })
      .catch(function (err) {
        console.log(err.response.data);
        toast.error(`${err.response.data.message}`);
      });
    try {
      for (const item of CartList) {
        const order = {
          Booking_Date: item.Booking_Date,
          Booking_Quantity: item.Booking_Quantity,
          Price: memberstatus === "NTUC" ? item.eventntucFee : item.eventFee,
          Event_ID: item.event_ID,
          UserId: item.userId,
        };

        const res = await http.post("/Order/add", order);
        http.delete(`/Cart/removeitem/${item.Cart_ID}`).then((res) => {
          setOpen(false);
          console.log("Cart item deleted successfully");
        });
        console.log("Order added successfully:", res.data);
      }
      console.log("All orders added successfully");
    } catch (error) {
      console.error("Error adding orders:", error);
    }
  };

const handleCloseDialog = () => {
  setOpenDialog(false);
  // navigate("/Order/getorder/:id");
};



  // const handleCheckout = async () => {
  //   const LineItems = CartList.map((item) => {
  //     return {
  //       price_data: {
  //         currency: "usd",
  //         product_data: {
  //           name: item.eventName,
  //         },
  //         unit_amount: item.eventFee * 100, // Convert to cents
  //       },
  //       quantity: item.Booking_Quantity,
  //     };
  //   });

    // http
    //   .post("/Cart/checkout", LineItems)
    //   .then((res) => {
    //     console.log("Success");
    //   })
    //   .catch(function (err) {
    //     console.log(err.response.data);
    //     toast.error(`${err.response.data.message}`);
    //   });
  // };

  // Pagination
  const itemsPerPage = 5;
  const [page, setPage] = React.useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPrice = CartList.reduce((total, item) => {
    return (
      total +
      (memberstatus === "NTUC"
        ? item.eventntucFee * item.Booking_Quantity
        : item.eventFee * item.Booking_Quantity)
    );
  }, 0);

  const totalPriceAfterDiscount =
    totalPrice - (discount ? parseFloat(discount) : 0);

  const Discount = discount ? parseFloat(discount) : 0;

  return (
    <ThemeProvider theme={theme}>
      <br />

      <Box>
        <Typography
          variant="h5"
          sx={{ my: 2, color: "black", fontWeight: "bold" }}
        >
          Your Cart
        </Typography>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>Booking Quantity</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {CartList.slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt))
                  .map((data, index) => (
                    <TableRow key={index + (page - 1) * itemsPerPage}>
                      <TableCell>
                        {index + 1 + (page - 1) * itemsPerPage}
                      </TableCell>
                      <TableCell>
                        {data.eventImage && (
                          <img
                            src={`${import.meta.env.VITE_FILE_BASE_URL}${
                              data.eventImage
                            }`}
                            alt="Event"
                            style={{ width: 50, height: 50 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{data.eventName}</TableCell>
                      <TableCell>
                        {dayjs
                          .utc(data.Booking_Date)
                          .format(global.datetimeFormat)}
                      </TableCell>
                      <TableCell>{data.Booking_Quantity}</TableCell>
                      <TableCell>
                        $
                        {memberstatus === "NTUC"
                          ? (data.eventntucFee * data.Booking_Quantity).toFixed(
                              2
                            )
                          : (data.eventFee * data.Booking_Quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Link to={`/Cart/updatecart/${data.Cart_ID}`}>
                          <IconButton color="secondary" sx={{ padding: "4px" }}>
                            <Edit />
                          </IconButton>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(data.Cart_ID)}
                        >
                          <Clear />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={Math.ceil(CartList.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
            />
          </Box>
        </Paper>
        <br />

        <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
          <Typography variant="h6">
            Subtotal:
          </Typography>
          <Typography variant="h6" sx={{ ml: 1, color: "#E8533F" }}>
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
          <Typography variant="h6">
            Voucher:
          </Typography>
          <Typography variant="h6" sx={{ ml: 1, color: "#E8533F" }}>
            - ${Discount.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
          <Typography variant="h4">
            Total:
          </Typography>
          <Typography variant="h4" sx={{ ml: 1, color: "#E8533F" }}>
            ${totalPriceAfterDiscount.toFixed(2)}
          </Typography>
        </Box>

        <br />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "60%" }}
            onClick={handleCheckout}
            disabled={CartList.length === 0} // Disable button if CartList is empty
          >
            Checkout
          </Button>
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Cart Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Delete this Cart Item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteCart(cart_id)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            <Box display="flex" alignItems="center" justifyContent="center">
              <CheckCircle sx={{ color: "#23A26D", fontSize: 64, mr: 1 }} />
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box textAlign="center">
              <Typography variant="h4">Order Confirmed</Typography>
              <Typography variant="h5">
                Total Price: ${totalPriceAfterDiscount.toFixed(2)}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Box display="flex" justifyContent="center" width="100%">
              <Button
                onClick={handleCloseDialog}
                color="primary"
                variant="contained"
              >
                OK
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
}

export default CartUser;

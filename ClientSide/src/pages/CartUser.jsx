import React, { useEffect, useState, useContext, navigate } from "react";
import { Link, useNavigate } from "react-router-dom";
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
<<<<<<< Updated upstream
=======
import Pagination from "@mui/material/Pagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";
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
>>>>>>> Stashed changes

function CartUser() {
  const navigate = useNavigate();
  const [CartList, setCartList] = useState([]);
  const [search, setSearch] = useState("");
  const [cart_id, setid] = useState("");

  const { user } = useContext(UserContext);

  useEffect(() => {
    getCartList();
  }, []);

  const getCartList = () => {
    http
      .get(`/Cart/getuser/${user.userId}`)
      .then((res) => {
        setCartList(res.data);
      })
      .catch(function (err) {
        toast.error(`${err.response.data.message}`);
      });
  };

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      searchsender();
    }
  };

  const onClickSearch = () => {
    searchsender();
  };

  const onClickClear = () => {
    setSearch("");
    getCartList();
  };

  const searchsender = () => {
    if (search.trim() !== "") {
      http.get(`/Cart?search=${search}`).then((res) => {
        setCartList(res.data);
      });
    }
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

<<<<<<< Updated upstream
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ my: 2, color: "black", fontWeight: "bold" }}
      >
        Cart Management
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Input
          value={search}
          placeholder="Search"
          onChange={onSearchChange}
          onKeyDown={onSearchKeyDown}
        />
        <IconButton color="primary" onClick={onClickSearch}>
          <Search />
        </IconButton>
        <IconButton color="primary" onClick={onClickClear}>
          <Clear />
        </IconButton>
=======
  const handleCheckout = async () => {
    const LineItems = CartList.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.eventName,
          },
          unit_amount: item.eventFee * 100, // Convert to cents
        },
        quantity: item.Booking_Quantity,
      };
    });

    http
      .post("/Cart/checkout", LineItems)
      .then((res) => {
        console.log("Success");
      })
      .catch(function (err) {
        console.log(err.response.data);
        toast.error(`${err.response.data.message}`);
      });
  };
  // Pagination
  const itemsPerPage = 5;
  const [page, setPage] = React.useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPrice = CartList.reduce((total, item) => {
    return (
      total + (memberstatus === "NTUC" ? item.eventntucFee : item.eventFee)
    );
  }, 0);

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
                          ? data.eventntucFee.toFixed(2)
                          : data.eventFee.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Link to={`/Cart/updateuser/${data.Cart_ID}`}>
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
          <Typography variant="h5" sx={{ color: "#E8533F" }}>
            Total Price:
          </Typography>
          <Typography variant="h5" sx={{ ml: 1 }}>
            ${totalPrice.toFixed(2)}
          </Typography>
        </Box>
        <br />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "60%" }}
            onClick={handleCheckout}
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
        <ToastContainer />
>>>>>>> Stashed changes
      </Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Cart ID</TableCell>
                <TableCell>Booking Date</TableCell>
                <TableCell>Booking Quantity</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Event ID</TableCell>
                <TableCell>Voucher ID</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {CartList.sort(
                (a, b) => new Date(a.UpdatedAt) - new Date(b.UpdatedAt)
              ).map((data, index) => (
                <TableRow key={index}>
                  <TableCell>{data.Cart_ID}</TableCell>
                  <TableCell>
                    {dayjs.utc(data.Booking_Date).format(global.datetimeFormat)}
                  </TableCell>
                  <TableCell>{data.Booking_Quantity}</TableCell>
                  <TableCell>{data.userId}</TableCell>
                  <TableCell>{data.event_ID}</TableCell>
                  <TableCell>{data.voucher_ID}</TableCell>
                  <TableCell>
                    {" "}
                    <IconButton
                      color="primary"
                      onClick={() => handleOpen(data.Cart_ID)}
                    >
                      <Clear />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Link to={`/Cart/update/${data.Cart_ID}`}>
                      <IconButton color="primary" sx={{ padding: "4px" }}>
                        <Edit />
                      </IconButton>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Delete this Cart?
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
      <ToastContainer />{" "}
    </Box>
  );
}

export default CartUser;

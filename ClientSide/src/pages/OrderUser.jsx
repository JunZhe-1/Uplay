import React, { useEffect, useState, useContext } from "react";
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
import Pagination from "@mui/material/Pagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";


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

function OrderUser() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [OrderList, setOrderList] = useState([]);
  const [order_id, setid] = useState("");
  const { user } = useContext(UserContext);
  const [memberstatus, setMemberStatus] = useState("");

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

    getOrderList();
  }, []);



  const getOrderList = () => {
    http.get(`/Order/getorder/${user.userId}`).then((res) => {
      const orderItems = res.data;
      console.log(res.data);
      Promise.all(
        orderItems.map(
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
        .then((updatedOrderItems) => {
          setOrderList(updatedOrderItems);
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
    console.log("order: " + order_id);
  };

  const handleClose = () => {
    setOpen(false);
    setid(null);
  };

  const deleteOrder = (id) => {
    http.delete(`/Order/removeitem/${id}`).then((res) => {
      setOpen(false);
      getOrderList();
    });
  };

  // Pagination
  const itemsPerPage = 5;
  const [page, setPage] = React.useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const totalPrice = OrderList.reduce((total, item) => {
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
          Your Orders
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
                {OrderList.slice((page - 1) * itemsPerPage, page * itemsPerPage)
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
                        {data.Price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleOpen(data.Order_ID)}
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
              count={Math.ceil(OrderList.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
            />
          </Box>
        </Paper>
        <br />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Order Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Delete this Order Item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteOrder(order_id)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />
      </Box>
    </ThemeProvider>
  );
}

export default OrderUser;

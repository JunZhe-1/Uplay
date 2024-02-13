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
import http from "../http";
import dayjs from "dayjs";
import global from "../global";
import Pagination from "@mui/material/Pagination";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1e4bf4", // Blue
    },
    secondary: {
      main: "#0096ff",
    },
  },
});

function OrderList() {
  const navigate = useNavigate();
  const [CartList, setCartList] = useState([]);
  const [search, setSearch] = useState("");
  const [cart_id, setid] = useState("");

  useEffect(() => {
    getCartList();
  }, []);

  const getCartList = () => {
    http
      .get("/Order")
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
      http.get(`/Order?search=${search}`).then((res) => {
        setCartList(res.data);
      });
    }
  };

  const [open, setOpen] = useState(false);

  const handleOpen = (id) => {
    setOpen(true);
    setid(id);
    console.log("id: " + id);
    console.log("order: " + cart_id);
  };

  const handleClose = () => {
    setOpen(false);
    setid(null);
  };

  const deleteCart = (id) => {
    http.delete(`/Order/removeitem/${id}`).then((res) => {
      setOpen(false);
      getCartList();
    });
  };

  const onAddClick = () => {
    navigate("/Order/add");
  };

  // Pagination
  const itemsPerPage = 5;
  const [page, setPage] = React.useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Typography
          variant="h5"
          sx={{ my: 2, color: "black", fontWeight: "bold" }}
        >
          Order Item Management
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
          <Button
            variant="contained"
            color="primary"
            onClick={onAddClick}
            sx={{ marginLeft: 2 }}
          >
            Add
          </Button>
        </Box>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Booking Date</TableCell>
                  <TableCell>Booking Quantity</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>User ID</TableCell>
                  <TableCell>Event ID</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {CartList.slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .sort((a, b) => new Date(a.UpdatedAt) - new Date(b.UpdatedAt))
                  .map((data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.Order_ID}</TableCell>
                      <TableCell>
                        {dayjs
                          .utc(data.Booking_Date)
                          .format(global.datetimeFormat)}
                      </TableCell>
                      <TableCell>{data.Booking_Quantity}</TableCell>
                      <TableCell>{data.Price}</TableCell>
                      <TableCell>{data.userId}</TableCell>
                      <TableCell>{data.event_ID}</TableCell>

                      <TableCell>
                        {" "}
                        <Link to={`/Order/update/${data.Order_ID}`}>
                          <IconButton color="secondary" sx={{ padding: "4px" }}>
                            <Edit />
                          </IconButton>
                        </Link>
                      </TableCell>

                      <TableCell>
                        {" "}
                        <IconButton
                          color="error"
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
              count={Math.ceil(CartList.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
            />
          </Box>
        </Paper>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Order</DialogTitle>
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
              onClick={() => deleteCart(cart_id)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer />{" "}
      </Box>
    </ThemeProvider>
  );
}

export default OrderList;

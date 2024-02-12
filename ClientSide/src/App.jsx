import './App.css';
import React, { useState, useEffect } from "react";

import { Container, AppBar, Toolbar, Typography, Box, Button,Menu, MenuItem, Fade } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import Tutorials from './pages/Tutorials';
import AddTutorial from './pages/AddTutorial';
import VoucherAdd from './pages/VoucherAdd';
import VoucherList from './pages/VoucherList';
import EditTutorial from './pages/EditTutorial';
import MyForm from './pages/MyForm';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import http from './http';
import UserContext from './contexts/UserContext';
import BuyMember from './pages/BuyMember';
import VoucherEdit from './pages/VoucherEdit';
import EventAdd from './pages/EventAdd';
import EventList from './pages/EventList';
import VoucherListUser from './pages/VoucherListUser';
import EventEdit from './pages/EventEdit';
import EventClientSide from './pages/EventClientSide';
import EventDetail from './pages/EventDetail';
import CartAdd from './pages/CartAdd';
import CartAddUser from "./pages/CartAddUser";
import CartEdit from './pages/CartEdit';
import CartUserEdit from "./pages/CartUserEdit";
import CartList from './pages/CartList';
import CartUser from './pages/CartUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomePage from './pages/Homepage';
import UserList from './pages/UserList';
import Password_Current from './pages/Password_Current';
import Password_Change from './pages/Password_Change';
import Userprofile from './pages/UserProfile';
import MemberPurchase from './pages/MemberPurchase';
import {
    GoogleReCaptchaProvider,
    useGoogleReCaptcha
} from 'react-google-recaptcha-v3';
function App() {
    const [user, setUser] = useState(null);
    const imageUrl = './../image/testing.png';




  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
        http.get('/UplayUser/auth').then((res) => {
            setUser(res.data.user);
      });
    }
  }, []);   

  const logout = () => {
    localStorage.clear();
    window.location = "/";
    };

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const open1 = Boolean(anchorEl1);
    const handleClick1 = (event) => {
        setAnchorEl1(event.currentTarget);
    };
    const handleClose1 = () => {
        setAnchorEl1(null);A
    };

    return (
            <GoogleReCaptchaProvider
            reCaptchaKey="6LdMGV8pAAAAAHGw5LEUvR-VOfzFbGWKBeyT5dJN"
            language="en"
            useRecaptchaNet={true}
        // Other props you may need
        >
           
       
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar
            position="static"
            className="AppBar"
            sx={{ backgroundColor: "white" }}
          >
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <img
                    alt="tutorial"
                    src={"./image/uplaylogo.png"}
                    style={{
                      width: "70%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />
                </Link>

                {/*<Link to="/tutorials" ><Typography>Home page</Typography></Link>*/}
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                    {user.emailAddress != "admin@gmail.com" ? (
                      <div>
                        <Link
                          to={`/Event/EventClientSide`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            className="appbarbutton"
                            variant="contained"
                            disableElevation
                            size="small"
                            style={{
                              backgroundColor: "white",
                              fontSize: "14px",
                            }}
                          >
                            All Experiences
                          </Button>
                        </Link>

                        <Link
                          to={`/Cart/getuser/:id`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            className="appbarbutton"
                            variant="contained"
                            disableElevation
                            size="small"
                            style={{
                              backgroundColor: "white",
                              fontSize: "14px",
                            }}
                          >
                            {" "}
                            <ShoppingCartIcon sx={{ fontSize: "27px" }} />
                          </Button>
                        </Link>

                        <Button
                          id="fade-button"
                          aria-controls={open ? "fade-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={handleClick}
                          sx={{ color: "#8C1AFF" }}
                        >
                          {" "}
                          <AccountCircleIcon sx={{ fontSize: "30px" }} />
                        </Button>
                        <Menu
                          id="fade-menu"
                          MenuListProps={{
                            "aria-labelledby": "fade-button",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          TransitionComponent={Fade}
                          PaperProps={{
                            sx: {
                              backgroundColor: "white",
                            },
                          }}
                        >
                          <MenuItem onClick={handleClose}>
                            <Box
                              sx={{
                                borderBottom: "1px solid #E8533F",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "#E8533F",
                                  fontWeight: "bold",
                                  fontSize: "12px",
                                }}
                              >
                                {localStorage.getItem("memberStatus")}
                              </Typography>
                            </Box>
                          </MenuItem>
                          <MenuItem onClick={handleClose}>
                            <Link
                              to="/profile"
                              style={{ textDecoration: "none" }}
                            >
                              <Typography sx={{ color: "black" }}>
                                My Profile
                              </Typography>
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={handleClose}>
                            <Link
                              to="/Voucher/uservoucher/:id"
                              style={{ textDecoration: "none" }}
                            >
                              <Typography sx={{ color: "black" }}>
                                My Vouchers
                              </Typography>
                            </Link>
                          </MenuItem>

                          <MenuItem onClick={handleClose}>
                            <Typography
                              sx={{ color: "black", cursor: "pointer" }}
                              onClick={logout}
                            >
                              Logout
                            </Typography>
                          </MenuItem>
                        </Menu>
                      </div>
                    ) : null}
                  </>
                )}

                {user && (
                  <>
                    {user.emailAddress === "admin@gmail.com" && (
                      <div>
                        <Button
                          id="admin-fade-button"
                          aria-controls={open1 ? "admin-fade-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open1 ? "true" : undefined}
                          onClick={handleClick1}
                          sx={{ color: "#8C1AFF" }}
                        >
                          System Management
                        </Button>
                        <Menu
                          id="admin-fade-menu"
                          MenuListProps={{
                            "aria-labelledby": "admin-fade-button",
                          }}
                          anchorEl={anchorEl1}
                          open={open1}
                          onClose={handleClose1}
                          TransitionComponent={Fade}
                          PaperProps={{
                            sx: {
                              backgroundColor: "#FAD5A5",
                            },
                          }}
                        >
                          <MenuItem onClick={handleClose1}>
                            <Link
                              to="/Event"
                              style={{ textDecoration: "none" }}
                            >
                              <Typography sx={{ color: "black" }}>
                                Event Management
                              </Typography>
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={handleClose1}>
                            <Link
                              to="/Voucher"
                              style={{ textDecoration: "none" }}
                            >
                              <Typography sx={{ color: "black" }}>
                                Voucher Management
                              </Typography>
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={handleClose1}>
                            <Link to="/Cart" style={{ textDecoration: "none" }}>
                              <Typography sx={{ color: "black" }}>
                                Cart Item Management
                              </Typography>
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={handleClose1}>
                            <Link
                              to="/userlist"
                              style={{ textDecoration: "none" }}
                            >
                              <Typography sx={{ color: "black" }}>
                                User List
                              </Typography>
                            </Link>
                          </MenuItem>
                          {/* Add more menu items as needed */}
                        </Menu>

                        <Button
                          id="administrator-fade-button"
                          aria-controls={open ? "admin-fade-menu" : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? "true" : undefined}
                          onClick={handleClick}
                          sx={{ color: "#8C1AFF" }}
                        >
                          Administrator
                        </Button>
                        <Menu
                          id="admin-fade-menu"
                          MenuListProps={{
                            "aria-labelledby": "administrator-fade-button",
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          TransitionComponent={Fade}
                          PaperProps={{
                            sx: {
                              backgroundColor: "#FAD5A5",
                            },
                          }}
                        >
                          <MenuItem onClick={handleClose}>
                            <Link
                              to="/profile"
                              style={{ textDecoration: "none" }}
                            >
                              <Typography sx={{ color: "black" }}>
                                My Profile
                              </Typography>
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={handleClose}>
                            <Typography
                              sx={{ color: "black", cursor: "pointer" }}
                              onClick={logout}
                            >
                              Logout
                            </Typography>
                          </MenuItem>
                          {/* Add more menu items as needed */}
                        </Menu>
                      </div>
                    )}
                  </>
                )}

                {!user && (
                  <>
                    <Link to="/register">
                      <Typography>Register</Typography>
                    </Link>
                    <Link to="/login">
                      <Typography>Login</Typography>
                    </Link>
                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<HomePage />} />
              <Route path={"/tutorials"} element={<Tutorials />} />
              <Route path={"/addtutorial"} element={<AddTutorial />} />

              <Route path={"/Voucher/add"} element={<VoucherAdd />} />
              <Route path={"/Voucher"} element={<VoucherList />} />
              <Route path={"/Voucher/update/:id"} element={<VoucherEdit />} />
              <Route path={"/Voucher/uservoucher/:id"} element={<VoucherListUser />} />

              <Route path={"/edittutorial/:id"} element={<EditTutorial />} />
              <Route path={"/register"} element={<Register />} />
              <Route path={"/login"} element={<Login />} />
              <Route path={"/form"} element={<MyForm />} />

              <Route path="/password_current" element={<Password_Current />} />
              <Route path="/password_change" element={<Password_Change />} />
              <Route path="/userProfile" element={<Userprofile />} />
              <Route path="/memberpurchase" element={<MemberPurchase />} />

              <Route path={"/profile"} element={<Profile />} />
              <Route path={"/Event/add_event"} element={<EventAdd />} />
              <Route path={"/Event"} element={<EventList />} />
              <Route path={"/Event/editevent/:id"} element={<EventEdit />} />
              <Route path={"/Event/getEvent/:id"} element={<EventDetail />} />

              <Route
                path={"/Event/EventClientSide"}
                element={<EventClientSide />}
              />

              <Route path={"/profile"} element={<Profile />} />
              <Route path={"/buymember"} element={<BuyMember />} />
              <Route path={"/userlist"} element={<UserList />} />
              <Route path={"/Cart/add"} element={<CartAdd />} />
              <Route path={"/Cart/adduser"} element={<CartAddUser />} />
              <Route path={"/Cart"} element={<CartList />} />
              <Route path={"/Cart/update/:id"} element={<CartEdit />} />
              <Route path={"/Cart/updateuser/:id"} element={<CartUserEdit />} />
              <Route path={"/Cart/getuser/:id"} element={<CartUser />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
      </UserContext.Provider>

        </GoogleReCaptchaProvider>
  );

}

export default App;
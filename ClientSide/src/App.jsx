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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
function App() {
    const [user, setUser] = useState(null);



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
        setAnchorEl1(null);
    };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <AppBar position="static" className="AppBar">
            <Container>
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    Uplay
                  </Typography>
                </Link>
                {/*<Link to="/tutorials" ><Typography>Home page</Typography></Link>*/}
                              <Box sx={{ flexGrow: 1 }}></Box>
                              {user && (
                                  <>
                                      {user.userName !== "admin" ? (
                                          <div>
                                              <Link to={`/Event/EventClientSide`}>
                                                  <Button
                                                      className="appbarbutton"
                                                      variant="contained"
                                                      disableElevation
                                                      size="small"
                                                  >
                                                      All Experiences
                                                  </Button>
                                              </Link>

                                              <Button
                                                  id="fade-button"
                                                  aria-controls={open ? 'fade-menu' : undefined}
                                                  aria-haspopup="true"
                                                  aria-expanded={open ? 'true' : undefined}
                                                  onClick={handleClick}
                                                  sx={{ color: '#8C1AFF' }}
                                              >      <AccountCircleIcon sx={{ fontSize: '30px' }} />

                                              </Button>
                                              <Menu
                                                  id="fade-menu"
                                                  MenuListProps={{
                                                      'aria-labelledby': 'fade-button',
                                                  }}
                                                  anchorEl={anchorEl}
                                                  open={open}
                                                  onClose={handleClose}
                                                  TransitionComponent={Fade}
                                                  PaperProps={{
                                                      sx: {
                                                          backgroundColor: 'green',
                                                      },
                                                  }}
                                              >
                                                  <MenuItem onClick={handleClose}>
                                                      <Link to="/profile">
                                                          <Typography sx={{ color: 'white' }}>My Profile</Typography>
                                                      </Link>
                                                  </MenuItem>
                                                  <MenuItem onClick={handleClose}>
                                                      <Link to="/Voucher/uservoucher/:id">
                                                          <Typography sx={{ color: 'white' }}>My Vouchers</Typography>
                                                      </Link>
                                                  </MenuItem>
                                                  <MenuItem onClick={handleClose}>
                                                      <Typography
                                                          sx={{ color: 'white', cursor: 'pointer' }}
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
                                      {user.userName === "admin" && (
                                          <div>
                                              <Button
                                                  id="admin-fade-button"
                                                  aria-controls={open1 ? 'admin-fade-menu' : undefined}
                                                  aria-haspopup="true"
                                                  aria-expanded={open1 ? 'true' : undefined}
                                                  onClick={handleClick1}
                                                  sx={{ color: '#8C1AFF' }}
                                              >
                                                  System Management
                                              </Button>
                                              <Menu
                                                  id="admin-fade-menu"
                                                  MenuListProps={{
                                                      'aria-labelledby': 'admin-fade-button',
                                                  }}
                                                  anchorEl={anchorEl1}
                                                  open={open1}
                                                  onClose={handleClose1}
                                                  TransitionComponent={Fade}
                                                  PaperProps={{
                                                      sx: {
                                                          backgroundColor: 'green',
                                                      },
                                                  }}
                                              >
                                                  <MenuItem onClick={handleClose1}>
                                                      <Link to="/Event">
                                                          <Typography sx={{ color: 'white' }}>Event Management</Typography>
                                                      </Link>
                                                  </MenuItem>
                                                  <MenuItem onClick={handleClose1}>
                                                      <Link to="/Voucher">
                                                          <Typography sx={{ color: 'white' }}>Voucher Management</Typography>
                                                      </Link>
                                                  </MenuItem>
                                                  {/* Add more menu items as needed */}
                                              </Menu>

                                              <Button
                                                  id="administrator-fade-button"
                                                  aria-controls={open ? 'admin-fade-menu' : undefined}
                                                  aria-haspopup="true"
                                                  aria-expanded={open ? 'true' : undefined}
                                                  onClick={handleClick}
                                                  sx={{ color: '#8C1AFF' }}
                                              >
                                                  Administrator
                                              </Button>
                                              <Menu
                                                  id="admin-fade-menu"
                                                  MenuListProps={{
                                                      'aria-labelledby': 'administrator-fade-button',
                                                  }}
                                                  anchorEl={anchorEl}
                                                  open={open}
                                                  onClose={handleClose}
                                                  TransitionComponent={Fade}
                                                  PaperProps={{
                                                      sx: {
                                                          backgroundColor: 'green',
                                                      },
                                                  }}
                                              >
                                                  <MenuItem onClick={handleClose}>
                                                      <Link to="/profile">
                                                          <Typography sx={{ color: 'white' }}>My Profile</Typography>
                                                      </Link>
                                                  </MenuItem>
                                                  <MenuItem onClick={handleClose}>
                                                      <Typography
                                                          sx={{ color: 'white', cursor: 'pointer' }}
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
                    <Link to="/register" ><Typography>Register</Typography></Link>
                                      <Link to="/login" ><Typography>Login</Typography></Link>

                  </>
                )}
              </Toolbar>
            </Container>
          </AppBar>

          <Container>
            <Routes>
              <Route path={"/"} element={<Tutorials />} />
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

                          <Route path={"/profile"} element={<Profile />} />
                          <Route path={"/Event/add_event"} element={<EventAdd />} />
                          <Route path={"/Event"} element={<EventList />} />
                          <Route path={"/Event/editevent/:id"} element={<EventEdit />} />
                          <Route path={"/Event/getEvent/:id"} element={<EventDetail />} />

                          <Route path={"/Event/EventClientSide"} element={<EventClientSide />} />


              <Route path={"/profile"} element={<Profile />} />
              <Route path={"/buymember"} element={<BuyMember />} />
                          
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;

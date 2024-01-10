import './App.css';
import { useState, useEffect, useContext } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
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
                <Link to="/tutorials" ><Typography>Home page</Typography></Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <>
                  <Link to="/profile">
                    <Typography>{user.userName}</Typography>
                  </Link>
                                      <Button onClick={logout}>Logout</Button>
                                      <Link to="/Voucher/uservoucher/:id" ><Typography>Vouchers User</Typography></Link>

                  </>
                )
                }
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

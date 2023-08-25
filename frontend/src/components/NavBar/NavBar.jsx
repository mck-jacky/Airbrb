import React, { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { AirBrBTheme } from '../Theme';
import { UserContext } from '../../userContext';
import { showAlert, fetchURL, isLogin, getHistoryPoint } from '../../helper';

import SearchBar from '../SearchBar/SearchBar';
import CustomMenu from '../CustomMenu/CustomMenu';

function NavBar () {
  const userObj = useContext(UserContext);
  const navigate = useNavigate();

  const logout = async () => {
    const res = await fetchURL('user/auth/logout', 'POST', {});
    if (res.error) {
      showAlert(res.error);
    }

    userObj.setUser({});
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate(getHistoryPoint())
  };

  let showSearchBar = true;
  if (useLocation().pathname !== '/') {
    showSearchBar = false
  }

  return (
    <ThemeProvider theme={AirBrBTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" bgcolor='primary.main'>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ color: 'white' }} >
                AirBrB
              </Link>
            </Typography>

            {showSearchBar
              ? <Box sx={{ flexGrow: 1 }} >
                  <SearchBar />
                </Box>
              : <></>
            }

            {isLogin(userObj)
              ? <CustomMenu menuList={ [
                {
                  title: 'My Booking',
                  controlName: 'listing-booking',
                  action: () => { navigate('/listings/booking') },
                  component: <>My Bookings</>
                },
                {
                  title: 'My Listing',
                  controlName: 'listing-host',
                  action: () => { navigate('/listings/host') },
                  component: <>My Listing</>
                },
                {
                  title: 'Logout',
                  controlName: 'logout',
                  action: logout,
                  component: <>Logout</>
                }
              ] } />
              : <CustomMenu menuList={ [
                {
                  title: 'Register',
                  controlName: 'register',
                  action: () => { navigate('/register') },
                  component: <>Register</>
                },
                {
                  title: 'Login',
                  controlName: 'login',
                  action: () => { navigate('/login') },
                  component: <>Login</>
                }
              ] } />
            }

          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}

export default NavBar;

import React, { useContext, useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AirBrBTheme } from '../../components/Theme';
import { fetchURL, getHistoryPoint } from '../../helper';
import { UserContext } from '../../userContext';
import { useNavigate } from 'react-router-dom';
import UserChecking from '../../components/UserChecking';
import FormButton from '../../components/FormButton';
import CustomLink from '../../components/CustomLink'

function LoginPage () {
  // use state
  const [show, setShow] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Error')
  const [isChecking, setIsChecking] = useState(false)

  const userObj = useContext(UserContext);
  const navigate = useNavigate();

  // in page function
  async function handleSubmit (event) {
    event.preventDefault();
    setIsChecking(true)
    const data = new FormData(event.currentTarget);
    const email = data.get('email');

    const res = await fetchURL('user/auth/login', 'POST', {
      email,
      password: data.get('password')
    });

    if (res.error) {
      setErrorMessage(res.error)
      setShow(true)
      setIsChecking(false)
    } else {
      setShow(false)
      userObj.setUser({
        token: res.token,
        email
      });
      localStorage.token = res.token;
      localStorage.email = email;
      // navigate to history point after login
      navigate(getHistoryPoint())
    }
  }

  return (
    <ThemeProvider theme={AirBrBTheme}>
      {!isChecking &&
        <UserChecking needLogin={false} />
      }
      {show &&
        <Alert severity='error' onClose={() => setShow(false)}>{errorMessage}</Alert>
      }
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="login-email"
              label="Email Address"
              name="email"
              autoComplete="email"
              inputProps={{ 'aria-label': 'email' }}
              autoFocus />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="login-password"
              inputProps={{ 'aria-label': 'password' }}
              autoComplete="current-password" />
            <FormButton text="Sign in" name="submit" />
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <CustomLink to="/register"
                  style={{
                    color: '#FF5A5F',
                    fontSize: '0.875rem',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(255, 90, 95, 0.4)'
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </CustomLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>

  );
}

export default LoginPage;

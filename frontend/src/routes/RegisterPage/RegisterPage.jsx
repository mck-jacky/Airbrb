import React, { useState, useContext } from 'react';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { AirBrBTheme } from '../../components/Theme';
import { fetchURL, getHistoryPoint } from '../../helper';
import { UserContext } from '../../userContext';
import { Link, useNavigate } from 'react-router-dom';
import UserChecking from '../../components/UserChecking';
import Textfield from '../../components/TextField'
import FormButton from '../../components/FormButton';

function RegisterPage () {
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
    const password = data.get('password');
    const confirmPassword = data.get('confirm-password');

    if (password !== '' && password !== confirmPassword) {
      setShow(true)
      setErrorMessage('Password mismatch. Please try again.')
      setIsChecking(false)
      return;
    }

    const res = await fetchURL('user/auth/register', 'POST', {
      email,
      password: data.get('password'),
      name: data.get('name')
    })

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
      // navigate to history point after register
      navigate(getHistoryPoint());
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
            <EnhancedEncryptionIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Textfield id="login-name" label="Name" name="name" autoFocus />
            <Textfield id="register-email" label="Email Address" name="email" />
            <Textfield id="register-password" label="Password" name="password" type="password"/>
            <Textfield id="register-confirm-password" label="Confirm Password" name="confirm-password" type="password"/>
            <FormButton text="Create account" name="submit" />
            <Grid container>
              <Grid item xs>
              </Grid>
              <Grid item>
                <Link to="/login"
                  style={{
                    color: '#FF5A5F',
                    fontSize: '0.875rem',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(255, 90, 95, 0.4)'
                  }}
                >
                  {'Already have an account? Login here'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>

  );
}

export default RegisterPage;

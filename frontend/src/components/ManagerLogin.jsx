import React from 'react';
// import { auth } from "./firebase-config";
// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOut,
// } from "firebase/auth";
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, Typography, TextField, Container, Popover } from '@mui/material';
import { pink } from '@mui/material/colors';
import { useCookies } from 'react-cookie';


const mainPink = pink[100];
const secPink = pink[200];

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: mainPink,
  },
  '& label': {
    color: mainPink,
  },
  '& border': {
    border: 10,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: secPink,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: mainPink,
      borderWidth: "5px"

    },
    '&:hover fieldset': {
      borderColor: secPink,
      borderWidth: "5px"
    },
    '&.Mui-focused fieldset': {
      borderColor: secPink,
      borderWidth: "5px"

    },
  },
});

const LoginButton = styled(Button)(({ theme }) => ({
  color: "#FFFFFF",
  backgroundColor: mainPink,
  '&:hover': {
    backgroundColor: secPink,
  },
}));

const ManagerLogin = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cookies, setCookie] = useCookies(['token']);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    console.log({
      email: email,
      password: password,
    });

    const body = {
      'email': email,
      'password': password,
    }
    try { 
      const response = await fetch('http://localhost:8000/auth/manager/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      
      const data = await response.json();
      setCookie('token', data, { path: '/' });
      // console.log(cookies.token)
      window.location.href = '/Menu';
    }
    catch (error) {
      console.log(error)
      alert('Failed to login. Please try again.');
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Container component="main" maxWidth="sm">
    <Box 
      sx={{ 
        marginTop: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Box container direction='column' justifyContent='center' >
        <Typography variant="h5" sx={{ mb: 2 }}>Manager Login</Typography>
        <CssTextField fullWidth required label="Email" onChange={handleEmailChange}
          sx={{ mb: 1 }}/>
        <CssTextField type="password" fullWidth required label="Password" onChange={handlePasswordChange}
          sx={{ mb: 2 }}/>
        <Grid container>
          <Grid item xs>
            <Button justifyContent='center' onClick={handleClick}>First Time?</Button>
            <Popover 
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Typography sx={{ p: 2 }}>Email: manager@waitmate.com <br/>Password: waitmate1</Typography>
            </Popover> 
          </Grid>
          <Grid item> 
            <LoginButton disabled={!(email && password)} variant="contained" onClick={handleLogin}> Login</LoginButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </Container>

  
  )
}

export default ManagerLogin;

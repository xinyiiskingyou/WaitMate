import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Grid, Typography, TextField, Container } from '@mui/material';
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

const WaitstaffLogin = () => {
  const [password, setPassword] = React.useState('');
  const [cookies, setCookie] = useCookies(['token']);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    console.log({
      password: password,
    });

    const body = {
      'password': password,
    }
    try { 
      const response = await fetch('http://localhost:8000/auth/waitstaff/login', {
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
      console.log(cookies.token)
      window.location.href = '/waitstaff';
    }
    catch (error) {
      console.log(error)
      alert('Failed to login. Please try again.');
    }
  };


  return (
    <Container component="main" maxWidth="sm">
    <Box 
      sx={{ 
        marginTop: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 450,
      }}>
      <Box container direction='column' justifyContent='center'
        sx={{
          minWidth: 450,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>Waitstaff Login</Typography>
        <CssTextField fullWidth type="password" required label="Password" onChange={handlePasswordChange}
          sx={{ mb: 2 }}/>
          
        <Grid container>
          <Grid item xs> 
            <Box display="flex" justifyContent="flex-end">
              <LoginButton disabled={!password} variant="contained" onClick={handleLogin}>Login</LoginButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </Container>
  
  )

}
export default WaitstaffLogin;

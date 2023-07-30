import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Grid, Typography, Container } from '@mui/material';
import { pink } from '@mui/material/colors';
import { useCookies } from 'react-cookie';
import CssTextField from '../CssTextField.jsx'

const mainPink = pink[100];
const secPink = pink[200];

const LoginButton = styled(Button)(({ theme }) => ({
  color: "#FFFFFF",
  backgroundColor: mainPink,
  '&:hover': {
    backgroundColor: secPink,
  },
}));

const KitchenstaffLogin = () => {
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
      const response = await fetch('http://localhost:8000/auth/kitchenstaff/login', {
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
      window.location.href = '/kitchenstaff/list';
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
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'stretch',
          minWidth: 450,
        }}
        
      >
        <Typography variant="h5" sx={{ mb: 2 }}>Kitchenstaff Login</Typography>
        <CssTextField fullWidth type="password" required label="Password" onChange={handlePasswordChange}
          sx={{ 
            mb: 2,
            length: 10
          }}/>
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
export default KitchenstaffLogin;
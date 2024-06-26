import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Grid, Typography, Container, Popover } from '@mui/material';
import { yellow } from '@mui/material/colors';
import { useCookies } from 'react-cookie';
import { handleLogin } from '../../auth.js';
import CssTextField from './CssTextField.jsx'

const mainPink = '#FF9EE4';
const secPink = '#FF9EE4';

const LoginButton = styled(Button)(() => ({
  color: "#FFFFFF",
  borderRadius: 0,
  backgroundColor: mainPink,
  '&:hover': {
    backgroundColor: secPink,
  },
}));

const ManagerLogin = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [_, setCookie] = useCookies(['token']);

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

  const handleLoginSubmit = () => {
    handleLogin(email, password).then( data => {
      setCookie('token', data, { path: '/' })
      console.log(data)
      window.location.href = '/manager/menu'
    })
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
        minWidth: 450,

      }}>
      <Box container direction='column'  
        sx={{
          minWidth: 450,
          backgroundColor: 'white',
          py: 3,
          px: 4,
          borderRadius: 2,

        }}
      >
        <Box display='flex' justifyContent='center' sx={{ pb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: secPink, textShadow: `-3px 1px 2px ${yellow[100]}` }}>MANAGER LOGIN</Typography>
        </Box>
        <CssTextField fullWidth required label="Email" onChange={handleEmailChange}
          sx={{ mb: 1 }}/>
        <CssTextField type="password" fullWidth required label="Password" onChange={handlePasswordChange}
          sx={{ mb: 2 }}/>
        <Grid container>
          <Grid item xs>
            <Button justifyContent='center' onClick={handleClick} sx={{color: secPink, backgroundColor: 'white',  borderRadius: 0}}>First Time?</Button>
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
              <Typography sx={{ p: 2, color: secPink }}>Email: manager@waitmate.com <br/>Password: waitmate1</Typography>
            </Popover> 
          </Grid>
          <Grid item> 
            <LoginButton disabled={!(email && password)} variant="contained" onClick={handleLoginSubmit}> Login</LoginButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </Container>
  )
}

export default ManagerLogin;

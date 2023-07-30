import React from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, Button, Typography, Dialog, DialogTitle, Alert,
  Container, Grid, Divider, Snackbar, Backdrop, CircularProgress} from '@mui/material';
import { pink, yellow, grey } from '@mui/material/colors';
import WestIcon from '@mui/icons-material/West';
import { useCookies } from 'react-cookie';
import { handleLogin, handleLogoutSubmit } from '../auth.js';
import CssTextField from './CssTextField.jsx'

const mainPink = '#FF9EE4';
const secPink = '#FF9EE4';

const LoginButton = styled(Button)(({ }) => ({
  color: "#FFFFFF",
  borderRadius: 0,

  backgroundColor: mainPink,
  '&:hover': {
    backgroundColor: secPink,
  },
}));

function SimpleDialog(props) {
  const { onClose, open } = props;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [cookies, setCookie] = useCookies(['token']);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginClick = async () => {
    const token = await handleLogin(email, password);
    if (token) {
      setCookie('token', token, { path: '/' });
      onClose()
    }
  }

  return (
    <Dialog open={open}>
      <Box sx={{    
        px: 2,            
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        border: `7px solid ${mainPink}`,}}>
      <DialogTitle>Login with new email</DialogTitle>
      <CssTextField fullWidth required label="Email" 
        onChange={handleEmailChange}
        sx={{ mb: 1 }}/>
      <CssTextField type="password" fullWidth required label="Password" 
        onChange={handlePasswordChange}
        sx={{ mb: 2 }}/>
      <LoginButton disabled={!(email && password)} onClick={handleLoginClick}
        sx={{ mb : 2 }}
      >
        Login
      </LoginButton>
      </Box>
    </Dialog>
  );
}

const Settings = () => {
  const [waitstaffPassword, setWaitstaffPassword] = React.useState('');
  const [kitchenstaffPassword, setKitchenstaffPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openSB, setOpenSB] = React.useState(false);
  const [msgSB, setMsgSB] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [cookies] = useCookies(['token']);

  const handleClose = () => {
    setOpen(false);
  };

  const handlewaitstaffPasswordChange = (event) => {
    setWaitstaffPassword(event.target.value);
  };

  const handlekitchenstaffPasswordChange = (event) => {
    setKitchenstaffPassword(event.target.value);
  };

  const handlEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordSubmit = async () => {

    try { 
      const response = await fetch('http://localhost:8000/auth/manager/update/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
      })
      if (!response.ok) {
        throw new Error('Failed to send reset');
      }
      setMsgSB('Successfully sent email.')
      setOpenSB(true)
    }
    catch (error) {
      console.log(error)
      alert('Failed to send reset. Please try again.');
    }
  }

  const handleEmailSubmit = async () => {
    const body = {
      'email': email,
    }
    console.log(cookies.token)

    try { 
      const response = await fetch('http://localhost:8000/auth/manager/update/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error('Failed to set email');
      }
      setOpen(true);

    }
    catch (error) {
      console.log(error)
      alert('Failed to set email. Please try again.');
    }
  }

  const handleWaitstaffPasswordSubmit = () => {
    handleStaffPasswordSubmit('waitstaff', waitstaffPassword);
  }

  const handleKitchenstaffPasswordSubmit = () => {
    handleStaffPasswordSubmit('kitchenstaff', kitchenstaffPassword);
  }

  const handleStaffPasswordSubmit = async (employee, password) => {
    console.log(password)
    try { 
      const response = await fetch(`http://localhost:8000/auth/${employee}/update/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${cookies.token}`,
        },
        body: JSON.stringify(`grant_type=&username=_&password=${password}&scope=&client_id=&client_secret=`)

      })
      if (!response.ok) {
        throw new Error('Failed change password');
      }
      setMsgSB('Successfully saved password.')
      setOpenSB(true)
    }
    catch (error) {
      console.log(error)
      alert('Failed to change password. Please try again.');
    }
  };

  const handleResetSubmit = async () => {
    setLoading(true)
    try { 
      const response = await fetch('http://localhost:8000/auth/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
      })
      if (!response.ok) {
        throw new Error('Failed to delete');
      }
      window.location.href = '/';
    }
    catch (error) {
      console.log(error)
      setLoading(false)
      alert('Failed to delete. Please try again.');
    }
  }

  const handleBack = () => {
    window.location.href = '/menu';
  }

  const handleCloseSB = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    console.log('hi')
    setOpenSB(false);
  };

  return (
    <Container >
    <Grid container direction="column" spacing={2}>
      <Grid item xs={2} sx={{mb: 2}}>
        <Box
          sx={{ 
            margin: 2, 
            mt: 4, 
            borderRadius: 2, 
            height: '100%',
            display:'flex',
            flexDirection:"column",
          }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Button onClick={handleBack}        
                sx={{ 
                  border: 5,
                  borderColor: mainPink,
                  borderRadius: 2,
                  color: 'black' 
                }}>
                <WestIcon/>
              </Button>
            </Grid>

            <Grid item xs={8}>
              <Typography 
              variant="h3" 
              align="center"
              noWrap
              fontWeight="bold"
              >
                Settings
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Box display='flex' justifyContent='flex-end'>
                <LoginButton sx={{}} onClick={handleLogoutSubmit}>
                  Logout
                </LoginButton>
              </Box>
            </Grid>

          </Grid>
        </Box>
      </Grid>   

    <Box
      justifyContent="center"
      sx={{ 
        py: 4,
        px: 4,
        minWidth: 40,
        display: 'flex',
        flexDirection: 'column', 
        backgroundColor: 'white',
        borderRadius: 2,
      }}>
      <Typography variant="h5" sx={{ mb: 2, backgroundColor: mainPink, p: 1, color: 'white', textShadow: `-1px 0px ${grey[400]}` }}>User Managerment</Typography>

      <Grid container direction="row" spacing={2}>
        <Grid alignItems="center" item xs={4} sx={{}}>
          <Typography fullHeight sx={{backgroundColor: 'grey', height: '7.5vh'}}> Waitstaff password</Typography>
        </Grid>
        <Grid item xs={6} sx={{mb: 2}}>
          <CssTextField fullWidth type="password" label="Waitstaff password" 
            onChange={handlewaitstaffPasswordChange} 
            />
        </Grid>
        <Grid item xs={2}>
          <LoginButton disabled={!(waitstaffPassword.length > 5)} 
            onClick={handleWaitstaffPasswordSubmit} 
            sx={{  height: '7.5vh', width: 1 }}
          >
            Save
          </LoginButton>
        </Grid>
      </Grid>

      <Grid container direction="row" spacing={2}>
        <Grid item xs={10}>
          <CssTextField fullWidth type="password" label="Kitchenstaff password  "  
            onChange={handlekitchenstaffPasswordChange}
            sx={{ mb: 2 }}/>
        </Grid>
        <Grid item xs={2}>
          <LoginButton disabled={!(kitchenstaffPassword.length > 5)}  
            onClick={handleKitchenstaffPasswordSubmit} 
            sx={{ height: '7.5vh', width: 1 }}>
              Save
          </LoginButton>
        </Grid>
      </Grid>


      <Typography variant="h5" sx={{ mt: 6, mb: 2, backgroundColor: mainPink, p: 1, color: 'white', textShadow: `-1px 0px ${grey[400]}` }}>Manage Account</Typography>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={10}>
          <CssTextField fullWidth label="Set new email" onChange={handlEmailChange}
            sx={{ mb: 2 }}/>
        </Grid>
        <Grid item xs={2}>
          <LoginButton disabled={!email} sx={{ height: '7.5vh', width: 1 }} onClick={handleEmailSubmit}>
            Save
          </LoginButton>
        </Grid>
      </Grid>


      <LoginButton sx={{ mb: 2 }} onClick={handlePasswordSubmit}>
        Send password reset 
      </LoginButton>
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
      <LoginButton sx={{ mt: 4 }} onClick={handleResetSubmit}>
        Reset management
      </LoginButton>

      <Snackbar
        open={openSB}
        autoHideDuration={2000}
        onClose={handleCloseSB}
      >
        <Alert onClose={handleCloseSB} severity="success">
          {msgSB}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ color: secPink, zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

    </Box>
    </Grid>
    </Container>
  
  )
}

export default Settings;
import React from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, Button, Typography, Dialog, DialogTitle, Alert,
  Container, Grid, Snackbar, Backdrop, CircularProgress} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useCookies } from 'react-cookie';
import { handleLogin, handleLogoutSubmit } from '../../auth.js';
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

function SimpleDialog(props) {
  const { onClose, open } = props;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [_, setCookie] = useCookies(['token']);

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
    <Dialog open={open} PaperProps={{
      style: { backgroundColor: 'transparent' }   }}>
      <Box sx={{    
        px: 4,            
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        background: 'white',
        border: `2px solid ${mainPink}`,
        borderRadius: 1}}>
      <DialogTitle>Login with your new email</DialogTitle>
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

function ResetDialog(props) {
  const { onClose, open, onReset } = props;

  const handleReset = async () => {
    onReset()
  }

  const handleCancel = async () => {
    onClose()
  }

  return (
    <Dialog open={open} PaperProps={{
      style: { backgroundColor: 'transparent' }   }}>
      <Box sx={{    
        px: 4,            
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'white',
        border: `2px solid ${mainPink}`,
        borderRadius: 1}}>
      <Typography variant="h5" sx={{my: 2, p: 1, color: mainPink, fontWeight: 'bold', textAlign: 'center'}}>Continue Reset</Typography>
      <Box display='flex' justifyContent="space-between" sx={{ mb: 1, width: '100%' }}> 
        <LoginButton onClick={handleReset}
          sx={{ mb : 2, px: 3.2 }}
        >
          Okay
        </LoginButton>      
        <LoginButton onClick={handleCancel}
          sx={{ ml: 4, mb : 2, px: 2 }}
        >
          Cancel
        </LoginButton>
      </Box>
      </Box>
    </Dialog>
  );
}

const Settings = () => {
  const [waitstaffPassword, setWaitstaffPassword] = React.useState('');
  const [kitchenstaffPassword, setKitchenstaffPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [openRD, setOpenRD] = React.useState(false);

  const [openSB, setOpenSB] = React.useState(false);
  const [msgSB, setMsgSB] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [cookies] = useCookies(['token']);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseRD = () => {
    setOpenRD(false);
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

  const handleResetClick = () => {
    setOpenRD(true)
  }

  const handleResetSubmit = async () => {
    handleCloseRD()
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
      

    <Box
      justifyContent="center"
      sx={{ 
        marginTop: '15vh',
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
        <Grid item xs={10} sx={{mb: 2}}>
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


      <LoginButton sx={{ mb: 1 }} onClick={handlePasswordSubmit}>
        Send password reset 
      </LoginButton>

      <SimpleDialog
        open={open}
        onClose={handleClose}
      />

      <LoginButton onClick={handleLogoutSubmit}>Logout</LoginButton>
  
      <LoginButton sx={{ mt: 4 }} onClick={handleResetClick}>
        Reset management
      </LoginButton>

      <ResetDialog 
        open={openRD}
        onClose={handleCloseRD}
        onReset={handleResetSubmit}
      />

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

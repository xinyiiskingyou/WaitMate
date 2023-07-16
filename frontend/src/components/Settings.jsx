import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography, TextField, Dialog, DialogTitle} from '@mui/material';
import { pink } from '@mui/material/colors';
import { useCookies } from 'react-cookie';
import { handleLogin, handleLogoutSubmit } from '../auth.js';

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
      console.log(token)

      console.log(cookies.token)

      onClose()

    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Login with new email</DialogTitle>
      <CssTextField fullWidth required label="Email" onChange={handleEmailChange}
        sx={{ mb: 1 }}/>
      <CssTextField type="password" fullWidth required label="Password" onChange={handlePasswordChange}
        sx={{ mb: 2 }}/>
      <LoginButton sx={{ mb : 2 }} disabled={!(email && password)} onClick={handleLoginClick}>Login</LoginButton>
      
    </Dialog>
  );
}

const Settings = () => {
  const [waitstaffPassword, setWaitstaffPassword] = React.useState('');
  const [kitchenstaffPassword, setKitchenstaffPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [cookies] = useCookies(['token']);

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
      alert('Successfully sent email.');
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
      alert('Successfully changed staff password');

    }
    catch (error) {
      console.log(error)
      alert('Failed to change password. Please try again.');
    }
  };

  const handleResetSubmit = async () => {
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
      alert('Failed to delete. Please try again.');
    }
  }

  return (
    <Box
      display="grid"
      gridTemplateRows="repeat(1, 1fr)"
      justifyContent="center"
      alignItems="center"
      py={[0, 0, 8]}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>Settings</Typography>
      <LoginButton sx={{ mb: 2 }} onClick={handlePasswordSubmit}>Send password reset </LoginButton>
      <CssTextField label="Set new email" onChange={handlEmailChange}
        sx={{ mb: 2 }}/>
      <LoginButton disabled={!email} sx={{ mb: 2 }} onClick={handleEmailSubmit}>Save</LoginButton>
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />

      <CssTextField type="password" label="Add new waitstaff password" onChange={handlewaitstaffPasswordChange}
        sx={{ mt: 8, mb: 2 }}/>
      <LoginButton disabled={!waitstaffPassword} onClick={handleWaitstaffPasswordSubmit} sx={{ mb: 2 }}>Save</LoginButton>

      <CssTextField type="password" label="Add new kitchenstaff password" onChange={handlekitchenstaffPasswordChange}
          sx={{ mb: 2 }}/>
      <LoginButton disabled={!kitchenstaffPassword} onClick={handleKitchenstaffPasswordSubmit} sx={{ mb: 2 }}>Save</LoginButton>

      <LoginButton sx={{ mt: 8, mb: 2 }} onClick={handleResetSubmit} >Reset management</LoginButton>
      <LoginButton sx={{ mb : 2 }} onClick={handleLogoutSubmit}>Logout</LoginButton>

    </Box>
  
  )

}
export default Settings;
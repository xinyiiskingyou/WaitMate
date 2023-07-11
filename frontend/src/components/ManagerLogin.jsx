import React from 'react';
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { styled } from '@mui/material/styles';
import {Link, useParams} from 'react-router-dom';
import { Box, Button, Grid, Typography, TextField, Container, Popover } from '@mui/material';
import { pink } from '@mui/material/colors';

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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      <Box container direction='column' justifyContent='center'>
        <Typography variant="h5" sx={{ mb: 2 }}>Manager Login</Typography>
        <CssTextField fullWidth required label="Email"
          sx={{ mb: 1 }}/>
        <CssTextField  type="password" fullWidth required label="Password"
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
            <Link to='/Menu'>
              <LoginButton variant="contained"> Login</LoginButton>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </Container>

  
  )
}

export default ManagerLogin;

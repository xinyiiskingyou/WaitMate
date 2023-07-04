import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import {Link} from 'react-router-dom';
// import Menu from './Menu';

const Staff = () => {
  const buttonStyle = {
    width: '200px',
    height: '100px',
    fontSize: '18px'
  };
  const headingStyle = {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px'
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={"100vh"}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <h2 style={headingStyle}>Select Staff Type</h2>
        </Grid>
        <Grid item xs={4} textAlign={'right'}>
          <Link to="/ManagerLogin">
            <Button variant='contained' color='primary' style={buttonStyle}>
              Manager
            </Button>
            </Link>
        </Grid>
        <Grid item xs={4} textAlign={'center'}>
          <Link to="/Kitchenlist">
            <Button variant='contained' color='primary' style={buttonStyle}>
              Kitchen Staff
            </Button>
          </Link>
        </Grid>
        <Grid item xs={4} textAlign={'left'}>
          <Link to="/waitstaff">
          <Button variant='contained' color='primary' style={buttonStyle}>
            Wait Staff
          </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Staff;

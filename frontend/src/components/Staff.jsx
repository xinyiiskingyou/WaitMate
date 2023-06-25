import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';

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
          <Button variant='contained' color='primary' style={buttonStyle}>
            Manager
          </Button>
        </Grid>
        <Grid item xs={4} textAlign={'center'}>
          <Button variant='contained' color='primary' style={buttonStyle}>
            Kitchen Staff
          </Button>
        </Grid>
        <Grid item xs={4} textAlign={'left'}>
          <Button variant='contained' color='primary' style={buttonStyle}>
            Wait Staff
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Staff;

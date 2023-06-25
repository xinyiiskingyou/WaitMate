import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';

const CustomerMenuPage = () => {
  const buttonStyle = {
    width: '400px',
    height: '500px',
    fontSize: '50px'
  };
  const headingStyle = {
    textAlign: 'center',
    fontSize: '30px',
    marginBottom: '20px'
  };
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={"100vh"}
    >
      <Grid container spacing={-20} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={4}>
          <h2 style={headingStyle}>Menu</h2>
        </Grid>
        <Grid container spacing={0} justifyContent="space-between" alignContent="center">
            <Grid item xs={5.5} textAlign={'right'}>
                <Button variant='contained' color='primary' style={buttonStyle}>
                    Browse Menu
                </Button>      
            </Grid>
            <Grid item xs={5.5} textAlign={'left'}>
                <Button variant='contained' color='primary' style={buttonStyle}>
                    View Order Summary           
                </Button>      
            </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerMenuPage;

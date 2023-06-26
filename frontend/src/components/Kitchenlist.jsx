import React from 'react';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';

const CustomerMain = () => {
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
      <Grid container spacing={2} alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12}>
          <h2 style={headingStyle}>Order List</h2>
        </Grid>
        <Grid container spacing={2} justifyContent="center" alignContent="center">
            <Box
                width={1200}
                height={600}
                border={1}
                borderColor="primary.main"
                borderRadius={4}
                >
            </Box>
        </Grid>
      </Grid>   
    </Box>
  );
};

export default CustomerMain;

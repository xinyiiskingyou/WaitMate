import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const Staff = () => {
  return (
<Container maxWidth="sm">
  <Box sx={{ width: 800, height: 1000 }} alignItems="center" marginTop="100px">
    <Grid container spacing={40} direction="row">
      <Grid item xs={12} sm={4}>
        <Button variant="contained" color="primary">
          <Typography variant="h4">Manager</Typography>
        </Button>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Button variant="outlined" color="primary">
          <Typography variant="h4">Kitchen Staff</Typography>
        </Button>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Button variant="outlined" color="primary">
          <Typography variant="h4">Wait Staff</Typography>
        </Button>
      </Grid>
    </Grid>
  </Box>
</Container>

  );
};

export default Staff;

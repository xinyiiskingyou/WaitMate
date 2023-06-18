import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


const MyComponent = () => {
  return (
    <Container>
      <Typography variant="h3" component="h1" align="center">
        Customer Board
      </Typography>
      <Grid container spacing={2} maxWidth="sm">
        <Grid item xs={12} sm={4}>
          <Button variant="contained" color="primary">
            Dine in
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" color="primary">
            Takeaway
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" color="primary">
            Button 3
          </Button>
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="secondary"
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
        }}
      >
        Staff Login
      </Button>
    </Container>
  );
};

export default MyComponent;

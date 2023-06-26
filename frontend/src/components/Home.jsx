import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {Link} from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h3" component="h1" align="center">
          Customer Board
        </Typography>
        <Typography variant="h6" align="center">Please select your dining option</Typography>
      </Box>
      <Box sx={{ width: 500, height: 1000 }} display="flex" flexDirection="column" alignItems="center" marginTop="100px">
        <Box mb={10}>
          <Grid item xs={12} sm={8}>
            <Button variant="contained" color="primary">
              <Typography variant="h4">Dine in</Typography>
            </Button>
          </Grid>
        </Box>

      </Box>
      <Link to="/staff">
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
      </Link>
    </Container>

  );
};

export default Home;
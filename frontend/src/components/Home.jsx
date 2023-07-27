import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import SelectTable from './Tables/SelectTable';
import welcome from '../assets/welcome.png'
import manage from '../assets/management.png'

const Home = () => {
  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h4" component="h1" align="center" style={{marginTop: '8vh', fontWeight: "bold"}}>
          <img 
            src={welcome} 
            alt="WIcon" 
            style={{
              width: '20vw',
              height: '37vh',
              verticalAlign: 'middle',
            }}/>
            <br />
            <span style={{ marginRight: '1vw' }}>
              Customer Board <br />
            </span>
        </Typography>
          
        <Typography variant="h6" align="center">Please select your table number.</Typography>
        
        <Grid item xs={12} sm={8}>
          <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <SelectTable />
              </div>
              </Box> 
          </Grid>
        </Grid>
      </Box>

      <Link to="/staff">  
        <Button
          variant="contained"
          color="secondary"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            fontWeight: "bolder",
            background: "#FFA0A0"
          }}
        >
          <img 
            src={manage} 
            alt="ManageIcon" 
            style={{
              width: '6vh',
              height: '6vh',
              borderRadius: 3,
              marginRight: '0.5vw'
            }}/>
          Staff Login
        </Button>
      </Link>
    </Container>
  );
};

export default Home;

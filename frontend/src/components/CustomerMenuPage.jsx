import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import {Link, useParams} from 'react-router-dom';

const CustomerMenuPage = () => {
  const id = useParams();
  const orderLink = `/Cart/${id.id}` 
  const browseLink = `/Browse/${id.id}` 

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
              <Link to={browseLink}>
                <Button variant='contained' color='primary' style={buttonStyle}>
                    Browse Menu
                </Button>  
              </Link>    
            </Grid>
            <Grid item xs={5.5} textAlign={'left'}>
              <Link to={orderLink}>
                <Button variant='contained' color='primary' style={buttonStyle}>
                    View Order Summary           
                </Button>    
              </Link>  
            </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerMenuPage;

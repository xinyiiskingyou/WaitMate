import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import {Link, useParams} from 'react-router-dom';

const CustomerMain = () => {
  const id = useParams();
  const menuLink = `/CustomerMenuPage/${id.id}` 

  const buttonStyle = {
    width: '300px',
    height: '500px',
    fontSize: '40px'
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
          <h2 style={headingStyle}>Customer Board</h2>
        </Grid>
        <Grid container spacing={0} justifyContent="space-between" alignContent="center">
            <Grid item xs={3}>
                <Link to={menuLink}>
                    <Button variant='contained' color='primary' style={buttonStyle}>
                        Menu
                    </Button>
                </Link>
            </Grid>
            <Grid item xs={3}>
                <Button variant='contained' color='primary' style={buttonStyle}>
                    Too Bored?
                </Button>            
                </Grid>
            <Grid item xs={3}>
                <Button variant='contained' color='primary' style={buttonStyle}>
                    Meme of the Week
                </Button>
            </Grid>
            <Grid item xs={3}>
                <Button variant='contained' color='primary' style={buttonStyle}>
                    Require Assistance
                </Button>
            </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerMain;

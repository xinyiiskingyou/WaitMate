import React from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import {Link} from 'react-router-dom';
import worker from '../../assets/worker.png'
import chef from '../../assets/chef.png'
import manager from '../../assets/manager.png'

const Staff = () => {

  const buttonStyle = {
    width: '18vw',
    height: '50vh',
    fontSize: '18px',
    background: '#FFFFFF',
    color: 'black',
    border: "10px solid #FFFFFF",
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '3vw',
    marginTop: '10vh',
    marginBottom: '10vh',
  };

  return (
    <Box
      display="flex"
      height={"100vh"}
      flexDirection="column"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2 style={headingStyle}>Select Staff Type</h2>
        </Grid>
        <Grid item xs={4} textAlign={'right'}>
          <Link to="/manager/login">
            <Button variant='contained' color='primary' style={buttonStyle}>
              <Grid container direction="column" alignItems="center" spacing={1}>
                <Grid item>
                  <img src={manager} alt="managerIcon" style={{
                    width: '14vw',
                    height: '25vh',
                  }}/>
                </Grid>
                <Grid item>
                  <Typography sx={{ fontSize: '1.4vw' }}>
                    <b>Manager</b>
                  </Typography>
                </Grid>
              </Grid>
            </Button>
          </Link>
        </Grid>
        <Grid item xs={4} textAlign={'center'}>
          <Link to="/kitchenstaff/login">
          <Button variant='contained' color='primary' style={buttonStyle}>
            <Grid container direction="column" alignItems="center" spacing={1}>
              <Grid item>
                <img src={chef} alt="ChefIcon" style={{
                  width: '14vw',
                  height: '25vh',
                }}/>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '1.4vw' }}>
                  <b>Kitchen Staff</b>
                </Typography>
              </Grid>
            </Grid>
            </Button>
          </Link>
        </Grid>
        <Grid item xs={4} textAlign={'left'}>
          <Link to="/waitstaff/login">
          <Button variant='contained' color='primary' style={buttonStyle}>
            <Grid container direction="column" alignItems="center" spacing={1}>
              <Grid item>
                <img src={worker} alt="WorkerIcon" style={{
                  width: '14vw',
                  height: '25vh',
                }}/>
              </Grid>
              <Grid item>
                <Typography sx={{ fontSize: '1.4vw' }}>
                  <b>Wait staff</b>
                </Typography>
              </Grid>
            </Grid>
          </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Staff;

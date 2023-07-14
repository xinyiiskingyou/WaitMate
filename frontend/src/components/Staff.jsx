import React from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import {Link} from 'react-router-dom';
import worker from '../assets/worker.png'
import chef from '../assets/chef.png'
import manager from '../assets/manager.png'
import WestIcon from '@mui/icons-material/West';
import Container from '@mui/material/Container';

const Staff = () => {

  const buttonStyle = {
    width: '18vw',
    height: '50vh',
    fontSize: '18px',
    background: 'transparent',
    color: 'black',
    border: "10px solid #FFA0A0",
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '3vw',
    marginTop: '10vh',
    marginBottom: '10vh',
  };

  return (
    <Container>
    <Grid container direction="column" spacing={2}>
      <Grid item xs={2}>
      <Box
        sx={{ 
          margin: 2, 
          mt: 4, 
          borderRadius: 2, 
          height: '100%',
          display:"flex",
          flexDirection:"column"
        }}>

        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Link to="/">
              <Button              
                sx={{ 
                  border: 5,
                  borderColor: '#FFA0A0',
                  borderRadius: 2,
                  color: 'black' 
                }}>
                <WestIcon/>
              </Button>
            </Link>
          </Grid>
          
          <Grid item xs={8}>
            <Typography 
            variant="h3" 
            component="h1" 
            align="center"
            noWrap
            fontWeight="bold"
            >
              Select Staff Type
            </Typography>
          </Grid>

        </Grid>
      </Box>
    </Grid>
        <Grid item xs={4} textAlign={'center'} justifycontent="center"  alignItems="center">
          <Link to="/menu">
            <Button variant='contained' color='primary' style={buttonStyle}>
              <Grid container direction="column" justifycontent="center" alignItems="center" spacing={1}>
                <Grid item>
                  <img src={manager} alt="managerIcon" style={{
                    width: '12vw',
                    height: '22vh',
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
        {/* </Grid>
        <Grid item xs={4} textAlign={'center'} justifycontent="center"  alignItems="center"> */}
          <Link to="/Kitchenlist">
          <Button variant='contained' color='primary' style={buttonStyle}>
            <Grid container direction="column" justifycontent="center" alignItems="center" spacing={1}>
              <Grid item>
                <img src={chef} alt="ChefIcon" style={{
                  width: '12vw',
                  height: '22vh',
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
        {/* </Grid>
        <Grid item xs={4} textAlign={'left'} justifycontent="center"  alignItems="center"> */}
          <Link to="/waitstaff">
          <Button variant='contained' color='primary' style={buttonStyle}>
            <Grid container direction="column" justifycontent="center" alignItems="center" spacing={1}>
              <Grid item>
                <img src={worker} alt="WorkerIcon" style={{
                  width: '12vw',
                  height: '22vh',
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
  </Container>
  )
}

export default Staff;

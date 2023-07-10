import React from 'react';
import { styled } from '@mui/material/styles';
import { Link, useParams} from 'react-router-dom';
import { Box, Button, Grid, Typography, TextField, Container } from '@mui/material';
import { pink } from '@mui/material/colors';
const StaffLogin = () => {
  return (
    <Container component="main" maxWidth="sm">
    <Box 
      sx={{ 
        marginTop: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Box container direction='column' justifyContent='center'>
        <Typography variant="h5" sx={{ mb: 2 }}>Staff Login</Typography>
        <CssTextField fullWidth required label="Email"
          sx={{ mb: 1 }}/>
        <CssTextField  type="password" fullWidth required label="Password"
          sx={{ mb: 2 }}/>
        <Grid container>
          <Grid item> 
            <Link to='/Menu'>
              <LoginButton variant="contained"> Login</LoginButton>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </Container>
  
  )

}
export default StaffLogin;

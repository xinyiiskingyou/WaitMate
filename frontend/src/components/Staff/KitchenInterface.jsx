import React from "react"
import { Link } from 'react-router-dom';
import { Grid, Box, Button, Typography, Container } from "@mui/material";
import WestIcon from '@mui/icons-material/West';
import { handleLogoutSubmit } from '../../auth.js';
import ListAllOrder from "../Orders/ListAllOrder.jsx";

const logoutbuttonStyle = { 
  border: '4px solid #FFFFFF', 
  height: '7vh', 
  width: '12vw',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#FFFFFF",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
}

const KitchenInterface = () => {
  return (
    <Container>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={2}>
          <Box sx={{ 
            margin: 2, 
            mt: 4, 
            borderRadius: 2, 
            height: '100%',
            display:"flex",
            flexDirection:"column",
          }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Link to="/">
                  <Button              
                    sx={{ 
                      border: 5,
                      borderColor: '#FFFFFF',
                      background: "#FFFFFF",
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
                  Order List
                </Typography>
              </Grid>
          
              <Grid item xs={2}>
                <Button variant="contained" color="primary" style={logoutbuttonStyle} onClick={handleLogoutSubmit}>
                  Logout
                </Button>
              </Grid>
          </Grid>
        </Box>
      </Grid>
      <ListAllOrder />
    </Grid>
  </Container>
  );
}

export default KitchenInterface;
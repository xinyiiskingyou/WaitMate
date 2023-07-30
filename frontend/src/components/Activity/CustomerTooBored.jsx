import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Button,
  Typography,
  Box,
  ThemeProvider,
  AppBar,
  Toolbar,
  createTheme
} from "@mui/material";
import WestIcon from '@mui/icons-material/West';
import WaitMate from "../../assets/WaitMate.png";
import SendNotification from "../Notifications/SendNotification";
import flippingcards from "../../assets/flippingcards.png";
import barbieleft from "../../assets/barbieleft.png";
import barbieright from "../../assets/barbieright.png";

const buttonStyle = { 
    border: '4px solid #FFFFFF', 
    textAlign: 'center', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '700px', 
    height: '300px', 
    fontSize: '20px',
    background: "#FFFFFF",
    color: 'black',
    fontWeight: "bolder",
    borderRadius: 6,
  }

const theme = createTheme({
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#FBDDDD",
            },
            "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "#FBDDDD",
              },
          },
        },
      },
    },
  });

const CustomerTooBored = () => {
    const id = useParams();
  return (
        <Container maxWidth="sm">
      <ThemeProvider theme={theme}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <img src={WaitMate} style={{ width: '200px', marginRight: '10px' }} />
            <div style={{ display: 'flex', marginLeft: '500px', alignItems: "flex-end", justifyContent: 'space-between', gap: "45px" }}>
            <Button style={buttonStyle} component={Link} to={`/browse/${id.id}`}>
                    Menu
                  </Button>
                  <Button style={buttonStyle} component={Link} to={`/customermeme/${id.id}`}>
                    Meme of the Week
                  </Button>
                  <Button style={buttonStyle} component={Link} to={`/toobored/${id.id}`}>
                    Too Bored?
                  </Button>
                  <SendNotification id={id.id}/>
                  </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </ThemeProvider>
    <Box flexGrow={1} p={2} justifyContent="flex-end" alignItems="flex-end">
          <Grid container columnGap={3} justifyContent="right" alignItems="right">
            <SendNotification id={id.id} />
          </Grid>
          </Box>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={8}>
          <Typography 
            variant="h4" 
            component="h1" 
            align="center"
            noWrap
            fontWeight="bold"
            >
            Too Bored?
          </Typography>
          </Grid>     
          <Grid item xs={8} justifyContent= 'center' alignItems= 'center' >
          <Button variant="contained" style={buttonStyle}>
          <img src={flippingcards} alt="flippingcards" style={{
          width: '20vw',
          height: '30vh',
        }}/>
        <img src={barbieleft} alt="barbieleft" style={{
          width: '7vw',
          height: '35vh',
        }}/>
        <div>
            Flipping Cards
        </div>
          </Button>
          </Grid>     
        </Grid>
    </Container>
  );
}

export default CustomerTooBored;

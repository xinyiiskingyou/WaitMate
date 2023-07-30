import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Button,
  Typography,
  createTheme
} from "@mui/material";
import WestIcon from '@mui/icons-material/West';
import flippingcards from "../../assets/flippingcards.png";
import barbieleft from "../../assets/barbieleft.png";
import barbieright from "../../assets/barbieright.png";
import CustomerInterface from "../UserInterface/CustomerInterface";

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

  return (
    <Container maxWidth="sm">
      <CustomerInterface />
      <Grid container direction="column" spacing={2}>
        <Grid item xs={8}>
          <Typography 
            variant="h4" 
            component="h1" 
            align="center"
            noWrap
            fontWeight="bold"
            marginTop="7vw"
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

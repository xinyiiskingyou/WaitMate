import React from "react";
import { Carousel } from 'react-material-ui-carousel';
import {
  Container,
  Paper,
  Button,
  Grid,
  Typography,
  createTheme
} from "@mui/material";
import CustomerInterface from "../UserInterface/CustomerInterface";
import MemeCarousel from "../Meme/MemeCarousel";

const CustomerMeme = () => {
  
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
            Meme of the Week
          </Typography>
        </Grid>
        </Grid>
        <div>
          <MemeCarousel/>
        </div>
    </Container>
  );
}

export default CustomerMeme;
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

const items = [
    {
      name: 'Meme 1',
      description: 'Description for Meme 1',
    },
    {
      name: 'Meme 2',
      description: 'Description for Meme 2',
    },
    {
      name: 'Meme 3',
      description: 'Description for Meme 3',
    },
    {
      name: 'Meme 4',
      description: 'Description for Meme 4',
    }
  ];
  
  const MemeCarousel = () => {
    return (
      <Carousel>
        {items.map((item, index) => (
          <Paper key={index}>
            <h2>{item.name}</h2>
            <p>{item.description}</p>
            <Button variant="contained" color="primary">
              Like
            </Button>
          </Paper>
        ))}
      </Carousel>
    );
  }

export default MemeCarousel;
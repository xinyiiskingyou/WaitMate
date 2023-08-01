import React, { useState } from "react";
import { Box, Container, Card, IconButton, Pagination, PaginationItem, Typography } from "@mui/material";
import heart from "../../assets/heart.png";
import barbiememe from "../../assets/barbiememe.png";
import CustomerInterface from "../UserInterface/CustomerInterface";

const CustomerMeme = () => {
  const [like, setLike] = useState(false);

  const handleLikeButtonClick = () => {
    setLike(true);
  };
    const payload = {
      like: like
    };
    try {
      const response = fetch('http://localhost:8000/meme/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        handleLikeButtonClick(like);
      } else {
        const errorResponse = response.json();
        console.error(errorResponse);

      }
    } catch (error) {
      console.error(error);
    }

  return (
    <Container maxWidth="sm">
    <CustomerInterface />
      {/* <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} style={{ gap: '10px' }}>
      </Box> */}

      <div style={{ position: 'relative', marginTop: '2vh' }}>
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={10}>
          <Typography fontWeight="bold" variant="h4" component="h1">
            Meme of the Week
          </Typography>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center" marginTop={10}>
            <img src={barbiememe} alt="barbiememe" style={{
                width: '50vw',
                height: '80vh',
                ml: '10vh',
                mr: '10vh',
                justifyContent: 'center',
                alignContent: 'center'
              }}/>
        </Box>
       
        <Box position="relative">
          <IconButton
            onClick={handleLikeButtonClick}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "50%",
              fontSize: "12vh",
              position: "absolute",
              bottom: "10px", 
              right: "11px",
            }}
          >
            <img src={heart} alt="heart" style={{
              width: '1.5vw',
              height: '3vh',
              ml: '10vh',
              mr: '10vh',
              justifyContent: 'center',
              alignContent: 'center'
            }}/>
          </IconButton>
        </Box>
      </div>
      </Container>
  );
}

export default CustomerMeme;

import React, { useState } from "react";
import {
  CardMedia,
  Paper,
  Button,
  Typography
} from "@mui/material";
import CustomerInterface from "../UserInterface/CustomerInterface";
import ViewMemes from "./ViewMemes";
import LikeMeme from "./LikeMeme";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const buttonStyle = {
  borderRadius: '50%', 
  background: 'white', 
  color: 'black', 
  fontSize: '6vh'
}

const CustomerMeme = () => {
  const { memes } = ViewMemes();

  const totalPages = memes.length;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePrev = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleNext = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : totalPages
    );
  };

  const currentMemes = memes.slice(
    (currentPage - 1),
    currentPage
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: 'fixed',
        left: '18vw',
        top: '8vh'
      }}
    >
      <CustomerInterface />
      <Typography
        variant="h5"
        style={{
          position: "fixed",
          top: "10vh",
          left: "45vw",
          color: "black",
          fontWeight: 'bolder',
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        Meme of the Week
      </Typography>
      <Button onClick={handlePrev}><KeyboardArrowLeftIcon style={{...buttonStyle, marginRight: '4vw'}}/></Button>
      <Paper elevation={10} sx={{ width: '56vw', height: '85vh' }}>
        {currentMemes.map((meme) => (
          <div key={meme.memeID} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}>
            <Typography variant="h6" style={{
              position: "fixed",
              marginTop: '75vh',
              left: "50vw",
              color: "black",
            }}>
              Meme {currentPage}
            </Typography>
            <CardMedia
              component="img"
              style={{ maxWidth: "500px", maxHeight: "800px", minWidth: '300px', minHeight: '300px'}}
              image={meme.img_url}
              alt={meme.filename}
            />
            <LikeMeme filename={meme.filename} />
          </div>
        ))}
      </Paper>
      <Button onClick={handleNext}><KeyboardArrowRightIcon style={{...buttonStyle, marginLeft: '4vw'}}/></Button>
    </div>
  );
};

export default CustomerMeme;

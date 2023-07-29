import React, { useState } from "react";
import { Box, Grid } from '@mui/material';
import styled from "@mui/system/styled";
import { grey,pink } from '@mui/material/colors';

const mainPink = pink[400]
const CardFace = styled(Box)(({theme}) => ({
  position: 'absolute',
  transition: 'all ease-in 1s',
  transform: `rotateY(90deg)`,
}));


const CardBack = styled(Box)(({theme}) => ({
  width: 180,
  height: 180,
  transform: `rotateY(0deg)`,
  transitionDelay: 0.2,
  border: `3px inset ${mainPink}`,
  borderRadius: 5,

  '&:hover': {
    border: `3px dashed #fff`,
    borderRadius: 5

  },
}));

function MemoryCard({ card, handleChoice, flipped, disable }) {
  const handleClick = () => {
    if (!disable) {
      handleChoice(card)
    }
  } 

  return(
    
    <Grid item  >
      <Grid className={flipped ? "flipped" : ""}>
        {flipped ?           
          <CardBack>
            <img src={card.src} width="180" height="180" alt='front' xs={{transform: 90}}/>
          </CardBack> :         
          <CardFace>
            <img src={card.src} width="180" height="180" alt='front' xs={{transform: 90}}/>
          </CardFace>
        }

        {flipped ?           
          <CardFace>
            <img src='/img/memory_bg.jpg' onClick={handleClick} width="180" height="180" alt='back'  xs={{transform: 0}}/>
          </CardFace> :         
          <CardBack>
            <img src='/img/memory_bg.jpg' onClick={handleClick} width="180" height="180" alt='back'  xs={{transform: 0}}/>
          </CardBack>
        }

        {/* <Box>
          <img src='/img/memory_bg.jpg' onClick={handleClick} width="200" height="200" alt='back'  xs={{transform: 0}}/>
        </Box> */}

      </Grid>
    </Grid>
  )
}
export default MemoryCard;

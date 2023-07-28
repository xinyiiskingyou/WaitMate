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
  transform: `rotateY(0deg)`,
  transitionDelay: 0.2,
  border: `2px solid ${mainPink}`,
  borderRadius: 2,

  '&:hover': {
    border: `2px dashed #fff`,
    borderRadius: 2

  },
}));

function MemoryCard({ card, handleChoice, flipped, disable }) {
  const handleClick = () => {
    if (!disable) {
      handleChoice(card)
    }
  } 

  return(
    
    <Grid item xs={3}>
      <Grid className={flipped ? "flipped" : ""}>
        {flipped ?           
          <CardBack>
            <img src={card.src} width="200" height="200" alt='front' xs={{transform: 90}}/>
          </CardBack> :         
          <CardFace>
            <img src={card.src} width="200" height="200" alt='front' xs={{transform: 90}}/>
          </CardFace>
        }

        {flipped ?           
          <CardFace>
            <img src='/img/memory_bg.jpg' onClick={handleClick} width="200" height="200" alt='back'  xs={{transform: 0}}/>
          </CardFace> :         
          <CardBack>
            <img src='/img/memory_bg.jpg' onClick={handleClick} width="200" height="200" alt='back'  xs={{transform: 0}}/>
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

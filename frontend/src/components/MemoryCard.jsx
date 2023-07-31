import React, { useState } from "react";
import { Box, Grid } from '@mui/material';
import styled from "@mui/system/styled";
import { grey, pink, yellow } from '@mui/material/colors';

const mainPink = pink[400]
const CardFace = styled(Box)(({theme}) => ({
  position: 'absolute',
  transition: 'all ease-in 1s',
  transform: `rotateY(90deg)`,
  borderRadius: 2,

}));


const CardBack = styled(Box)(({theme}) => ({
  width: 170,
  height: 170,
  transform: `rotateY(0deg)`,
  transitionDelay: 0.2,
  border: `4px outset ${mainPink}`,
  borderRadius: 5,
  backgroundColor: grey[200],

  // '&:hover': {
  //   border: `3px dashed #fff`,
  //   borderRadius: 5

  // },
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
            <img src={card.src} width="170" height="170" alt='front' xs={{transform: 90, borderRadius: '5'}}/>
          </CardBack> :         
          <CardFace>
            <img src={card.src} width="170" height="170" alt='front' xs={{transform: 90, borderRadius: 5}}/>
          </CardFace>
        }

        {flipped ?           
          <CardFace>
            <img src='/img/memory_bg.jpg' onClick={handleClick} width="170" height="170" alt='back'  xs={{transform: 0, borderRadius: 10}}/>
          </CardFace> :         
          <CardBack>
            <img src='/img/memory_bg.jpg' onClick={handleClick} width="170" height="170" alt='back'  xs={{transform: 0, borderRadius: 10}}/>
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

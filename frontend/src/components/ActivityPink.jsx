import { useState } from "react";
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ArrowDropUpRounded, ArrowDropDownRounded, CloseRounded, MinimizeRounded } from '@mui/icons-material';
import { pink, grey, yellow } from '@mui/material/colors';
import { GameButton, HeaderButtons } from './ActivityButtons'
import styled from "@mui/system/styled";

export const ControlGameButton = styled(GameButton)(({ }) => ({
  height: '35px',
  maxWidth: '40px',
  minWidth: '40px',
}));

function ActivityPink({backLink}) {
  const [gamePink, setGamePink] = useState(0)

  const handlePinkClickUp = () => {
    if (gamePink === 900) {
      return
    }
    setGamePink(gamePink => gamePink += 100)
  }

  const handlePinkClickDown = () => {
    if (gamePink === 0) {
      return
    }
    setGamePink(gamePink => gamePink -= 100)
  }

  return (
    <Box display='flex' 
      sx={{ 
        width: '90%', 
        height: '20vh', 
        backgroundColor: yellow[50], 
        border: `8px groove ${grey[50]}`, 
        borderRadius: 4, 
        flexDirection: 'column'
      }}>
      <Box display="flex" justifyContent="space-between" alignItems="center"
        sx={{ 
          borderRadius: '8px 8px 1px 1px',
          borderBottom: `2px solid ${pink[300]}`,
          p: '4px',
          boxShadow: `1px 3px 4px ${pink[300]}`,
          background: `linear-gradient(to right, ${pink[600]}, ${pink[200]})` 
        }}>
        <Typography color='white' 
          sx={{ 
            ml: 1, fontFamily: 'cursive' 
          }}>
          create your pink
        </Typography>

        <Box>
          <HeaderButtons sx={{ pb: 1 }}>
            <MinimizeRounded fontSize='small' />
          </HeaderButtons>
          <HeaderButtons component={Link} to={backLink}
            sx={{ 
              mr: '9px',
              ml: '6px',
            }}>
            <CloseRounded fontSize='small'/>
          </HeaderButtons>
        </Box>
      </Box> 

      <Box 
        display='flex' 
        alignItems='center' 
        height='100%' 
        justifyContent='space-around'>
        <Box 
          sx={{ 
            width: '60%', 
            height: '75%', 
            backgroundColor: pink[`${gamePink}`], 
            mx: 2, 
            borderRadius: 2
          }}>
        </Box>  
        <Box display='flex' flexDirection='column' sx={{ mr : 2 }}>
          <ControlGameButton onClick={handlePinkClickUp}>
            <ArrowDropUpRounded sx={{ fontSize: 60 }} />
          </ControlGameButton>
          <ControlGameButton onClick={handlePinkClickDown}    
            sx={{ mt: 1 }}>
            <ArrowDropDownRounded sx={{ fontSize: 60 }}/>
          </ControlGameButton>  
        </Box>
      </Box>
    </Box>   
  )
}

export default ActivityPink;

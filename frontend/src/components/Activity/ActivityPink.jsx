import { useState } from "react";
import { Link } from 'react-router-dom';
import { Box, Typography, Slider } from '@mui/material';
import { ArrowDropUpRounded, ArrowDropDownRounded, CloseRounded, MinimizeRounded } from '@mui/icons-material';
import { pink, grey, yellow, blue } from '@mui/material/colors';
import { GameButton, HeaderButtons } from './ActivityButtons'
import styled from "@mui/system/styled";

export const ControlGameButton = styled(GameButton)(() => ({
  height: '30px',
  maxWidth: '35px',
  minWidth: '35px',
}));

export const GameSlider = styled(Slider)(() => ({
  height: 10,

  '& .MuiSlider-rail': {
    borderRadius: 3,
    border: `3px solid ${pink[200]}`,
    // borderColor: grey[400],
  },
  '& .MuiSlider-track': {
    borderRadius: 3,
    border: `3px solid ${pink[200]}`,
    // borderColor: grey[400],
  },
  '& .MuiSlider-thumb': {
    borderRadius: 2,
    boxShadow: 'none',
    height: 20,
    border: `2px solid ${pink[200]}`,

    // border: '2px solid #0A0',
    // borderColor: pink[200],
   },
}));

function ActivityPink({backLink, changeBackground}) {
  const [gamePink, setGamePink] = useState(0)
  const [gameGreen, setGameGreen] = useState(0)
  const [gameBlue, setGameBlue] = useState(0)

  const getPink = () => {
    let color = pink[`${gamePink}`]
    if (gamePink === 0) {
      return color
    }
    // console.log(color)
    // console.log(color.slice(0, 3) + String(gameGreen) + color.slice(4,5))

    return color.slice(0, 3) + String(gameGreen) + color.slice(4,5) + String(gameBlue) + color.slice(6);
  }

  const handleGameClick = () => {
    if (gamePink === 0) {
      changeBackground(pink[300])
    } else {
      changeBackground(getPink())
    }
  }

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

  const handleBlueClick = () => {
    if (gameBlue === 9) {
      setGameBlue(0)
      return
    }
    setGameBlue(gameBlue => gameBlue += 1)
  }

  const handleGreenClick = () => {
    if (gameGreen === 9) {
      setGameBlue(0)
      return
    }
    setGameGreen(gameGreen => gameGreen += 1)
  }

  const handlePinkSlide = (event, newValue) => {
    setGamePink(newValue * 100) 
  }

  const handleBlueSlide = (event, newValue) => {
    setGameBlue(newValue) 
  }

  const handleGreenSlide = (event, newValue) => {
    setGameGreen(newValue) 
  }

  return (
    <Box display='flex' 
      sx={{ 
        width: '90%', 
        height: '30vh', 
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
        flexDirection="column"
        justifyContent='center'>
        <GameButton onClick={handleGameClick}
          sx={{ 
            width: '80%', 
            height: '40%', 
            backgroundColor: getPink(), 
            mx: 2, 
            borderRadius: 1,
            mb: 1
          }}>
        </GameButton>  
        <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' >
        <Box width='110px'>
          <GameSlider size="small" sx={{ color: blue[300], borderRadius: 0, py: 1.5 }} step={1} min={0} max={9} value={gameBlue} onChange={handleBlueSlide}></GameSlider>
          <GameSlider size="small" sx={{ color: yellow[300], borderRadius: 0, py: 1.5  }} step={1} min={0} max={9} value={gameGreen} onChange={handleGreenSlide}></GameSlider>
          {/* <Slider size="small" step={1} min={0} max={9} onChange={handlePinkSlide}></Slider> */}
        </Box>
        
        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'  sx={{ ml : 2 }}> 
          <ControlGameButton onClick={handlePinkClickUp}>
            <ArrowDropUpRounded sx={{ fontSize: 50 }} />
          </ControlGameButton>
          <ControlGameButton onClick={handlePinkClickDown}    
            sx={{ mt: 1 }}>
            <ArrowDropDownRounded sx={{ fontSize: 50 }}/>
          </ControlGameButton> 
        </Box>
        </Box> {/* 
          <ControlGameButton onClick={handleBlueClick}    
            sx={{ mt: 1, backgroundColor: '#00a' }}>
            <ArrowDropDownRounded sx={{ fontSize: 60 }}/>
          </ControlGameButton>  
          <ControlGameButton onClick={handleGreenClick}    
            sx={{ mt: 1, backgroundColor: '#0a0' }}>
            <ArrowDropDownRounded sx={{ fontSize: 60 }}/>
          </ControlGameButton>   */}
      </Box>
    </Box>   
  )
}

export default ActivityPink;

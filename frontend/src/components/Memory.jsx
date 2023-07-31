import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Box, Grid, Button, Typography, Dialog, LinearProgress, linearProgressClasses, IconButton } from '@mui/material';
import styled from "@mui/system/styled";
import { ArrowDropUpRounded, ArrowDropDownRounded } from '@mui/icons-material';
import MemoryCard from './MemoryCard';
import { pink, grey, yellow } from '@mui/material/colors';
import logo from '../assets/WaitMate.png'

const usedPink = pink[300]

const GameButton = styled(Button)(({ }) => ({
  color: "#FFFFFF",
  borderRadius: 4,
  border: `4px outset ${pink[300]}`,

  backgroundColor: pink[300],
  '&:hover': {
    backgroundColor: pink[200],
  },
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 30,
  borderRadius: 5,
  border: `4px outset ${pink[300]}`,

  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: grey[200],
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: usedPink,
  },
}));

function SimpleDialog(props) {
  const { onClose, open, title, text } = props;

  const handleClick = async () => {
    onClose()
  }

  return (
    <Dialog open={open} PaperProps={{
      style: { backgroundColor: 'transparent' }   }}>
      <Box 
        sx={{    
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: pink[100],
        border: `6px groove ${grey[50]}`,
        borderRadius: 4,

      }}>
        <Box fullWidth display="flex" justifyContent="flex-end" direction='row'
          sx={{ 
            borderRadius: '10px 10px 1px 1px',
            borderBottom: `2px solid ${yellow[300]}`,
            p: '4px',
            background: yellow[100] }}>
          <Button  
            size="small" onClick={handleClick}         
            sx={{ 
              maxWidth: '25px',
              maxHeight: '25px', 
              minWidth: '25px', 
              minHeight: '25px',
              border: '2px inset #0A0',
              borderColor: 'white',
              borderRadius: 2,
              mr: '10px',
              ml: '4px',
              fontWeight: 'bold',
              color: 'black',
              backgroundColor: pink[100],
            }}>
            X
          </Button>
        </Box>
        <Box display='flex' alignItems="center" sx={{ flexDirection: 'column'}}>
          <Typography variant="h5" sx={{ pt: 2, color: yellow[100], textShadow: `-3px 2px 0 ${pink[200]}`, fontWeight: 'bold',}}>{title}</Typography>
          <Typography sx={{ px: 5, py: 2, color: 'white', fontWeight: 'bold'}}>{text}</Typography>
          {/* <img width='100px' src="/img/memory_1.png"/> */}
          <Button onClick={handleClick} 
            sx={{ 
              maxHeight: '25px', 
              minHeight: '25px',
              border: '2px outset #0A0',
              borderColor: 'white',
              borderRadius: 1,
              fontWeight: 'bold',
              color: 'black',
              backgroundColor: yellow[100],
              mb: 2
            }}>
            Okay
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

const cardImages = [
  {src: "/img/memory_1.png", matched: false},
  {src: "/img/memory_2.png", matched: false},
  {src: "/img/memory_3.png", matched: false},
  {src: "/img/memory_4.png", matched: false},
  {src: "/img/memory_5.png", matched: false},
  {src: "/img/memory_6.png", matched: false},
]

function Memory() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)

  const [firstCard, setFirstCard] = useState(null)
  const [secCard, setSecCard] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const [open, setOpen] = useState(false);
  const [gamePink, setGamePink] = useState(0)

  const id = useParams();
  const backLink = `/Browse/${id.id}` 

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random()}))
    setFirstCard(null)
    setSecCard(null)
    setWon(false)
    setLost(false)
    setCards(shuffledCards)
    setTurns(10)
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

  const handleChoice = (card) => {
    console.log(card.src)
    firstCard ? setSecCard(card) : setFirstCard(card)
  }

  const reset = () => {
    console.log(turns)
    setFirstCard(null)
    setSecCard(null)
    setTurns(turns => turns -= 1)
    setDisabled(false)
    if (turns === 1) {
      setLost(true)
    }

  }

  const handleWinClose = () => {
    setOpen(false);
  };

  const handleLoseClose = () => {
    setOpen(false);
    shuffleCards()
  };

  const checkWon = () => {
    var count = 0
    cards.map(card => {
      if (card.matched === true) {
        count += 1
      } 
    })

    if (count === 10) {
      setOpen(true)
      return true
    }
    return false
  }
  useEffect(() => {
    shuffleCards()
  }, [])

  useEffect(() => {
    if (firstCard && secCard) {
      setDisabled(true)
      if (firstCard.src === secCard.src) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === firstCard.src) {
              console.log('matched')
              setWon(checkWon())
              return {...card, matched:true}
            } else {
              return card
            }
          })
        })
        
        reset()
        
      } else {
        setTimeout(() => reset(), 1000)
      }
    }
  }, [firstCard, secCard])

  return(
    <Box 
      display='flex'
      justifyContent="center"
      sx={{ 
        flexDirection: 'row',
        alignItems: 'center', 
        py: 2
      }}>


      <Box display='flex' alignItems='center' justifyContent="space-between" sx={{ minWidth: '18%', minHeight: 670,  flexDirection: 'column', pr: 2}}>
        <Box display='flex' sx={{ width: '90%', height: '20vh', backgroundColor: yellow[50], border: `6px groove ${grey[50]}`, borderRadius: 4, flexDirection: 'column'}}>
        <Box display="flex" justifyContent="space-between" alignItems="center"
        sx={{ 
          borderRadius: '10px 10px 1px 1px',
          borderBottom: `2px solid ${pink[300]}`,
          p: '4px',
          boxShadow: `1px 3px 4px ${pink[300]}`,
          background: `linear-gradient(to right, ${pink[600]}, ${pink[200]})` }}>
        <Typography color='white' sx={{ml: 1, fontFamily: 'Arial',}}>Create your pink</Typography>
        <Box>
        <Button  
          size="small"            
          sx={{ 
            maxWidth: '25px',
            maxHeight: '25px', 
            minWidth: '25px', 
            minHeight: '25px',
            border: '2px inset #0A0',
            borderColor: 'white',
            borderRadius: 2,
            mx: '4px',
            color: 'black',
            backgroundColor: pink[100],
            fontWeight: 'bold',
          }}>
          _
        </Button>
        <Link to={backLink}>
          <Button  
            size="small"            
            sx={{ 
              maxWidth: '25px',
              maxHeight: '25px', 
              minWidth: '25px', 
              minHeight: '25px',
              border: '2px inset #0A0',
              borderColor: 'white',
              borderRadius: 2,
              mr: '10px',
              ml: '4px',
              fontWeight: 'bold',
              color: 'black',
              backgroundColor: pink[100],
            }}>
            X
          </Button>
        </Link>
        </Box>

      </Box> 
      <Box display='flex' alignItems='center' height="100%" justifyContent="space-around">
        <Box sx={{ width: '60%', height: '75%', backgroundColor: pink[`${gamePink}`], mx: 2, borderRadius: 2 }}></Box>  
        <Box display='flex' flexDirection='column' sx={{  mr: 2 }}>

          <GameButton onClick={handlePinkClickUp}
            sx={{ 
              height: '35px',
              maxWidth: '40px',
              minWidth: '40px',            
            }}><ArrowDropUpRounded sx={{ fontSize: 60 }} /></GameButton>
            <GameButton onClick={handlePinkClickDown}    
              sx={{ 
                height: '35px',
                maxWidth: '40px',
                minWidth: '40px',
                mt: 1,
              }}><ArrowDropDownRounded sx={{ fontSize: 60 }}/></GameButton>  
        </Box>
      </Box>
        </Box>
      {/* <Box display='flex' justifyContent='flex-start' alignItems='flex-start' sx={{width: '60%', height: '80px', border: `5px solid ${grey[50]}`, p: 1.5,  borderRadius: 1, backgroundColor: pink[50]}}>
        <Typography variant="h4" sx={{color: yellow[100], textShadow: `-3px 2px ${pink[200]}`, fontWeight: 'bold',}}>Excellent Work !</Typography>
      </Box> */}
      <Box          
        sx={{
          display: 'flex',
          justifyContent: "center",
          mt: 3
        }}>
        <img src='/img/barbie_1.png' width="184" height="400"/>
      </Box>


      <Box      
        sx={{
          display: 'flex',
          justifyContent: "center",
          pt: 4,
          // border: '3px outset #000000',
        }}>

        <img src={logo} />
      </Box>

      </Box>

    <Box display='flex' 
      sx={{
        backgroundColor: pink[100], 
        minWidth: 850,
        maxWidth: 850,
        flexDirection: 'column',
        border: `6px groove ${grey[50]}`,
        borderRadius: 4,

        }}>
      <Box display="flex" justifyContent="space-between" alignItems="center"
        sx={{ 
          borderRadius: '10px 10px 1px 1px',
          // borderBottom: `3px solid ${pink[500]}`,
          boxShadow: `1px 3px 4px ${pink[300]}`,
          p: '4px',
          background: `linear-gradient(to right, ${pink[600]}, ${pink[200]})` }}>
        <Typography color='white' sx={{ml: 1, fontFamily: 'Arial',}}>Memory Game</Typography>
        <Box>
        <Button  
          size="small"            
          sx={{ 
            maxWidth: '25px',
            maxHeight: '25px', 
            minWidth: '25px', 
            minHeight: '25px',
            border: '2px inset #0A0',
            borderColor: 'white',
            borderRadius: 2,
            mx: '4px',
            color: 'black',
            backgroundColor: pink[100],
            fontWeight: 'bold',
          }}>
          _
        </Button>
        <Link to={backLink}>
          <Button  
            size="small"            
            sx={{ 
              maxWidth: '25px',
              maxHeight: '25px', 
              minWidth: '25px', 
              minHeight: '25px',
              border: '2px inset #0A0',
              borderColor: 'white',
              borderRadius: 2,
              mr: '10px',
              ml: '4px',
              fontWeight: 'bold',
              color: 'black',
              backgroundColor: pink[100],
            }}>
            X
          </Button>
        </Link>
        </Box>


      </Box>

      <Box display='flex' direction='column'>
      
      <Box display='flex' alignItems="center" sx={{ width: 1000}}>
      <Grid container justifyContent="center" direction='row' spacing={2} sx={{ pt: 2,}}>
        {cards.map(card => (
          <MemoryCard 
            key={card.id} 
            card={card} 
            handleChoice={handleChoice}
            flipped={card === firstCard || card === secCard || card.matched}
            disable={disabled}
          />
        ))}
      </Grid>
      
      </Box>

      </Box>
      <Box display='flex' direction='column' justifyContent="space-between" alignItems="center">
        <div style={{ position: "relative", width: '35%', padding: '1em 2.8em'}}>
          <BorderLinearProgress variant="determinate" value={turns * 10} />
          <Typography sx={{ position: 'absolute', top: 22, color: 'white',
            left: "15%",
            }}>
            Barbie Meter
          </Typography>
        </div>
        <Box display='flex' sx={{ mr: 5.5}}>
        <GameButton  
          size="small"         
          sx={{ 
            border: `4px outset ${pink[300]}`,
            borderRadius: 1,
            color: 'white',
            px: 2,
            backgroundColor: pink[300],
            
          }}>
            <Typography onClick={shuffleCards} sx={{ textTransform: "none" }}>
              Restart
            </Typography>        
          </GameButton>
        </Box>
      </Box>
    </Box>
      <SimpleDialog
        open={open}
        onClose={handleWinClose}
        title='Fa-Barbielous!'
        text='A discount has been applied to your cart!'
      />
      <SimpleDialog
        open={lost}
        onClose={handleLoseClose}
        title='Game Over'
        text="It's okay, you are Kenough."
      />
    </Box>
  )
}

export default Memory;

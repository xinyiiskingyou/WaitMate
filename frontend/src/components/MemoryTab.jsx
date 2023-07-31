import { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Box, Grid, Typography, LinearProgress, linearProgressClasses } from '@mui/material';
import { CloseRounded, MinimizeRounded } from '@mui/icons-material';
import { pink, grey } from '@mui/material/colors';
import styled from "@mui/system/styled";
import MemoryCard from './MemoryCard';
import StatusDialog from "./MemoryStatusDialog";
import { GameButton, HeaderButtons } from './ActivityButtons'

const usedPink = pink[300]

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

const cardImages = [
  {src: "/img/memory_1.png", matched: false},
  {src: "/img/memory_2.png", matched: false},
  {src: "/img/memory_3.png", matched: false},
  {src: "/img/memory_4.png", matched: false},
  {src: "/img/memory_5.png", matched: false},
  {src: "/img/memory_6.png", matched: false},
]

function MemoryTab() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [firstCard, setFirstCard] = useState(null)
  const [secCard, setSecCard] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const [open, setOpen] = useState(false);

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
  
  return (
    <Box display='flex' 
      sx={{
        backgroundColor: pink[100], 
        minWidth: 850,
        maxWidth: 850,
        flexDirection: 'column',
        border: `8px groove ${grey[50]}`,
        borderRadius: 4,
      }}>
      <Box display="flex" justifyContent="space-between" alignItems="center"
        sx={{ 
          borderRadius: '8px 8px 1px 1px',
          boxShadow: `1px 3px 4px ${pink[300]}`,
          p: '4px',
          background: `linear-gradient(to right, ${pink[600]}, ${pink[200]})` 
        }}>
        <Typography color='white' 
          sx={{
            ml: 1, 
            fontFamily: 'cursive', 
            letterSpacing: '1px'
          }}
        >
          memory game
        </Typography>
        <Box>
          <HeaderButtons sx={{ mx: '2px', pb: 1 }}>
            <MinimizeRounded fontSize='small' />
          </HeaderButtons>
          <HeaderButtons component={Link} to={backLink}
            sx={{ 
              mr: '10px',
              ml: '4px',
            }}>
            <CloseRounded fontSize='small'/>
          </HeaderButtons>
        </Box>
      </Box>

      <Box display='flex' direction='column'>
        <Box display='flex' direction='column' alignItems="center" sx={{ width: 1000 }}>
          <Grid container justifyContent="center" direction='row' spacing={2} sx={{ pt: 2 }}>
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
      <Box 
        display='flex' 
        direction='column' 
        justifyContent="space-between" 
        alignItems="center"
      >
        <div 
          style={{ 
            position: "relative", 
            width: '35%', 
            padding: '1em 2.8em'
          }}
        >
          <BorderLinearProgress variant="determinate" value={turns * 10} />
          <Typography 
            sx={{ 
              position: 'absolute', 
              top: 22, 
              color: 'white', 
              fontFamily: 'cursive', 
              letterSpacing: '2px',
              left: "15%",
            }}
          >
            barbie meter
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
            <Typography onClick={shuffleCards} 
              sx={{ 
                textTransform: "none", 
                fontFamily: 'cursive'
              }}
            >
              restart
            </Typography>        
          </GameButton>
        </Box>
      </Box>
      <StatusDialog
        open={open}
        onClose={handleWinClose}
        title='Fa-Barbielous!'
        text='A discount has been applied to your cart!'
      />
      <StatusDialog
        open={lost}
        onClose={handleLoseClose}
        title='Game Over'
        text="It's okay, you are Kenough."
      />
    </Box>
  )
}

export default MemoryTab
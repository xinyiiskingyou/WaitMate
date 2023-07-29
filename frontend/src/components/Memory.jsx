import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Box, Grid, Button, Typography, Dialog } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import MemoryCard from './MemoryCard';
import { pink, grey } from '@mui/material/colors';

const usedPink = pink[300]
const usedGrey = grey[500]



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
    setTurns(12)
  }

  const handleChoice = (card) => {
    console.log(card.src)
    firstCard ? setSecCard(card) : setFirstCard(card)
  }

  const reset = () => {
    setFirstCard(null)
    setSecCard(null)
    setTurns(turns => turns -= 1)
    setDisabled(false)
    if (turns === 0) {
      setLost(true)
    }

  }

  const checkWon = () => {
    cards.map(card => {
      var count = 0
      if (card.matched === true) {
        count += 1
      } 
      if (count === 6) {
        return true
      }
    })
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

              return {...card, matched:true}
            } else {
              return card
            }
          })
        })
        setWon(checkWon())
        reset()
        
      } else {
        setTimeout(() => reset(), 1000)
      }
    }
  }, [firstCard, secCard])

  return(
    <Box justify="center"
      display='flex'
      sx={{ 
        flexDirection: 'column',
        alignItems: 'center', 
        py: 2
      }}>

    <Box display='flex' 
      sx={{
        backgroundColor: pink[100], 
        minWidth: 1000,
        maxWidth: '80%',
        flexDirection: 'column',
        border: `6px groove ${grey[50]}`,
        }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end"
        sx={{ 
          background: `linear-gradient(to right, ${pink[600]}, ${pink[100]})` }}>
        <Typography color='white' sx={{m: 0.5}}>Memory Game</Typography>
        <Button  
          size="small"            
          sx={{ 
            maxWidth: '30px',
            maxHeight: '30px', 
            minWidth: '30px', 
            minHeight: '30px',
            border: '3px ridge #0A0',
            borderColor: 'white',
            borderSize: 0,
            m: '2px',
            color: 'black',
            backgroundColor: usedGrey,
          }}>
          o
        </Button>
        <Link to={backLink}>
          <Button  
            size="small"            
            sx={{ 
              maxWidth: '30px',
              maxHeight: '30px', 
              minWidth: '30px', 
              minHeight: '30px',
              border: '3px ridge #0A0',
              borderColor: 'white',
              borderSize: 0,
              m: '2px',
              color: 'black',
              backgroundColor: usedGrey,
            }}>
            X
          </Button>
        </Link>

      </Box>

      <Box display='flex' >
      <Box  sx={{ mx: 5, backgroundColor: '#f0f0f0'}}>
      <Button onClick={shuffleCards}
        fullWidth
          size="small"            
          sx={{ 
            maxHeight: '30px', 
            minHeight: '30px',
            border: '3px ridge #0A0',
            borderColor: 'white',
            borderSize: 0,
            m: '2px',
            color: 'black',
            backgroundColor: usedGrey,
          }}>
          Restart
        </Button>
        <Typography align="center" sx={{mt: 2}}>Turns Left: {turns}</Typography>
        <img src='/img/barbie_1.png' width="220" height="500"/>
      </Box>

      <Box display='flex' alignItems="center" sx={{backgroundColor: '#000000', width: 1000}}>
      <Grid container justifyContent="center" direction='row' spacing={2} sx={{ py: 2,}}>
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
    </Box>
    </Box>
  )
}

export default Memory;

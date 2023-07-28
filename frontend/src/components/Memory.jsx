import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Box, Grid, Button, Typography, Dialog } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import MemoryCard from './MemoryCard';
import { pink } from '@mui/material/colors';

const usedPink = pink[300]


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
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
      }}>

    <Link to={backLink}>
      <Button              
        sx={{ 
          border: 5,
          borderColor: '#FFA0A0',
          borderRadius: 2,
          color: 'black',
        }}>
        <WestIcon/>
      </Button>
    </Link>
    <Typography variant="h4" align="center">Memory Game</Typography>
    <Button onClick={shuffleCards}>Start</Button>
    <Typography align="center">Turns Left: {turns}</Typography>

    <Box display='flex' sx={{ backgroundColor: usedPink, minWidth: 1000, maxWidth: '50%'}}>
      <Grid container spacing={2} gridTemplateColumns="repeat(4, 1fr)">
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
  )
}

export default Memory;

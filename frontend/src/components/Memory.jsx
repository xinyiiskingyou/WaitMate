import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Button, Typography } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import MemoryCard from './MemoryCard';

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
  // const [prevCards] = useState([])
  // const [cards, setCards] = useState([])

  const id = useParams();
  const backLink = `/Browse/${id.id}` 

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random()}))
    setFirstCard(null)
    setSecCard(null)
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

    <Grid display="grid" gridTemplateColumns="repeat(4, 1fr)">
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
  )
}

export default Memory;

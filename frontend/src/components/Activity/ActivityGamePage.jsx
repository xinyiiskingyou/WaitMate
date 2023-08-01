import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import logo from '../../assets/WaitMate.png'
import ActivityPink from './ActivityPink'
import MemoryTab from './MemoryTab'
import { pink } from '@mui/material/colors';
import { useState } from "react";

function GamePage() {
  const id = useParams();
  const backLink = `/customer/browse/${id.id}`
  const darkMode = false 
  const [cardBackground, setCardBackground] = useState(pink[300])

  const changeBackground = (value) => {
    setCardBackground(value)
  }

  return(
    <Box 
      display='flex'
      justifyContent="center"
      sx={{ 
        flexDirection: 'row',
        alignItems: 'center', 
        py: 2
      }}
    >
      <Box display='flex' alignItems='center' justifyContent="space-between" 
        sx={{ 
          minWidth: '18%', 
          minHeight: 670,
          flexDirection: 'column', 
          pr: 2
        }}
      >
        <ActivityPink backLink={backLink} changeBackground={changeBackground}/>
        <Box          
          sx={{
            display: 'flex',
            justifyContent: "center",
            mt: 2
          }}>
          <img src='/img/barbie_1.png' alt='barbie-img' width="163" height="350"/>
        </Box>

        <Box      
          sx={{
            display: 'flex',
            justifyContent: "center",
            pt: 4,
          }}>
          <img src={logo} alt='logo'/>
        </Box>
      </Box>

      <MemoryTab pinkbackground={cardBackground}/>
    </Box>
  )
}

export default GamePage;

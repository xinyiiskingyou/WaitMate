import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import logo from '../assets/WaitMate.png'
import ActivityPink from './ActivityPink'
import MemoryTab from './MemoryTab'

function GamePage() {
  const id = useParams();
  const backLink = `/Browse/${id.id}` 

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
        <ActivityPink backLink={backLink}/>
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
          }}>
          <img src={logo} />
        </Box>
      </Box>

      <MemoryTab />
    </Box>
  )
}

export default GamePage;

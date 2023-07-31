import { Box, Typography, Dialog } from '@mui/material';
import { HeaderButtons } from './ActivityButtons'
import { pink, grey, yellow } from '@mui/material/colors';
import { CloseRounded  } from '@mui/icons-material';

function StatusDialog(props) {
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
          <HeaderButtons onClick={handleClick} >    
            <CloseRounded fontSize='small'/>
          </HeaderButtons>
        </Box>
        <Box display='flex' alignItems="center" sx={{ flexDirection: 'column'}}>
          <Typography variant="h5" sx={{ pt: 2, color: yellow[100], textShadow: `-3px 2px 0 ${pink[200]}`, fontWeight: 'bold',}}>{title}</Typography>
          <Typography sx={{ px: 5, py: 2, color: 'white', fontWeight: 'bold'}}>{text}</Typography>
          <HeaderButtons onClick={handleClick} 
            sx={{ 
              minWidth: ' 65px',
              maxWidth: ' 65px',
              borderRadius: 1,
              fontWeight: 'bold',
              backgroundColor: yellow[100],
              mb: 2
            }}>
            Okay
          </HeaderButtons>
        </Box>
      </Box>
    </Dialog>
  );
}

export default StatusDialog;
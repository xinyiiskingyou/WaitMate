import { Box, Grid } from '@mui/material';
import styled from "@mui/system/styled";
import { pink } from '@mui/material/colors';

const mainPink = pink[300]

const CardFace = styled(Box)(() => ({
  position: 'absolute',
  transition: 'all ease-in 1s',
  transform: `rotateY(90deg)`,
  borderRadius: 2,
}));

const CardBack = styled(Box)(() => ({
  width: 170,
  height: 170,
  transform: `rotateY(0deg)`,
  transitionDelay: 0.2,
  border: `4px outset ${mainPink}`,
  borderRadius: 5,
  backgroundColor: `${(props) => props.backgroundColor || mainPink}`
}));

const styles =  {
  imgsize: {
    width: 170,
    height: "170"
  }
}

function MemoryCard({ card, handleChoice, flipped, disable, pinkbackground }) {
  const handleClick = () => {
    if (!disable) {
      handleChoice(card)
    }
  } 

  return(
    <Grid item>
      <Grid className={flipped ? "flipped" : ""}>
        {flipped ?           
          <CardBack backgroundColor={pinkbackground}>
            <img 
              src={card.src} 
              style={styles.imgsize} 
              alt='front' 
              xs={{transform: 90}}
            />
          </CardBack> :         
          <CardFace>
            <img 
              src={card.src} 
              style={styles.imgsize} 
              alt='front' 
              xs={{transform: 90}}
            />
          </CardFace>
        }

        {flipped ?           
          <CardFace>
            <img 
              src='/img/memory_bg.jpg' 
              onClick={handleClick} 
              style={styles.imgsize} 
              alt='back' 
              xs={{transform: 0}}
            />
          </CardFace> :         
          <CardBack backgroundColor={pinkbackground}>
            <img 
              src='/img/memory_bg.jpg' 
              onClick={handleClick} 
              style={styles.imgsize} 
              alt='back'  
              xs={{transform: 0}}
            />
          </CardBack>
        }

      </Grid>
    </Grid>
  )
}
export default MemoryCard;

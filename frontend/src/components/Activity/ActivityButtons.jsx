import { Button } from '@mui/material';
import { pink } from '@mui/material/colors';
import styled from "@mui/system/styled";

const mainPink = pink[300]


export const GameButton = styled(Button)(() => ({
  color: "#FFFFFF",
  borderRadius: 4,
  border: `4px outset ${mainPink}`,

  backgroundColor: mainPink,
  '&:hover': {
    backgroundColor: pink[200],
  },
}));

export const HeaderButtons = styled(Button)(() => ({
  maxWidth: '25px',
  maxHeight: '25px', 
  minWidth: '25px', 
  minHeight: '25px',
  border: '2px inset #0A0',
  borderColor: 'white',
  borderRadius: 8,
  color: 'black',
  backgroundColor: pink[100],
}));


import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { pink } from '@mui/material/colors';

const mainPink = pink[100];
const secPink = pink[200];

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: mainPink,
  },
  '& label': {
    color: mainPink,
  },
  '& border': {
    border: 10,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: secPink,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: mainPink,
      borderWidth: "5px"

    },
    '&:hover fieldset': {
      borderColor: secPink,
      borderWidth: "5px"
    },
    '&.Mui-focused fieldset': {
      borderColor: secPink,
      borderWidth: "5px"

    },
  },
});

export default CssTextField;
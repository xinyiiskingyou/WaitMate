import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { pink } from '@mui/material/colors';

const mainPink = '#FF9EE4';
const secPink = '#FF9EE4';

const CssTextField = styled(TextField)({
  background: 'white',
  borderRadius: 0,

  '& label.Mui-focused': {
    color: mainPink,
    borderRadius: 0
  },
  '& label': {
    fontWeight: 'bold',
    color: mainPink,
  },
  '& border': {
    border: 10,
    borderRadius: 0,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: secPink,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: mainPink,
      borderWidth: "3px",
      borderRadius: 0,

    },
    '&:hover fieldset': {
      borderColor: secPink,
      borderWidth: "3px",
    },
    '&.Mui-focused fieldset': {
      borderColor: secPink,
      borderWidth: "3px",

    },
  },
});

export default CssTextField;
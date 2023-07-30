import React, {useState} from 'react';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorHandler from '../ErrorHandler';
import { useCookies } from 'react-cookie';
import { 
    Box, 
    FormControlLabel, 
    Checkbox, 
    Button, 
    TextField, 
    InputAdornment,
    Dialog,
    DialogActions,
  } from '@mui/material';
const EditCatebuttonStyle = {
  marginTop: '20%',
  width: '10%',
  height: '40%',
}

const UploadMeme = ({ 

}) => {

  const { _, handleShowSnackbar, showError } = ErrorHandler(); 


  const handleUploadMeme = async () => {
    //console.log(itemName)
    let orderPayload = {
      url: "tableID",
      count: 0,
    }
    try {
      const response = await fetch("http://localhost:8000/meme/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      if (response.ok) {

      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.log(error)
      handleShowSnackbar(error.message);
    }
  }
  const [open, setOpen] = useState(true);
  const [cookies] = useCookies(['token']);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{
        "& .MuiDialog-paper": {
          background: "#FBDDDD",
        },
      }}>
        <TextField/>
      </Dialog>
      {/* <Button 
        onClick={() => handleSaveCategoryName(index)}
        variant="contained"
        color="primary"
        style={{...EditCatebuttonStyle, background: "#81c784", marginRight: '5px'}}>
        <DoneIcon />
      </Button>

      <Button 
        onClick={handleCancelSaveCategory} 
        variant="contained" 
        color="primary"
        style={{...EditCatebuttonStyle, background: "#ffc570"}}
      >
        <ClearIcon />
      </Button> */}
      {showError}
    </div>
  );
};

export default UploadMeme;

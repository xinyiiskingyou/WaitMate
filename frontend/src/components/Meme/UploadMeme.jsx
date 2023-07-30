import React, {useState, useEffect} from 'react';
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
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
    CircularProgress,
    Alert
  } from '@mui/material';
const EditCatebuttonStyle = {
  marginTop: '20%',
  width: '10%',
  height: '40%',
}

const UploadMeme = ({ onClose}) => {
  const { _, handleShowSnackbar, showError } = ErrorHandler(); 
  const [open, setOpen] = useState(true);
  const [url, setUrl] = useState("");
  const [cookies] = useCookies(['token']);
  const [loading, setLoading] = useState(false);
  const [responseOk, setResponseOk] = useState(false);
  
  const handleCancel = () => {
    setOpen(false);
    onClose();
  }
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    console.log("responseOk:", responseOk);
  }, [responseOk]);

  const handleUploadMeme = async () => {
    setLoading(true);
    let orderPayload = {
      url: url,
      count: 0,
    }
    try {
      const response = await fetch("http://localhost:8000/meme/upload", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.token}`
          },
        body: JSON.stringify(orderPayload)
      });
      if (response.ok) {
        setLoading(false);
        setResponseOk(true);
        console.log("response: ", responseOk);
        
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.log(error)
      handleShowSnackbar(error.message);
    } finally {
      handleClose();
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{
        "& .MuiDialog-paper": {
          background: "#FBDDDD",
        },
      }}>
        <DialogTitle>Upload Meme</DialogTitle>
        <DialogContent>
            <DialogContentText>
                To Upload meme, please enter the url link of the meme.
            </DialogContentText>

            <Box>
            <TextField
                label="Meme url"
                id="standard-required"
                value={url}
                size="small"
                margin= 'normal'
                fullWidth
                onChange={(e) => { setUrl(e.target.value); }}
                variant="filled"
                sx={{ background: "white" }}
            />
        </Box>
        </DialogContent>

        <DialogActions>
        {loading ? (
            <CircularProgress color="primary" size={24} />
          ) : responseOk ? ( // Conditionally render the green tick icon
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Alert severity="success">This is a success alert — check it out!</Alert>
              <DoneIcon sx={{ color: "#4caf50" }} />
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleCancel}
                style={{
                  background: "#ffc570",
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <>
              <Button
                size="small"
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleUploadMeme}
                style={{
                  background: "#81c784",
                }}
              >
                Add
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleCancel}
                style={{
                  background: "#ffc570",
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </DialogActions>
 
      </Dialog>
      {showError}
    </div>
  );
};

export default UploadMeme;

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

const ViewVoteCount = ({ onClose}) => {
  const { _, handleShowSnackbar, showError } = ErrorHandler(); 
  const [open, setOpen] = useState(true);
  const [code, setCode] = useState("");
  const [cookies] = useCookies(['token']);
  const [loading, setLoading] = useState(false);
  const [responseOk, setResponseOk] = useState(false);
  const [email, setEmail] = useState([]);

  const handleCancel = () => {
    setOpen(false);
    onClose();
  }
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    fetchMemesCount();
  }, []);

  const fetchMemesCount = async () => {
    try {
    const response = await fetch('http://localhost:8000/meme/listall/emails', {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${cookies.token}`
        },
      });
    const data = await response.json();
      setEmail(data);
      console.log(data);
    } catch (error) {
    console.error('Error fetching Items:', error);
    }
};

const sendVouchers = async () => {
    setLoading(true);
    const payload = {code: code};
    console.log(payload);
    try {
    const response = await fetch('http://localhost:8000/meme/send/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });
    if (response.ok) {
        setLoading(false);
        handleClose();
    } else {
        handleClose();
    }
    } catch (error) {
        console.error('Error fetching Items:', error);
    }
};
  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{
        "& .MuiDialog-paper": {
          background: "#FBDDDD",
        },
      }}>
        <DialogTitle>Vouchers Giveaway</DialogTitle>
        <DialogContent>
            <DialogContentText>
                We have randomly picked 5 customers from the most liked meme. 
                <br/>
                Enter the coupon code that you want to giveaway.
            </DialogContentText>

        <Box style={{marginTop: "2vh"}}>
        {email.map((value) => (
            <div key={value}>{value}</div>
        ))}
        <TextField
            label="Coupon code"
            value={code}
            size="small"
            margin= 'normal'
            onChange={(e) => { setCode(e.target.value); }}
            variant="outlined"
            InputProps={{
                sx: {
                  backgroundColor: '#F7F7F7',
                  borderRadius: '8px',
                },
              }}
              InputLabelProps={{
                sx: {
                  backgroundColor: '#F7F7F7',
                  borderRadius: '8px',
                  paddingLeft: '5px',
                  paddingRight: '5px',
                },
              }}
        />
        </Box>
        </DialogContent>

        <DialogActions>
        {loading ? (
            <CircularProgress color="primary" size={24} />
          ) : ( // Conditionally render the green tick icon
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={sendVouchers}
                style={{
                  background: "#ffc570",
                }}
              >
                Send
              </Button>
            </Box>
          )}
        </DialogActions>
 
      </Dialog>
      {showError}
    </div>
  );
};

export default ViewVoteCount;

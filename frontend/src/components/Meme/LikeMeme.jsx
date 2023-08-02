import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import ErrorHandler from '../ErrorHandler';

const LikeMeme = ({ filename }) => {
  const [email, setEmail] = useState('');
  const { handleShowSnackbar, showError } = ErrorHandler();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleLikeMeme = async () => {
    const payload = {
      email: email,
      filename: filename
    };

    try {
      const response = await fetch('http://localhost:8000/meme/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      console.log('email', email);
      setOpen(false);
      if (response.ok) {
        return response.json();
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.log(error)
      handleShowSnackbar(error.message);
    }
  }

  return (
    <div style={{
      position: "fixed",
      bottom: '3vw',
      right: "22vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: 'fixed',
    }}>
      <Button onClick={() => setOpen(true)}>
        <FavoriteIcon style={{ fontSize: '6vh', color: '#FF9EE4', position: 'fixed'}}/>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Enter Email Address</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address to vote for the meme.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => handleLikeMeme()} color="primary">
            Like
          </Button>
        </DialogActions>
      </Dialog>
      {showError}
    </div>
  );
}

export default LikeMeme;
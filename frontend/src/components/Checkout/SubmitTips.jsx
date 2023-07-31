import React, { useState } from "react";
import { Typography, Button, TextField, TableCell } from "@mui/material";
import ErrorHandler from '../ErrorHandler';

const SmallbuttonStyle = { 
  border: '4px solid #FFFFFF', 
  height: '5vh', 
  width: '10vw',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#FFFFFF",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
  marginLeft: '1vw',
  marginTop: '0.6vh',
}

const SubmitTips = ({ id, tip }) => {
  const [tips, setTips] = useState(tip)
  const [tipsSubmitted, setTipsSubmitted] = useState('')
  const { handleShowSnackbar, showError } = ErrorHandler();

  const handleInputChange = (event) => {
    const inputTips = event.target.value;
    if (!isNaN(inputTips)) {
      setTips(inputTips);
    }
  };

  const handleTipsSubmit = async () => {
    const payload = {
      id: parseInt(id.id, 10),
      amount: parseInt(tips, 10)
    };

    try {
      const response = await fetch(`http://localhost:8000/checkout/bill/tips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        if (tips === null) {
          return;
        }
        setTipsSubmitted(true);
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error('error', error.message);
      handleShowSnackbar(error.message);
    }
  }

  return (
    <TableCell style={{ width: '20%', textAlign: 'center' }} sx={{borderBottom: 'none', pr: -10}}>
      {tipsSubmitted ? (
        <Typography variant="body1">${tips}</Typography>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            required
            id='standard-required'
            label='Enter NUMBERS Only'
            value={tips}
            onChange={handleInputChange}
            helperText={'Tip field must be a number'}
            size='small'
            margin='normal'
            type='number'
            fullWidth
            inputProps={{
              step: '1',
              min: '1',
            }}
          />
          <Button variant='contained' color='primary' onClick={handleTipsSubmit} style={SmallbuttonStyle}>
            Submit
          </Button>
        </div>
      )}
      {showError}
    </TableCell>
  );
}

export default SubmitTips;
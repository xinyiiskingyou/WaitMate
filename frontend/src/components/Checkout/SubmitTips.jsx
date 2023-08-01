import React, { useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import ErrorHandler from '../ErrorHandler';
import DoneIcon from '@mui/icons-material/Done';
import tipIcon from "../../assets/tip.png"

const SmallbuttonStyle = { 
  border: '4px solid #FFA0A0', 
  height: '40px', 
  width: '20px',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#FFFFFF",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
  marginLeft: '1vw',
  marginRight: '1vw',
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
      id: parseInt(id, 10),
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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={tipIcon}
        alt="TipIcon"
        style={{ width: "48px", height: "43px", marginBottom: '15px' }}
      />
      {tipsSubmitted ? (
        <Typography variant="body1" style={{ marginTop: '6px', marginLeft: '10px' }}>
          ${tips} tip has been added to you bill. Thank you!
        </Typography>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ marginTop: '4px', marginLeft: '15px' }}>
            Tip?
          </h3>
          <TextField
            required
            id='standard-required'
            label='Enter NUMBERS Only'
            value={tips}
            onChange={handleInputChange}
            size='small'
            margin='normal'
            type='number'
            fullWidth
            inputProps={{
              step: '1',
              min: '1',
            }}
            style={{ marginLeft: "37px" }}
          />
          <Button variant='contained' color='primary' onClick={handleTipsSubmit} style={SmallbuttonStyle}>
            <DoneIcon />
          </Button>
        </div>
      )}
      {showError}
    </div>
  );
}

export default SubmitTips;

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

const SubmitCoupon = ({ id }) => {

  const [couponSubmitted, setCouponSubmitted] = useState('');
  const { handleShowSnackbar, showError } = ErrorHandler();
  const [coupon, setCoupon] = useState('')

  const handleCouponInput = (event) => {
    const inputCoupon = event.target.value;
    console.log('Coupon', inputCoupon)
    setCoupon(inputCoupon);
  };

  const handleCouponSubmit = async () => {
    const payload = {
      id: parseInt(id.id, 10),
      code: coupon
    };
    try {
      const response = await fetch(`http://localhost:8000/checkout/bill/coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        if (coupon === null) {
          return;
        }
        setCouponSubmitted(true);
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
      {couponSubmitted ? (
        <Typography variant="body1">{coupon}</Typography>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            required
            id='standard-required'
            label='Enter your coupon code'
            value={coupon}
            onChange={handleCouponInput}
            size='small'
            margin='normal'
            fullWidth
          />
          <Button variant='contained' color='primary' onClick={handleCouponSubmit} style={SmallbuttonStyle}>
            Submit
          </Button>
        </div>
      )}
      {showError}
    </TableCell>
  );
}

export default SubmitCoupon;

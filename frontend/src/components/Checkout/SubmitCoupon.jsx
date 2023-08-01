import React, { useState } from "react";
import { Typography, Button, TextField } from "@mui/material";
import ErrorHandler from '../ErrorHandler';
import DoneIcon from '@mui/icons-material/Done';
import VoucherIcon from "../../assets/voucher.png"

const SmallbuttonStyle = { 
  border: '4px solid #FFA0A0', 
  height: '40px', 
  width: '20px',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#FFCFCF",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
  marginLeft: '0.3vw',
  marginRight: '1vw',
  marginTop: '1vh',
}

const SubmitCoupon = ({ id }) => {

  const [couponSubmitted, setCouponSubmitted] = useState('');
  const { handleShowSnackbar, showError } = ErrorHandler();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleCouponInput = (event) => {
    const inputCoupon = event.target.value;
    console.log('Coupon', inputCoupon)
    setCoupon(inputCoupon);
  };

  const handleCouponSubmit = async () => {
    const payload = {
      id: parseInt(id, 10),
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
        const data = await response.json()
        setDiscount(data.amount);
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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={VoucherIcon}
        alt="TipIcon"
        style={{ width: "42px", height: "43px", marginLeft: '10px', marginRight: '5px', marginTop: '8px'}}
      />
      {couponSubmitted ? (
        <Typography style={{ marginTop: '12px' }} variant="body1">
          Coupon '{coupon}' applied. You've got {discount}% off!
        </Typography>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h3 style={{ marginTop: '25px', marginRight: '9px' }}>
            Coupon?
          </h3>
          <TextField
            required
            id='standard-required'
            label='Enter your coupon code'
            value={coupon}
            onChange={handleCouponInput}
            size='small'
            margin='normal'
            fullWidth
            style={{ marginRight: "10px" }}
          />
          <Button variant='contained' color='primary' onClick={handleCouponSubmit} style={SmallbuttonStyle}>
            <DoneIcon />
          </Button>
        </div>
      )}
      {showError}
    </div>
  );
}

export default SubmitCoupon;

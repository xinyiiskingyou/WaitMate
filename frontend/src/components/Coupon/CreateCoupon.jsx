import React, { useState } from "react";
import { useCookies } from 'react-cookie';
import { 
  Button,
  Dialog,
  DialogActions,
  TextField,
  Box
} from "@mui/material";
import {DatePicker} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import enGB from 'date-fns/locale/en-GB';
import { v4 as uuidv4 } from "uuid";
import ErrorHandler from '../ErrorHandler';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

const CreateCoupon = ({ coupons, setCoupons }) => {

  const [cookies] = useCookies(['token']);
  const { handleShowSnackbar, showError } = ErrorHandler();
  const [open, setOpen] = useState(false);

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateCoupon = async () => {
    if (! expiryDate) {
      return;
    }
    const date = expiryDate.toDateString();
    const payload = {
      code: code,
      amount: discount,
      expiry: date,
    }
    
    try {
      const response = await fetch('http://localhost:8000/checkout/coupon/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        const newCoupon = {
          id: uuidv4(),
          code: code,
          discount,
          expiryDate,
        };
    
        setCoupons([...coupons, newCoupon]);
        setCode("");
        setDiscount("");
        setExpiryDate(null);
        setOpen(false);
        return response.json();
      } else {
        const errorResponse = await response.json();
        throw Error(errorResponse.detail);
      }
    } catch (error) {
      console.error(error);
      handleShowSnackbar(error.message);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        style={{
          backgroundColor: "#FBDDDD",
          borderRadius: "50%",
          position: "absolute",
          bottom: "10px",
          right: "11px",
        }}
      >
        <AddIcon style={{fontSize: '10vh', color: 'black'}}/>
      </Button>
      
      <Dialog open={open} onClose={handleClose} sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#FBDDDD",
          width: "450px",
          height: "350px",
        },
      }}>
        <form onSubmit={(e) => {
          e.preventDefault();
        } }>
          <Box
            sx={{
              backgroundColor: '#FBDDDD',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TextField
              label="Coupon Code"
              variant="outlined"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              margin="normal"
              sx={{ background: "white", width: "400px", marginLeft: '5px' }}
            />

            <TextField
              label="Discount"
              type='number'
              variant="outlined"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
              margin="normal"
              inputProps={{
                step: '1',
                min: '1',
              }} 
              sx={{ background: "white", width: "400px", marginLeft: '5px' }}
            />
            <br />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
              <DatePicker
                label="Expiry Date"
                value={expiryDate}
                onChange={(date) => setExpiryDate(date)}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
                disablePast 
                required
                margin="normal" 
                sx={{ background: "white", width: "400px", marginLeft: '5px' }}
              />
            </LocalizationProvider>
          </Box>
          <DialogActions>
            <Button size="small" type="submit" onClick={handleCreateCoupon} style={{backgroundColor: 'transparent', color: 'red', border: 'none'}}>
              <DoneIcon style={{fontSize: '5vh'}}/>
            </Button>

            <Button size="small" onClick={handleClose} style={{backgroundColor: 'transparent', color: 'black', border: 'none'}}>
              <CloseIcon style={{fontSize: '5vh'}}/>
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {showError}
      </>
  );
}

export default CreateCoupon;

import React, { useState } from "react";
import { 
  Grid, 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import ErrorHandler from '../ErrorHandler';
import thanks from '../../assets/thank.png'

const buttonStyle = { 
  background: '#C0C0C0', 
  color: 'black',
  marginTop: '1vh',
  fontWeight: 'bold',
  fontSize: '0.9vw',
  width: '5vw',
  height: '3.5vh'
}

const AddOrder = ({ tableID, itemName, amount, setAmount }) => {
  const [open, setOpen] = useState(false);
  const { handleShowSnackbar, showError } = ErrorHandler();

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddOrder = async () => {
    console.log(itemName)
    let orderPayload = {
      id: tableID,
      item: itemName,
      amount: amount,
    }
    try {
      const response = await fetch("http://localhost:8000/order/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });
      if (response.ok) {
        setAmount(amount);
        setOpen(true);
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
    <Grid item>
      <Button variant="contained" color="primary" type="submit" onClick={handleAddOrder} style={buttonStyle}>
        Confirm
      </Button>

      <Dialog open={open} onClose={handleClose} sx={{
        "& .MuiDialog-paper": {
          border: "8px solid #FFA0A0",
          borderRadius: 7,
        },
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          width: '28vw',
        }}>
          <img src={thanks} alt="ThanksIcon" style={{
            maxWidth: '50%',
            maxHeight: '10vh',
            marginTop: '1.5vh',
          }}/>

          <DialogContent style={{ fontSize: '1.1vw', textAlign: 'center', padding: '1vh', letterSpacing: '0.01vw' }}>
            <b>{itemName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</b>
            (Qty: {amount}) has been added to the order. &#128512;
          </DialogContent>

          <DialogActions>
            <Button variant="contained" color="primary" type='submit' onClick={handleClose}
              style={{ 
                background: '#eeeeee', 
                color: 'black',
                fontWeight: 'bold',
                fontSize: '0.8vw',
                width: '5vw',
                height: '3.5vh'
              }}  xs={{pl: 20}}>
              Confirm
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      {showError}
    </Grid>
  );
};

export default AddOrder;
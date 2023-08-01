import React, { useState } from "react";
import { Box, Button, Grid, Dialog, DialogContent, DialogActions } from "@mui/material";
import ErrorHandler from '../ErrorHandler';
import thanks from '../../assets/thank.png'
import bell from '../../assets/bell.png'

const buttonStyle = { 
  border: '4px solid #FFFFFF', 
  height: '6vh', 
  width: '200px',
  textAlign: 'center', 
  justifyContent: 'right',
  alignItems: 'right',
  background: "#FFFFFF",
  color: 'black',
  fontWeight: "bolder",
  borderRadius: 6,
}

const SendNotification = () => {
  
  const { handleShowSnackbar, showError } = ErrorHandler();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handle_require_assistance = async (id, status) => {
    const payload = {
      table_id: id,
      status: status
    };
    try {
      const response = await fetch('http://localhost:8000/notification/customer/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
  
      if (response.ok) {
        setOpen(true);
        return response.json();
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error('error', error.message);
      handleShowSnackbar(error.message);
    }
  }

  const requestAssistance = (id, status) => {
    return (
      <Grid item>
        <Button 
          variant="contained" 
          color="primary" 
          justifyContent="flex-end"
          style={buttonStyle}
          onClick={() => handle_require_assistance(id, status)}
        >
          <img src={bell} alt="BellIcon" style={{
            width: '2.1vw',
            height: '4vh',
          }}/>
          Request Assistance
        </Button>
  
        <Dialog open={open} onClose={handleClose} fullWidth>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            border: "7px solid #FFA0A0",
          }}>
          <img src={thanks} alt="ThanksIcon" style={{
            maxWidth: '100%',
            maxHeight: '15vh',
            marginTop: '1.5vh',
          }}/>
          <DialogContent style={{ fontSize: '1.3vw', textAlign: 'center', padding: '1vh', letterSpacing: '0.02vw' }}>
            Request received. <br />
            Our staff will be with you shortly.
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={handleClose} style={{ background: "#FFA0A0" }}>
              Confirm
            </Button>
          </DialogActions>
          </div>
        </Dialog>
        {showError}
      </Grid>
    );
  }
  
  return { requestAssistance, handle_require_assistance }
}

export default SendNotification;
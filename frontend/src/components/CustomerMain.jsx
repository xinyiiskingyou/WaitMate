import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import {Link, useParams} from 'react-router-dom';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import menu from '../assets/menu.png'
import wait from '../assets/wait.png'
import thanks from '../assets/thank-you.png'
import boring from '../assets/boring.png'
import meme from '../assets/meme.png'

const CustomerMain = () => {
  const id = useParams();
  const menuLink = `/Browse/${id.id}` 
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handle_require_assistance = async () => {
    const payload = {
      table_id: id.id,
      status: "ASSIST"
    };
    fetch('http://localhost:8000/notification/customer/send', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(response => {
      if (response.ok) {
        setOpen(true);
        return response.json();
      } else {
        throw new Error('Please try again.');
      }
    }).catch(error => {
      // Handle the error if necessary
      console.error(error);
      alert(error);
    });
  }

  const buttonStyle = { 
    background: 'transparent', 
    color: 'black',
    marginLeft: '175px',
    marginTop: '3px',
    fontWeight: 'bold',
    fontSize: '32px',
  }

  const borderStyle = { 
    border: '8px solid #FFA0A0', 
    height: '300px', 
    width: '500px',
    alignItems: 'center', 
    justifyContent: 'center'
  }

  const headingStyle = {
    textAlign: 'center',
    fontSize: '60px',
    marginTop: '100px',
    marginBottom: '70px'
  };

  const imgStyle = {
    width: '200px',
    height: '200px',
    marginTop: '20px',
    marginLeft: '130px'
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={"100vh"}
    >

    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
      <h2 style={headingStyle}>Customer Board</h2>
      <br />
      <Box
        sx={{
          display: 'grid',
          columnGap: 25,
          rowGap: 9,
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <div style={borderStyle}>
          <Link to={menuLink}>
          <img src={menu} alt="MenuIcon" style={imgStyle}/>
            <Button variant="text" style={buttonStyle} >
              Menu
            </Button>
          </Link>
        </div>
        <div style={borderStyle}>
        <img src={wait} alt="WaitIcon" style={imgStyle}/>
          <Button 
            variant='text' 
            style={{
              background: 'transparent', 
              color: 'black',
              marginLeft: '80px',
              marginTop: '3px',
              fontWeight: 'bold',
              fontSize: '30px',
              fontWeight: 'bold',
            }} 
          onClick={() => handle_require_assistance()}>
            Require Assistance
          </Button>
          <Dialog open={open} onClose={handleClose} fullWidth>
            <img src={thanks} alt="ThanksIcon" style={{
              width: '200px',
              height: '200px',
              marginTop: '20px',
              marginLeft: '185px'
            }}/>
            <DialogContent style={{ fontSize: '30px', textAlign: 'center', padding: '20px', letterSpacing: '1px' }}>
              Request received. <br />
              Our staff will be with you shortly.
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={handleClose}
                style={{
                  background: "#FFA0A0",
                }}>
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div style={borderStyle}>
          <img src={boring} alt="BoringIcon" style={imgStyle}/>
          <Button variant='text' color='primary' style={{
              background: 'transparent', 
              color: 'black',
              marginLeft: '120px',
              marginTop: '5px',
              fontWeight: 'bold',
              fontSize: '30px',
            }}>
            Too Bored?
          </Button> 
        </div>
        <div style={borderStyle}>
          <img src={meme} alt="MemeIcon" style={{
            width: '230px',
            height: '200px',
            marginTop: '20px',
            marginLeft: '130px'
          }}/>
          <Button variant='text' color='primary' style={{
              background: 'transparent', 
              color: 'black',
              marginLeft: '95px',
              fontWeight: 'bold',
              fontSize: '30px',
          }}>
            Meme of the Week
          </Button>
        </div>
      </Box>
    </div>
    </Box>
  );
};

export default CustomerMain;

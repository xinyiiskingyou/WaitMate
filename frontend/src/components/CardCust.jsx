import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button, TextField, Grid } from '@mui/material';
import veg from '../assets/vegan.png'
import thanks from '../assets/thank.png'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

const ItemCard = ({ ItemName, ItemPrice, ItemDescription, ItemIngredient, ItemVegetarian, TableID }) => {

  const [amount, setAmount] = useState(null);
  const [open, setOpen] = useState(false);

  const handleTextfile = event => {
    setAmount(event.target.value);
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    let order = {
      id: TableID,
      item: ItemName,
      amount: amount,
    }

    fetch("http://localhost:8000/order/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to place order. Please try again.');
      }
    }).then(() => {
      setAmount(amount);
      setOpen(true);
    }).catch(error => {
      console.log(error);
      alert(error);
    })
  };

  const buttonStyle = { 
    background: '#eeeeee', 
    color: 'black',
    marginTop: '1vh',
    fontWeight: 'bold',
    fontSize: '0.9vw',
    width: '5vw',
    height: '3.5vh'
  }

  return (
    <Box margin='1%' width='20vw' sx={{ height: '12vh' }}>
      <Card sx={{ border: '5px solid #FFA0A0', maxHeight: '35vh', borderRadius: 8 }}>
        <CardContent>
        <Box>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', textAlign: "center" }}>
            {ItemName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
            {ItemVegetarian===1 ? (
              <img 
                src={veg} 
                alt="Icon" 
                style={{
                  width: '3.1vw',
                  height: '6vh',
                  marginLeft: '10px',
                  verticalAlign: 'middle',
                }}/>
            ): null }
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Price: ${ItemPrice}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Descriptions: {ItemDescription}
          </Typography>

          <Typography variant="subtitle1" gutterBottom>
            Ingredients: {ItemIngredient}
          </Typography>

          <Typography variant="subtitle1">
            <form onSubmit={(e) => {
              e.preventDefault(); 
              e.target.reset();
            }}>
              <Grid container alignItems="center" justifyContent="center" columnSpacing={1}>
                <Grid item>
                  <TextField 
                    type="number" 
                    size="small"
                    id="outlined-size-small"
                    label="Enter quantity" 
                    onChange={handleTextfile} 
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" type="submit" onClick={handleSubmit} style={buttonStyle}>
                    Confirm
                  </Button>
                </Grid>
              </Grid>

              <Dialog open={open} onClose={handleClose}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  width: '28vw',
                  border: "6px solid #FFA0A0",
                }}>
                  <img src={thanks} alt="ThanksIcon" style={{
                    maxWidth: '50%',
                    maxHeight: '10vh',
                    marginTop: '1.5vh',
                  }}/>
                  <DialogContent style={{ fontSize: '1.1vw', textAlign: 'center', padding: '1vh', letterSpacing: '0.01vw' }}>
                    <b>{ItemName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')} </b>
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
            </form>
          </Typography>
        </Box>
        </CardContent>
      </Card>     
    </Box>
  ); 
};

export default ItemCard;
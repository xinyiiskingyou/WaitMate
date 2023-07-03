import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button, TextField } from '@mui/material';
import veg from '../assets/vegan.png'

const ItemCard = ({ ItemName, ItemPrice, ItemDescription, ItemIngredient, ItemVegetarian, TableID }) => {

  const [amount, setAmount] = useState(null);

  const handleTextfile = event => {
    setAmount(event.target.value);
  }

  const handleSubmit = () => {
    let order = {
      id: TableID,
      item: ItemName,
      amount: amount,
    }

    console.log('Submitted value:', order);

    fetch("http://localhost:8000/order/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    }).catch(error => {
      alert(error);
    })
    setAmount(null);
  };

  const buttonStyle = { 
    background: '#eeeeee', 
    color: 'black',
    marginTop: '1.7vh',
    marginLeft: '24vh',
    fontWeight: 'bold',
    fontSize: '0.9vw',
    width: '5vw',
    height: '4vh'
  }

  return (
    <Box margin='1%' width='20vw' sx={{ height: '14vh' }}>
      <Card sx={{ border: '5px solid #FFA0A0', height: '35vh', borderRadius: 8 }}>
        <CardContent>
        <Box>
          <Typography variant="h4" gutterBottom style={{ fontWeight: 'bold', textAlign: "center" }}>
            {ItemName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
            {ItemVegetarian===1 ? (
            <img 
              src={veg} 
              alt="Icon" 
              style={{
                width: '6vh',
                height: '6vh',
                marginLeft: '10px',
                verticalAlign: 'middle',
              }}
            />
          ): null }
          </Typography>
          <Typography variant="body1" gutterBottom>
            Price: ${ItemPrice}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Descriptions: {ItemDescription}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Ingredients: {ItemIngredient}
          </Typography>
          <Typography variant="body1">
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
            <Button variant="contained" color="primary" onClick={handleSubmit}
              style={buttonStyle}  xs={{pl: 20}}>
              Confirm
            </Button>
          </Typography>
        </Box>
        </CardContent>
      </Card>     
    </Box>
  ); 
};

export default ItemCard;
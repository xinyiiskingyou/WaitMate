import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button, TextField } from '@mui/material';

const ItemCard = ({ ItemName, ItemPrice, ItemDescription, ItemIngredient, ItemVegetarian, TableID }) => {
  const [vegetarian, setVegetarian] = useState(ItemVegetarian);
  const [name, setName] = useState(ItemName);
  const [price, setPrice] = useState(ItemPrice);
  const [description, setDescription] = useState(ItemDescription);
  const [ingredient, setIngredient] = useState(ItemIngredient);
  const [amount, setAmount] = useState(1);

  const handleTextfile = event => {
    setAmount(event.target.value);
  }

  const handleSubmit = () => {
    let order = {
      id: TableID,
      item: name,
      amount: amount,
    }

    console.log('Submitted value:', order);

    fetch("http://localhost:8000/order/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    })
  };

  return (
    <Box margin='2%'>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom style={{ display: 'flex'}}>
            <div style={{ flexGrow: 1 }}>{name}</div>
            <Typography variant="h6" gutterBottom style={{ marginTop: '5%' }}>
                ${price}
            </Typography>
            
          </Typography>
          <Typography variant="h6" gutterBottom color={"grey"}>
            {description}
          </Typography>

          <Typography variant="h7" gutterBottom>
            ingredient:
            <br />
          </Typography>
          <Typography variant="h7" gutterBottom>
            {ingredient}
          </Typography>
          <TextField type="number" label="Enter quantity" width='50%' onChange={handleTextfile} style={{marginTop: '7%'}}
              InputProps={{
              inputProps: { min: 1 }
            }}/>

        </CardContent>
          <Button variant="contained" color="primary" onClick={handleSubmit}
            style={{marginLeft: '7%', width: '50%', height: '45px'}}  xs={{pl: 20}}>
            Confirm
          </Button>
        <CardContent>
        </CardContent>
      </Card>     
    </Box>
  ); 
};

export default ItemCard;
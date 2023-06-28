
import React, { useState } from "react";
import { Box, Card, FormControlLabel, CardActions, CardContent, Checkbox, Button, Typography, TextField, InputAdornment } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import veg from '../assets/vege.jpeg'

const Item = ({ onItemAdd, onItemCancel, category }) => {

    const [isEditable, setIsEditable] = useState(false);
    const [Done, setDone] = useState(false);
    const [vegetarian, setVegetarian] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [ingredient, setIngredient] = useState("");
    const [isItemAdded, setIsItemAdded] = useState(false);

    const handleAdd = () => {
        console.log('category',category);
        const payload = {
            category: category,
            name: name,
            cost: parseFloat(price),
            description: description,
            ingredients: ingredient,
            is_vegan: vegetarian
         };

        fetch('http://localhost:8000/menu/item/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to add item. Please try again.');
            }
        })
        .then(data => {
            onItemAdd(category, name, price, description, ingredient, vegetarian);
            setIsItemAdded(true);
        })
        .catch(error => {
            // Handle the error if necessary
            console.error(error);
            alert(error)
        });
    }
    
    const handleCancel = () => {
        onItemCancel();
    }
    const handleDone = () => {
        console.log("I am here");
        setDone(true);
        setIsEditable(!isEditable);
    };

    return (
      <Box margin='2%'>
      <Card>
          <CardContent>
          <TextField
          label="Name"
          value={name}
          size="small"
          margin= 'normal'
          fullWidth
          onChange={(e) => setName(e.target.value)}
          />

          <Box display="flex" flexDirection="row" flexWrap="wrap">
          <TextField
          label="Price"
          value={price}
          size="small"
          margin= 'normal'
          InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          onChange={(e) => setPrice(e.target.value)}
          />
          <Box margin="3%">
              <FormControlLabel
                  control={<Checkbox/>} 
                  label="Vegetarian" 
                  labelPlacement="start"
                  onChange={(e) => setVegetarian(e.target.checked)}/>
          </Box>
          </Box>

          <TextField
          label="Description"
          value={description}
          size="small"
          margin= 'normal'
          fullWidth
          onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
          label="Ingredients"
          value={ingredient}
          size="small"
          margin= 'normal'
          fullWidth
          onChange={(e) => setIngredient(e.target.value)}
          />
          </CardContent>

          <CardActions>

          <Button size="small" onClick={handleAdd}>
          Add
          </Button>

          <Button size="small" onClick={handleCancel}>
          Cancel
          </Button>
          </CardActions>
          </Card>
          </Box>
  )
};

export default Item;
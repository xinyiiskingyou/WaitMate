import React, { useState, useEffect } from "react";
import { Box, Card, FormControlLabel, CardActions, CardContent, Checkbox, Button, Typography, TextField, InputAdornment } from '@mui/material';
import veg from '../assets/vegan.png'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { useCookies } from 'react-cookie';

const MenuItem = ({ ItemName, ItemPrice, ItemDescription, ItemIngredient, ItemVegetarian, onItemRemove, ItemIndex, onItemsCategory, ItemCategory }) => {

  const [vegetarian, setVegetarian] = useState(ItemVegetarian);
  const [name, setName] = useState(ItemName);
  const [price, setPrice] = useState(ItemPrice);
  const [description, setDescription] = useState(ItemDescription);
  const [ingredient, setIngredient] = useState(ItemIngredient);
  const [open, setOpen] = useState(false);
  const [cookies] = useCookies(['token']);

  const handleEdit = () => {
    console.log('cat: ', ItemCategory);
    const payload = {
      category: ItemCategory,
      id: parseInt(ItemIndex, 10) + 1,
      name: name,
      cost: parseFloat(price),
      description: description,
      ingredients: ingredient,
      is_vegan: vegetarian
    };

    fetch('http://localhost:8000/menu/item/update/details', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.token}`
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update item. Please try again.');
        }
      })
      .then(data => {
        console.log('data', data);
        setOpen(false);
      })
      .catch(error => {
        // Handle the error if necessary
        console.error(error);
        alert(error);
      });
  };

  const handleUpdateOrder = async (is_up) => {

    const payload = {
      name: name,
      is_up: is_up
    };

    await fetch('http://localhost:8000/menu/item/update/order', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.token}`
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update order. Please try again.');
        }
      })
      .then(data => {
        onItemsCategory();
      })
      .catch(error => {
        // Handle the error if necessary
        console.error(error);
        alert(error);
      });
  };

  const handleRemove = () => {
    const payload = {
      name: name
    };
    fetch('http://localhost:8000/menu/item/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.token}`
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to remove item. Please try again.');
        }
      })
      .then(() => {
        onItemRemove();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  const handleOpen = () => {
    setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    // Update the state values when the props change
    setName(ItemName);
    setPrice(ItemPrice);
    setDescription(ItemDescription);
    setIngredient(ItemIngredient);
    setVegetarian(ItemVegetarian);
  }, [ItemName, ItemPrice, ItemDescription, ItemIngredient, ItemVegetarian]);
    
  const smallbuttonStyle = {
    color: 'white',
    backgroundColor: '#7CBD96',
  };

  return (
    <Card sx={{ border: '5px solid #FFA0A0', maxHeight: '34vh', width: '100%', borderRadius: 8 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom style={{ fontWeight: 'bold', textAlign: "center" }}>
          {name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
          {vegetarian ? (
            <img 
              src={veg} 
              alt="Icon" 
              style={{
                width: '2vw',
                height: '4vh',
                marginLeft: '10px',
                verticalAlign: 'middle',
              }}/>
          ): null }
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Price: ${price}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Descriptions: {description}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Ingredients: {ingredient}
        </Typography>
      </CardContent>
            
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button 
          size="small" 
          onClick={handleOpen}
          style={{ color: 'white', backgroundColor: '#7CBD96' }}>
          Update
        </Button>
        
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{
          "& .MuiDialog-paper": {
            border: "8px solid #FFA0A0",
            borderRadius: 8
          },
        }}>
          <DialogTitle><b>Edit Item</b></DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              value={name}
              size="small"
              margin="normal"
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />

            <Box display="flex" flexDirection="row" flexWrap="wrap">
              <TextField
                label="Price"
                value={price}
                size="small"
                margin="normal"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                inputProps={{
                  step: "0.01",
                  min: "0"
                }}
                onChange={(e) => setPrice(e.target.value)}
              />

              <Box margin="3%">
                <FormControlLabel
                  control={<Checkbox checked={vegetarian} />}
                  label="Vegetarian"
                  labelPlacement="start"
                  onChange={(e) => setVegetarian(e.target.checked)}
                />
              </Box>
            </Box>

            <TextField
              label="Description"
              value={description}
              size="small"
              margin="normal"
              fullWidth
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              label="Ingredients"
              value={ingredient}
              size="small"
              margin="normal"
              fullWidth
              onChange={(e) => setIngredient(e.target.value)}
            />
          </DialogContent>

          <DialogActions>
            <Button size="small" onClick={handleEdit} 
            style={{
              background: '#81c784', 
              color: 'black',
              fontWeight: 'bold',
              fontSize: '0.8vw',
              width: '3.5vw',
              height: '3vh',
              borderRadius: 10,
            }}>
              DONE
            </Button>
          </DialogActions>
        </Dialog>

        <Button 
          variant="contained"
          size="small" 
          onClick={() => handleRemove()}
          style={{ color: 'white', backgroundColor: '#FF7A7A' }}>
          Remove
        </Button>

        <Button
          color="primary"
          style={{ ...smallbuttonStyle, padding: '4px 8px', fontSize: '10px' }}
          onClick={() => handleUpdateOrder(true)}
        >
          <ArrowUpwardIcon/>
        </Button>

        <Button
          color="primary"
          style={{ ...smallbuttonStyle, padding: '4px 8px',fontSize: '10px' }}
          onClick={() => handleUpdateOrder(false)}
        >
          <ArrowDownwardIcon/>
        </Button>
      </CardActions>
  </Card>  
  ); 
};

export default MenuItem;
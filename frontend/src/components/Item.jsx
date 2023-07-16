
import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Checkbox, Button, TextField, InputAdornment } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useCookies } from 'react-cookie';

const Item = ({ onItemAdd, onItemCancel, category }) => {

  const [vegetarian, setVegetarian] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredient] = useState("");

  const [NameError, setNameError] = useState(false);
  const [PriceError, setPriceError] = useState(false);
  const [DescriptionError, setDescriptionError] = useState(false);
  const [IngredientError, setIngredientError] = useState(false);

  const [open, setOpen] = useState(true);
  const [cookies] = useCookies(['token']);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    console.log('category', category);
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
        'Authorization': `Bearer ${cookies.token}`
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
        setNameError(isNaN(name));
        setPriceError(isNaN(price));
        setDescriptionError(isNaN(description));
        setIngredientError(isNaN(vegetarian));
    })
    .catch(error => {
        // Handle the error if necessary
        console.error(error);
        alert(error);
    });
  }
  
  const handleCancel = () => {
    onItemCancel();
    setOpen(false);
  }

  useEffect(() => {
      // Update the state values when the props change
      setName(name);
      setPrice(price);
      setDescription(description);
      setIngredient(ingredient);
      setVegetarian(vegetarian);
    }, [name, price, description, ingredient, vegetarian]);

  return (
    <Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{
        "& .MuiDialog-paper": {
          border: "8px solid #FFA0A0",
          borderRadius: 8,
        },
      }}>

      <DialogTitle><b>Add Item</b></DialogTitle>

      <form onSubmit={(e) => {
        e.preventDefault(); // Prevent default form submission behavior
      }}>
      <Box sx={{m: 2}}>
        <TextField
          label="Name"
          id="standard-required"
          value={name}
          error={NameError !== ''}
          helperText={NameError && 'This field is required.'}
          size="small"
          margin= 'normal'
          fullWidth
          onChange={(e) => {
            setName(e.target.value);
            setNameError('');
          }}
          variant="filled"
        />

        <Box display="flex" flexDirection="row" flexWrap="wrap">
          <TextField
            label="Cost"
            value={price}
            type="number"
            inputProps={{
              step: "0.01",
              min: "0"
            }}
            error={PriceError !== ''}
            helperText={PriceError && 'This field is required.'}
            size="small"
            margin= 'normal'
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            onChange={(e) => {
              setPrice(e.target.value);
              setPriceError('');
            }}
            variant="filled"
          />
          
          <Box margin="3%">
            <FormControlLabel
              control={<Checkbox/>} 
              label="Vegetarian" 
              labelPlacement="start"
              onChange={(e) => setVegetarian(e.target.checked)}
            />
          </Box>
        </Box>

        <TextField
          label="Description"
          value={description}
          error={DescriptionError !== ''}
          helperText={DescriptionError && 'This field is required.'}
          size="small"
          margin= 'normal'
          fullWidth
          onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionError('');
          }}
          variant="filled"
        />

        <TextField
          label="Ingredients"
          value={ingredient}
          error={IngredientError !== ''}
          helperText={IngredientError && 'This field is required.'}
          size="small"
          margin= 'normal'
          fullWidth
          onChange={(e) => {
            setIngredient(e.target.value);
            setIngredientError('');
          }}
          variant="filled"
        />
      </Box>

      <DialogActions>
        <Button size="small" variant="contained" color="primary" type="submit" onClick={handleAdd} style={{
          background: "#81c784",
        }}>
          Add
        </Button>

        <Button size="small" variant="contained" color="secondary" onClick={handleCancel} style={{
          background: "#ffc570",
        }}>
          Cancel
        </Button>
      </DialogActions>
      </form>
      </Dialog>
    </Box>
  )
};

export default Item;
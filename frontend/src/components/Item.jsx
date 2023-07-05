
import React, { useState, useEffect } from "react";
import { Box, Card, FormControlLabel, CardActions, CardContent, Checkbox, Button, Typography, TextField, InputAdornment } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Item = ({ onItemAdd, onItemCancel, category }) => {

    const [isEditable, setIsEditable] = useState(false);
    const [Done, setDone] = useState(false);
    const [vegetarian, setVegetarian] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [ingredient, setIngredient] = useState("");
    const [isItemAdded, setIsItemAdded] = useState(false);

    const [NameError, setNameError] = useState(false);
    const [PriceError, setPriceError] = useState(false);
    const [DescriptionError, setDescriptionError] = useState(false);
    const [IngredientError, setIngredientError] = useState(false);

    const [open, setOpen] = useState(true);

    const handleClickOpen = () => {
      setOpen(true);
    };
    
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
        headers: {'Content-Type': 'application/json'},
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
          setNameError(isNaN(name));
          setPriceError(isNaN(price));
          setDescriptionError(isNaN(description));
          setIngredientError(isNaN(vegetarian));
      })
      .catch(error => {
          // Handle the error if necessary
          console.error(error);
      });
    }
    
    const handleCancel = () => {
      onItemCancel();
      setOpen(false);
    }

    const handleDone = () => {
        console.log("I am here");
        setDone(true);
        setIsEditable(!isEditable);
    };

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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="h6" style={{ fontWeight: 'bold' }}>
            Add Item
          </Typography>
      </DialogTitle>

      <form onSubmit={(e) => {
        e.preventDefault(); // Prevent default form submission behavior
      }}>
        <TextField
          autoFocus
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

      <DialogActions>
        <Button size="small" variant="contained" color="primary" type="submit" onClick={handleAdd}>
          Add
        </Button>

        <Button size="small" variant="outlined" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </DialogActions>
      </form>
      </Dialog>
    </Box>
  )
};

export default Item;
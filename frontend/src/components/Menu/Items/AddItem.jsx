import React, { useState, useEffect, useMemo } from "react";
import { useCookies } from 'react-cookie';
import { 
  Box, 
  FormControlLabel, 
  Checkbox, 
  Button, 
  TextField, 
  InputAdornment,
  Dialog,
  DialogActions,
} from '@mui/material';
import ErrorHandler from '../../ErrorHandler';

const AddItem = ({ onItemAdd, onItemCancel, category }) => {

  const [vegetarian, setVegetarian] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [ingredient, setIngredient] = useState("");

  const [open, setOpen] = useState(true);
  const [cookies] = useCookies(['token']);

  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const handleAdd = async () => {
    console.log('category', category);
    const payload = {
        category: category,
        name: name,
        cost: parseFloat(price),
        description: description,
        ingredients: ingredient,
        is_vegan: vegetarian
      };
    
    try {
      const response = await fetch('http://localhost:8000/menu/item/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onItemAdd(category, name, price, description, ingredient, vegetarian);
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error(error);
      handleShowSnackbar(error.message);
    }
  }
  
  const handleCancel = () => {
    onItemCancel();
    setOpen(false);
  }

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
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
          background: "#FBDDDD",
        },
      }}>

      <form onSubmit={(e) => {
        e.preventDefault();
      }}>
        <Box sx={{m: 2}}>
          <TextField
            label="Name"
            id="standard-required"
            value={name}
            helperText={'Name field is required.'}
            size="small"
            margin= 'normal'
            fullWidth
            onChange={(e) => { setName(e.target.value); }}
            variant="filled"
            sx={{ background: "white" }}
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
            helperText={'Price field is required.'}
            size="small"
            margin= 'normal'
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            onChange={(e) => { setPrice(e.target.value); }}
            variant="filled"
            sx={{ background: "white" }}
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
          helperText={'Description field is required.'}
          size="small"
          margin= 'normal'
          fullWidth
          onChange={(e) => { setDescription(e.target.value); }}
          variant="filled"
          sx={{ background: "white" }}
        />

        <TextField
          label="Ingredients"
          value={ingredient}
          helperText={'Ingredient field is required.'}
          size="small"
          margin= 'normal'
          fullWidth
          onChange={(e) => { setIngredient(e.target.value); }}
          variant="filled"
          sx={{ background: "white" }}
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
      {showError}
    </Box>
  );
};

export default AddItem;

import React, { useState, useEffect, useMemo } from "react";
import { 
  Box, 
  FormControlLabel, 
  Checkbox, 
  Button, 
  TextField, 
  InputAdornment,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CardContent,
  Typography
} from "@mui/material";
import ErrorHandler from '../../ErrorHandler';
import veg from '../../../assets/vegan.png'

const UpdateItemDetails = ({
  itemCategory,
  itemName,
  itemPrice, 
  itemDescription, 
  itemIngredient, 
  itemVegetarian,
  itemIndex,
  cookies,
}) => {

  const [name, setName] = useState(itemName);
  const [price, setPrice] = useState(itemPrice);
  const [description, setDescription] = useState(itemDescription);
  const [ingredients, setIngredient] = useState(itemIngredient);
  const [vegetarian, setVegetarian] = useState(itemVegetarian);
  const [open, setOpen] = useState(false);
  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    console.log("hii")
    setOpen(true);
  };

  const handleEdit = async () => {
    console.log('cat: ', itemCategory);
    const payload = {
      category: itemCategory,
      id: parseInt(itemIndex, 10) + 1,
      name: name,
      cost: parseFloat(price),
      description: description,
      ingredients: ingredients,
      is_vegan: vegetarian
    };

    console.log('id: ', parseInt(itemIndex, 10) + 1);
    try {
      const response = await fetch('http://localhost:8000/menu/item/update/details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setOpen(false);
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error('error', error.message);
      handleShowSnackbar(error.message);
    }
  }

  useEffect(() => {
    setName(itemName);
    setPrice(itemPrice);
    setDescription(itemDescription);
    setIngredient(itemIngredient);
    setVegetarian(itemVegetarian);
  }, [itemName, itemPrice, itemDescription, itemIngredient, itemVegetarian]);
  
  return (
    <>
      <CardContent>
        <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', textAlign: "center" }}>
          {name.toUpperCase()}
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
          Ingredients: {ingredients}
        </Typography>
      </CardContent>
      
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
            onChange={(e) => setName(e.target.value)} />

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
              onChange={(e) => setPrice(e.target.value)} />

            <Box margin="3%">
              <FormControlLabel
                control={<Checkbox checked={vegetarian} />}
                label="Vegetarian"
                labelPlacement="start"
                onChange={(e) => setVegetarian(e.target.checked)} />
            </Box>
          </Box>

          <TextField
            label="Description"
            value={description}
            size="small"
            margin="normal"
            fullWidth
            onChange={(e) => setDescription(e.target.value)} />

          <TextField
            label="Ingredients"
            value={ingredients}
            size="small"
            margin="normal"
            fullWidth
            onChange={(e) => setIngredient(e.target.value)} />
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
      {showError}
    </>
  );
}
export default UpdateItemDetails;
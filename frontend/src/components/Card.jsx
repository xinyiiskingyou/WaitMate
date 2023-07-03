import React, { useState, useEffect } from "react";
import { Box, Card, FormControlLabel, CardActions, CardContent, Checkbox, Button, Typography, TextField, InputAdornment } from '@mui/material';
import veg from '../assets/vegan.png'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const MenuItem = ({ ItemName, ItemPrice, ItemDescription, ItemIngredient, ItemVegetarian, onItemRemove, ItemIndex, onItemsCategory, ItemCategory }) => {

    const [isEditable, setIsEditable] = useState(false);
    const [vegetarian, setVegetarian] = useState(ItemVegetarian);
    const [name, setName] = useState(ItemName);
    const [price, setPrice] = useState(ItemPrice);
    const [description, setDescription] = useState(ItemDescription);
    const [ingredient, setIngredient] = useState(ItemIngredient);

    const handleEdit = async () => {
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

      await fetch('http://localhost:8000/menu/item/update/details', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
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
          setIsEditable(!isEditable);
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
        headers: {'Content-Type': 'application/json'},
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

    const smallbuttonStyle = {
      color: 'white',
      backgroundColor: '#7CBD96',
    };

    const handleRemove = () => {
      const payload = {
        name: name
      };
      fetch('http://localhost:8000/menu/item/remove', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to remove item. Please try again.');
          }
        })
        .then(data => {
          onItemRemove();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }

    useEffect(() => {
      // Update the state values when the props change
      setName(ItemName);
      setPrice(ItemPrice);
      setDescription(ItemDescription);
      setIngredient(ItemIngredient);
      setVegetarian(ItemVegetarian);
    }, [ItemName, ItemPrice, ItemDescription, ItemIngredient, ItemVegetarian]);
    
    return (
        <Box margin='2%'>
          {isEditable ? (
          <Card>
          <CardContent>
            <TextField
              label="Name"
              disabled={!isEditable}
              value={name}
              size="small"
              margin= 'normal'
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />

            <Box display="flex" flexDirection="row" flexWrap="wrap">
              <TextField
                label="Price"
                disabled={!isEditable}
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
                  control={<Checkbox checked={vegetarian}/>}
                  disabled={!isEditable}
                  label="Vegetarian" 
                  labelPlacement="start"
                  onChange={(e) => setVegetarian(e.target.checked)}/>
              </Box>
            </Box>

            <TextField
              label="Description"
              disabled={!isEditable}
              value={description}
              size="small"
              margin= 'normal'
              fullWidth
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              label="Ingredients"
              disabled={!isEditable}
              value={ingredient}
              size="small"
              margin= 'normal'
              fullWidth
              onChange={(e) => setIngredient(e.target.value)}
            />
            </CardContent>

            <CardActions>
            {isEditable && (
              <Button size="small" onClick={handleEdit}>
              DONE
              </Button>
            )}

            </CardActions>
            </Card>
            ): (
              <Card>
                <CardContent>
                  <Typography variant="h4" gutterBottom style={{ display: 'flex'}}>
                    {name}   
                    {vegetarian && (
                      <img 
                        src={veg} 
                        alt="Icon" 
                        style={{
                          width: '6vh',
                          height: '6vh',
                          marginLeft: '10px',
                          borderRadius: '50%',
                        }}/>
                    )}                
                  </Typography>
                  <Typography variant="h6" gutterBottom style={{marginTop: '-10px'}}>${price}</Typography>

                  <Typography variant="h6" gutterBottom color={"grey"}>
                    {description}
                  </Typography>

                  <Typography variant="h7" gutterBottom>
                    Ingredients: {ingredient}
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button 
                    size="small" 
                    onClick={handleEdit}
                    style={{ color: 'white', backgroundColor: '#7CBD96' }}>
                    Update
                  </Button>
      
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
            ) }

            </Box>
    ); 
};

export default MenuItem;
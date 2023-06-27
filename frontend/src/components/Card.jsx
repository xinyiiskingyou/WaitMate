import React, { useState } from "react";
import { Box, Card, FormControlLabel, CardActions, CardContent, Checkbox, Button, Typography, TextField, InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import veg from '../assets/vege.jpeg'
const MenuItem = ({ ItemName, ItemPrice, ItemDescription, ItemIngredient, ItemVegetarian, onItemRemove }) => {

    const [isEditable, setIsEditable] = useState(false);
    const [Done, setDone] = useState(false);
    const [vegetarian, setVegetarian] = useState(ItemVegetarian);
    const [name, setName] = useState(ItemName);
    const [price, setPrice] = useState(ItemPrice);
    const [description, setDescription] = useState(ItemDescription);
    const [ingredient, setIngredient] = useState(ItemIngredient);
    const handleEdit = () => {
        setIsEditable(!isEditable);
    };

    const handleRemove = () => {
        onItemRemove();
    }
    const handleDone = () => {
        setDone(true);
        setIsEditable(!isEditable);
        };
    const cardStyle = {
        width: '390px',
        height: '390px',
    }
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
                <Button size="small" onClick={handleDone}>
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
                                width: '30%',
                                height: '30px',
                                borderRadius: '50%',
                            }}/>
                    )}                
                  </Typography>
                  <Typography variant="h6" gutterBottom style={{marginTop: '-10px'}}>${price}</Typography>

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
                    onClick={handleRemove}
                    style={{ color: 'white', backgroundColor: '#FF7A7A' }}>
                    Remove
                  </Button>
                </CardActions>
              </Card>     
            ) }

            </Box>
    ); 
};

export default MenuItem;
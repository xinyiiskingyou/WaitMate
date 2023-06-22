
import React, { useState } from "react";
import { Box, Card, FormControlLabel, CardActions, CardContent, Checkbox, Button, Typography, TextField, InputAdornment } from '@mui/material';

const Item = () => {

    const [isEditable, setIsEditable] = useState(false);
    const [Done, setDone] = useState(false);
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [ingredient, setIngredient] = useState("");
    const handleEdit = () => {
    console.log("I am here");
    setIsEditable(!isEditable);
    };

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
                <FormControlLabel control={<Checkbox/>} label="Vegetarian" labelPlacement="start"/>
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

            <Button size="small" onClick={handleEdit}>
            Edit
            </Button>


            {isEditable && (
                <Button size="small" onClick={handleDone}>
                DONE
                </Button>
            )}

            </CardActions>
            </Card>
            </Box>
    )
};

export default Item;
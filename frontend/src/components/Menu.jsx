import React, { useState } from 'react';
import { Drawer, Box, Button, Typography, TextField } from '@mui/material';

const Menu = ({ onCreateItem }) => {
  const [editing, setEditing] = useState(false);
  const [categoryText, setCategoryText] = useState('');
  const [newButtonVisible, setNewButtonVisible] = useState(false);

  const handleAddCategory = () => {
    setEditing(true);
    setNewButtonVisible(false);
  };

  const handleSaveCategory = () => {
    // Logic to save the category goes here
    console.log('Category saved:', categoryText);
    setEditing(false);
    setNewButtonVisible(true);
  };

  const handleTickButtonClick = () => {
    setNewButtonVisible(true);
    setEditing(true);
  };

  const handleNewButtonClick = () => {
    // Logic for the new button goes here
    console.log('New button clicked!');
  };

  const handleCategoryTextChange = (e) => {
    setCategoryText(e.target.value);
  };

  return (
    <Drawer variant="permanent">
      <Typography variant="h5" align="center" style={{ marginBottom: '20px' }}>
        Menu Category
      </Typography>
      {editing ? (
        <div>
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField
              id="category"
              label="Category"
              value={categoryText}
              onChange={(e) => setCategoryText(e.target.value)}
            />
            <Button onClick={handleSaveCategory} variant="contained" color="primary">
              Save Category
            </Button>
          </Box>
        </div>
      ) : newButtonVisible ? (
        <Button onClick={handleNewButtonClick} variant="contained" color="primary">
          {categoryText}
        </Button>
      ) : (
        <Button onClick={handleAddCategory} variant="contained" color="primary">
          Add Category
        </Button>
      )}
      {!editing && newButtonVisible && (
        <Button onClick={handleTickButtonClick} variant="contained" color="primary">
          Add Category
        </Button>
      )}
      {/* Other sidebar content */}
    </Drawer>
  );
};

export default Menu;


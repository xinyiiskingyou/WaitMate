import React, { useState } from 'react';
import { Card, CardActions, CardContent, Container, Drawer, Box, Button, Typography, TextField } from '@mui/material';
import Item from './Item';
const Menu = ({ onCreateItem }) => {
  const [editing, setEditing] = useState(false);
  const [categoryText, setCategoryText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuItems, setMenuItems] = useState({});
  const [adding, setAdding] = useState(false);
  const handleSaveCategory = () => {
    if (categoryText.trim() !== '') {
      setCategories([...categories, categoryText.trim()]);
      setMenuItems({ ...menuItems, [categoryText.trim()]: [] });
      setCategoryText('');
      setEditing(false);
    }
  };

  const handleNewButtonClick = () => {
    setEditing(true);
  };

  const handleCategoryTextChange = (e) => {
    setCategoryText(e.target.value);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddButtonClick = () => {
    setAdding(true);
  };
  const [isEditable, setIsEditable] = useState(false);
  const [name, setName] = useState("");

  const handleEdit = () => {
    console.log("I am here");
    setIsEditable(!isEditable);
  };
    const handleAddMenuItem = () => {
    // Add your logic to handle adding a menu item to the selected category
  };
  const buttonStyle = {
    margin: 10,
  }
  return (
    <Container maxWidth="sm">
    <Box sx={{ display: 'flex' }}>
    <Drawer variant="permanent">
      <Box 
        sx={{ 
          margin: 2, 
          borderRadius: 2, 
          bgcolor: '#ECEBEB',
          height: '100%',
          display:"flex",
          flexDirection:"column"
        }}>
        <Typography variant="h5" align="center" style={{ margin: '20px' }}>
          Menu Categories
        </Typography>
        {editing ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <TextField
              id="category"
              label="Category"
              value={categoryText}
              onChange={handleCategoryTextChange}
              margin="10px"
            />
            <Button 
              onClick={handleSaveCategory} 
              variant="contained" 
              color="primary"
              style={buttonStyle}
            >
              Save Category
            </Button>
          </Box>
        ) : (
          <Button 
            onClick={handleNewButtonClick} 
            variant="contained" 
            color="primary"
            style={buttonStyle}
          >
            Add Category
          </Button>
        )}
        {categories.map((category, index) => (
          <Button 
            key={index} 
            variant="outlined" 
            color="primary"
            style={buttonStyle}
            onClick={() => handleCategoryClick(category)}>
            {category}
          </Button>
        ))}
        {/* Other sidebar content */}
      </Box>
    </Drawer>

    <Box flexGrow={1} p={2}>
        {selectedCategory ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Category: {selectedCategory}
            </Typography>
            <Button
              onClick={handleAddButtonClick} >
              Add menu item
            </Button>
            <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            <Box width="48%" >
              </Box>
                <Item/>
              </Box>

            {
              menuItems[selectedCategory].map((menuItem, index) => (
                <Typography key={index} variant='body1'> {menuItem}</Typography>
              ))
            }
            {/* Render the list of cards for the selected category */}
            {/* You can replace this with your own implementation */}
          </Box>
        ) : (
          <Typography variant="h6" align="center" style={{ margin: '20px' }}>
            The menu item is currently empty. Please add an menu category to get started {selectedCategory}
          </Typography>
        )}
      </Box>
    </Box>
    </Container>
  );
};

export default Menu;

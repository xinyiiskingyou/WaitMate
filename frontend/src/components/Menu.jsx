import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardActions, CardContent, Container, Drawer, Box, Button, Typography, TextField } from '@mui/material';
import Item from './Item';
import MenuItem from './Card';

const Menu = () => {
  const [editing, setEditing] = useState(false);
  const [categoryEditingIndex, setCategoryEditingIndex] = useState(-1);
  const [categoryediting, setCategoryEditing] = useState(false);
  const [categoryText, setCategoryText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [menuItems, setMenuItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [cardData, setCardData] = useState({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false });

  const handleSaveCategory = () => {
    if (categoryText.trim() !== '') {
      setCategories([...categories, categoryText.trim()]);
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

  const handleCategoryClick = (index) => {
    setSelectedCategory(index);
  };

  const handleCategoryEdit = () => {
    setCategoryEditing(true);
  };

  const handleCategoryDone = () => {
    setCategoryEditing(false);
  };
  const handleAddButtonClick = () => {
    setAdding(true);
  };

  const handleCardDoneClick = (category, name, price, description, ingredient, vegetarian) => {
    console.log('hi');
    if (name && price && description && ingredient) {
      const newMenuItem = { category, name: name, price: price, description: description, ingredient: ingredient, vegetarian: vegetarian };
      setMenuItems((prevMenuItems) => [...prevMenuItems, newMenuItem]);
      console.log('Item details:', cardData);
      // Reset the form data
      setCardData({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false });
      setAdding(false);
    }
  };

  const handleRemoveItemClick = (index) => {
    setMenuItems((prevMenuItems) => {
      const updatedMenuItems = [...prevMenuItems];
      updatedMenuItems.splice(index, 1);
      return updatedMenuItems;
    });
  };
  
  const handleCardCancelClick = () => {
    setCardData({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false });
    setAdding(false);
  };
  
  const handleCardBlur = () => {
    if (cardData.name || cardData.price || cardData.description) {
      setAdding(false);
    }
  };
  const handleItemAdd = (name, price, description) => {
    // Perform any necessary logic with the item details
    console.log('Item details:', name, price, description);
  };

  const handleEditCategory = (index) => {
    setCategoryEditingIndex(index);
  };
  
  const handleSaveCategoryName = (index) => {
    // Save the updated category name
    const updatedCategories = [...categories];
    updatedCategories[index] = categories[index];
    setCategories(updatedCategories);
  
    // Reset the category editing index
    setCategoryEditingIndex(-1);
  };
  const handleCategoryInputChange = (value, index) => {
    setCategories((prevCategories) => {
      const updatedCategories = [...prevCategories];
      updatedCategories[index] = value;
      return updatedCategories;
    });
  };

  
  const theme = useTheme();
  const styles = {
    cardContainer: {
      display: 'flex',
      flexDirection:"row",
      gap: '5%',
    },
    card: {
      display:"flex", 
      flexDirection:"row",
      /* Additional styling properties as needed */
    },
  };
  const buttonStyle = {
    margin: '5%',
    width: '80%'
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
              size='small'
              variant='outlined'
              color='primary'
              style= {{margin: '5%', width: '80%'}}
              fullWidth
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
          <Box key={index}>
            {categoryEditingIndex === index ? (
              <Box display="flex" justifyContent="space-between">
                <TextField 
                  value={category} 
                  size='small'
                  variant='outlined'
                  color='primary'
                  style= {{margin: '5%', width: '80%'}}
                  onChange={(e) => handleCategoryInputChange(e.target.value, index)}
                  fullWidth
                />
                <Button
                onClick={() => handleSaveCategoryName(index)}
                variant="contained"
                color="primary"
                style={buttonStyle}>
                Save
                </Button>
              </Box>

            ) : (
              <Box display="flex" justifyContent="space-between">
                <Button 
                  variant="outlined" 
                  color="primary"
                  style={buttonStyle}
                  onClick={() => handleCategoryClick(index)}>
                  {category}
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  size='small'
                  style={buttonStyle}
                  onClick={() => handleEditCategory(index)}
                  >
                  Edit
                </Button>
              </Box>

            )}
          </Box>

        ))}
      </Box>
    </Drawer>

    <Box flexGrow={1} p={2}>
        {selectedCategory !== -1 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Category: {selectedCategory}
            </Typography>
            <Button
              variant='contained'
              onClick={handleAddButtonClick} >
              Add menu item
            </Button>

            <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} style={{ gap: '20px' }}>
            { adding && (
              <Box display="flex" flexDirection="row" alignItems="flex-start">
              <Item onItemAdd={handleCardDoneClick} onItemCancel={handleCardCancelClick} category={selectedCategory}/>
              <div onBlur={handleCardBlur} tabIndex={-1} />
              </Box>
            ) 
            }
            {menuItems
            .filter((menuItem) => menuItem.category === selectedCategory)
            .map((menuItem, index) => (
              <Box key={index} display="flex" flexDirection="row" mt={2}>
                <MenuItem
                  ItemName={menuItem.name}
                  ItemDescription={menuItem.description}
                  ItemPrice={menuItem.price}
                  ItemIngredient={menuItem.ingredient}
                  ItemVegetarian={menuItem.vegetarian}
                  onItemRemove={handleRemoveItemClick}/>
              </Box>
            ))}
            </Box>

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

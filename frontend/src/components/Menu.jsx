import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Card, CardActions, CardContent, Container, Drawer, Box, Button, Typography, TextField, ButtonGroup } from '@mui/material';
import Item from './Item';
import MenuItem from './Card';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { margin, width } from '@mui/system';

const Menu = () => {
  const [editing, setEditing] = useState(false);
  const [categoryEditingIndex, setCategoryEditingIndex] = useState(-1);
  const [categoryediting, setCategoryEditing] = useState(false);
  const [editedCategory, setEditedCategory] = useState('');
  const [categoryText, setCategoryText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [menuItems, setMenuItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [cardData, setCardData] = useState({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false });
  const [error, setError] = useState(null);

  const handleSaveCategory = () => {
    
    if (categoryText.trim() !== '') {
      const payload = { name: categoryText.trim() };

      fetch('http://localhost:8000/menu/category/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to save category');
          }
        })
        .then(data => {
          // Handle the response data if necessary
          setCategories([...categories, categoryText.trim()]);
          setCategoryText('');
          setEditing(false);
        })
        .catch(error => {
          // Handle the error if necessary
          console.error(error);
          alert('Failed to save category. Please try again.');
          setTimeout(() => {
            window.location.reload();
          }, 10);
        });
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
    fetchMenuItems(index);
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
  
  const handleSaveCategoryName = async (index) => {

    console.log(categories[index]);
    console.log(editedCategory);
    const payload = { 
      name: categories[index],
      new_name: editedCategory};

    await fetch('http://localhost:8000/menu/category/update/details', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to save category');
        }
      })
      .then(data => {
        // Save the updated category name
        const updatedCategories = [...categories];
        updatedCategories[index] = categories[index];
        setCategories(updatedCategories);
      
        // Reset the category editing index
        setCategoryEditingIndex(-1);
        setEditedCategory("");
      })
      .catch(error => {
        // Handle the error if necessary
        console.error(error);
        alert('Failed to rename the category. Please try again.');
        setTimeout(() => {
          window.location.reload();
        }, 10);
      });
  };
  const handleCategoryInputChange = (value) => {
    setEditedCategory(value);
  };

  const handleUpdateOrder = async (index, is_up) => {
    const payload = {
      id: parseInt(index, 10) + 1,
      name: categories[index],
      is_up: is_up};
    
    console.log(payload);
    await fetch('http://localhost:8000/menu/category/update/order', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update order');
        }
      })
      .then(data => {
        /* swap order*/
        const updatedCategories = [...categories];
        const currentIndex = parseInt(index, 10);
        const newIndex = is_up ? currentIndex - 1 : currentIndex + 1;
        [updatedCategories[currentIndex], updatedCategories[newIndex]] = [updatedCategories[newIndex], updatedCategories[currentIndex]];
        setCategories(updatedCategories);
      })
      .catch(error => {
        // Handle the error if necessary
        console.error(error);
        alert('Failed to update the order. Please try again.');
        setTimeout(() => {
          window.location.reload();
        }, 10);
      });
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/menu/list/categories');
      const data = await response.json();
      const categoryArray = Object.values(data);
      console.log(categoryArray);
      setCategories(categoryArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMenuItems = async (index) => {
    index = parseInt(index, 10) + 1;
    console.log(index);
    try {
      const response = await fetch('http://localhost:8000/menu/list/items/' + index);
      const data = await response.json();
      const itemArray = Object.values(data);
      console.log(itemArray);

      setMenuItems(itemArray);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories:', error);
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }
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

  const smallbuttonStyle = {
    marginTop: '15%',
    marginBottom: '5%',
    height: '50%',
  }

  return (
    <Container maxWidth="sm">
    {error && (
      <Card variant="outlined">
        <CardContent>
          <div className="error-alert">{error}</div>
        </CardContent>
      </Card>
    )}
    <Drawer 
      variant="permanent" 
      sx={{
        width: '400px', // Adjust the width as needed
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '400px', // Adjust the width as needed
          boxSizing: 'border-box',
        },
      }}>
      <Box 
        sx={{ 
          margin: 2, 
          borderRadius: 2, 
          bgcolor: '#ECEBEB',
          height: '100%',
          display:"flex",
          flexDirection:"column",
          width: '90%'
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
        
        { Object.entries(categories).map(([index, category]) => (
          <Box key={index}>
            {categoryEditingIndex === index ? (
              <Box display="flex" justifyContent="space-between">
                <TextField 
                  value={editedCategory || category} 
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

                <ButtonGroup variant="outlined" style={{smallbuttonStyle}}>

                <Button
                  color="primary"
                  style={{...smallbuttonStyle, padding: '4px 8px', fontSize: '10px'}}
                  onClick={() => handleEditCategory(index)}
                  >
                  Edit
                </Button>
                <Button
                  color="primary"
                  style={{ ...smallbuttonStyle, padding: '4px 8px', fontSize: '10px' }}
                  onClick={() => handleUpdateOrder(index, true)}
                  >
                  <ArrowUpwardIcon/>
                </Button>

                <Button
                  color="primary"
                  style={{ ...smallbuttonStyle, padding: '4px 8px',fontSize: '10px' }}
                  onClick={() => handleUpdateOrder(index, false)}
                  >
                  <ArrowDownwardIcon/>
                </Button>

                </ButtonGroup>
              </Box>

            )}
          </Box>

        ))}
      </Box>
    </Drawer>

    <Box 
      flexGrow={1} 
      p={2} 
      display="flex"
      height="80vh"
      >
        {selectedCategory !== -1 ? (
          <Box>
            <Box display="flex">
              
            </Box>
            <Typography variant="h6" gutterBottom>
              Menu items
            </Typography>
            <Button
              variant='contained'
              onClick={handleAddButtonClick} >
              Add menu item
            </Button>

            <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} style={{ gap: '20px' }}>
            { adding && (
              <Box display="flex" flexDirection="row" alignItems="flex-start">
              <Item onItemAdd={handleCardDoneClick} onItemCancel={handleCardCancelClick} category={categories[selectedCategory]}/>
              <div onBlur={handleCardBlur} tabIndex={-1} />
              </Box>
            ) 
            }
          { Object.entries(menuItems).map(([index, menuItem]) => (
              <Box key={index} display="flex" flexDirection="row" mt={2}>
              <MenuItem
                ItemName={menuItem.name}
                ItemDescription={menuItem.description}
                ItemPrice={menuItem.price}
                ItemIngredient={menuItem.ingredient}
                ItemVegetarian={menuItem.vegetarian}
                // onItemRemove={() => handleRemoveItemClick(index)
                onItemRemove={handleRemoveItemClick}/>
            </Box>
        ))}
        
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
          <Box 
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="80vh"
          >
          <Typography variant="h4" align="center" alignItems="center" style={{ margin: '20px' }}>
            The menu item is currently empty. Please add a menu category to get started.
          </Typography>
          </Box>
        )}
      </Box>

    </Container>
  );
};
export default Menu;

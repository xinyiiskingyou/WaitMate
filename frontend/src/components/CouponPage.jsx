import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardActions, CardContent, Container, Drawer, Box, Button, Typography, TextField, ButtonGroup, Grid } from '@mui/material';
import Item from './Item';
import MenuItem from './Card';
import { margin, width } from '@mui/system';

const Coupon = () => {
  const [editing, setEditing] = useState(false);
  const [categoryEditingIndex, setCategoryEditingIndex] = useState(-1);
  const [editedCategory, setEditedCategory] = useState('');
  const [categoryText, setCategoryText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [menuItems, setMenuItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [cardData, setCardData] = useState({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false, is_up: false });
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const onSubmit = (data) => {
    // Handle form submission
    console.log(data);
  };


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
          window.location.reload();
        });
    } else {
      window.location.reload();
    }
  };

  const handleNewButtonClick = () => {
    setEditing(true);
  };

  const handleCategoryTextChange = (e) => {
    setCategoryText(e.target.value);
  };

  const handleCategoryClick = (index) => {
    setMenuItems([]);
    setSelectedCategory(index);
    fetchMenuItems(index);
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
      setCardData({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false, is_up: false });
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
    setCardData({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false, is_up: false });
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
    const payload = { 
      name: categories[index],
      new_name: editedCategory};

    fetch('http://localhost:8000/menu/category/update/details', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          const updatedCategories = [...categories];
          updatedCategories[index] = editedCategory;
          setCategories(updatedCategories);
        
          // Reset the category editing index
          setCategoryEditingIndex(-1);
          setEditedCategory("");
          return response.json();
        } else {
          throw new Error('Failed to update category');
        }
      })
      .catch(error => {
        // Handle the error if necessary
        console.error(error);
        alert('Failed to rename the category. Please try again.');
        window.location.reload();
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
        window.location.reload();
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
      if (itemArray.length === 1) {
        if (itemArray[0].name !== null) {
          setMenuItems(itemArray);
        }
      } else {
        setMenuItems(itemArray);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories:', error);
      window.location.reload();
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
          Coupons
        </Typography>
        
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
        width="350px"
        >
        <Typography>Add new voucher</Typography>
          <Box 
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="80vh"
          >
        
        <form>
        <TextField label="Code" variant="outlined" fullWidth />
        <TextField label="Discount" variant="outlined" fullWidth />
        <TextField label="Expiry Date" variant="outlined" fullWidth />
        
        {/* Add more text fields as needed */}
        <Button variant="contained" color="primary" type="submit">
            Submit
        </Button>
        </form>
        </Box>
      </Box>

    </Container>
  );
};
export default Coupon;

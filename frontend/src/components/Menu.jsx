import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Drawer, Box, Button, Typography, TextField, ButtonGroup, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import Item from './Item';
import MenuItem from './Card';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import WestIcon from '@mui/icons-material/West';

const Menu = () => {
  const [editing, setEditing] = useState(false);
  const [categoryEditingIndex, setCategoryEditingIndex] = useState(-1);
  const [editedCategory, setEditedCategory] = useState('');
  const [categoryText, setCategoryText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const [menuItems, setMenuItems] = useState([]);
  const [adding, setAdding] = useState(false);
  const [cardData, setCardData] = useState({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false, is_up: false });

  const backLink = `/staff`;

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
          console.error(error);
          alert('Failed to add category. Please try again.');
          setCategoryText('');
          setEditing(false);
        });
    } else {
      alert('Failed to add category. Please try again.');
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
    fetchMenuItems(index);
  };

  const handleCategoryDone = () => {
    setEditing(false);
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
  
  const handleSaveCategoryName = async (index) => {

    console.log(categories[index]);
    console.log(editedCategory);

    const payload = { 
      name: categories[index],
      new_name: editedCategory
    };

    if (editedCategory === null || !editedCategory) {
      setCategoryEditingIndex(-1);
      setEditedCategory("");
      return;
    }

    await fetch('http://localhost:8000/menu/category/update/details', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to update category');
        }
      })
      .then(data => {
        // Save the updated category name
        const updatedCategories = [...categories];
        updatedCategories[index] = editedCategory;
        setCategories(updatedCategories);
      
        // Reset the category editing index
        setCategoryEditingIndex(-1);
        setEditedCategory("");
      })
      .catch(error => {
        // Handle the error if necessary
        console.error(error);
        alert('Failed to rename the category. Please try again.');
      });
  };

  const handleCancelSaveCategory = () => {
    setCategoryEditingIndex(-1);
    setEditedCategory("");
  }

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

  const AddbuttonStyle = {
    marginTop: '8%',
    marginButton: '10%',
    marginLeft: '10%',
    width: '80%',
    background: "#E0E0E0",
    border: "4px solid #FFA0A0",
    borderRadius: 15,
    color: 'black',
    fontWeight: 'bold'
  }

  const EditbuttonStyle = {
    marginTop: '2.5vh',
    marginLeft: '1vw',
    width: '55%',
    height: '80%',
    borderRadius: 10,
    color: 'black',
    fontWeight: 'medium',
    padding: '1%',
  }

  const buttonStyle = {
    margin: '5%',
    width: '70%',
    height: '80%',
  }

  const EditCatebuttonStyle = {
    marginTop: '20%',
    width: '10%',
    height: '40%',
  }

  const smallbuttonStyle = {
    marginTop: '2.9vh',
    height: '50%',
    border: '1px solid #bdbdbd',
    color: 'black'
  }

  return (
    <Container maxWidth="sm">

    <Drawer 
      variant="permanent" 
      sx={{
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '21.7vw', // Adjust the width as needed
          boxSizing: 'border-box',
        },
      }}>
      <Box 
        sx={{ 
          margin: 2, 
          borderRadius: 8, 
          bgcolor: '#ECEBEB',
          width: '20vw',
          height: '140vh',
          flexDirection:"column"
        }}>
        <Typography variant="h4" align="center" style={{ 
          fontSize: '1.5vw', 
          fontWeight: "bolder", 
          marginTop: '3vh',
        }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <Link to={backLink}>
                <Button              
                  sx={{ 
                    border: 5,
                    borderColor: '#FFA0A0',
                    borderRadius: 2,
                    color: 'black',
                    marginTop: '-1vh',
                    marginLeft: '0.5vw',
                    fontWeight: "bolder"
                  }}>
                  <WestIcon sx={{ fontSize: 20, marginRight: '5px' }} />
                </Button>
              </Link>
            </Grid>
            <Grid item xs={8} style={{ marginTop: '5vh', fontWeight: "bold" }}>
              Menu Categories
            </Grid>
          </Grid>
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
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={handleSaveCategory} 
                variant="contained" 
                color="primary"
                style={{...buttonStyle, background: "#81c784"}}
              >
                Save
              </Button>
              <Button 
                onClick={handleCategoryDone} 
                variant="contained" 
                color="primary"
                style={{...buttonStyle, background: "#ffc570"}}
              >
                Cancel
              </Button>
            </div>
          </Box>
        ) : (
          <Button 
            onClick={handleNewButtonClick} 
            variant="contained" 
            color="primary"
            style={AddbuttonStyle}
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
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                  <Button 
                    onClick={() => handleSaveCategoryName(index)}
                    variant="contained"
                    color="primary"
                    style={{...EditCatebuttonStyle, background: "#81c784", marginRight: '5px'}}>
                    <DoneIcon />
                  </Button>
                  <Button 
                    onClick={handleCancelSaveCategory} 
                    variant="contained" 
                    color="primary"
                    style={{...EditCatebuttonStyle, background: "#ffc570"}}
                  >
                    <ClearIcon />
                  </Button>
                </div>
              </Box>
            ) : (
              <Box display="flex" justifyContent="space-evenly">
                <Button 
                  variant="outlined" 
                  color="primary"
                  style={{...EditbuttonStyle, 
                    border: selectedCategory===index ? "3px solid #FFA0A0" :"3px solid #bdbdbd",
                    background: selectedCategory===index ? "#FFCFCF" : "#E0E0E0"
                  }}
                  onClick={() => handleCategoryClick(index)}>
                  {category}
                </Button>

                <ButtonGroup variant="outlined" style={{smallbuttonStyle}}>
                  <Button
                    color="primary"
                    style={{...smallbuttonStyle, padding: '4px', fontSize: '10px'}}
                    onClick={() => handleEditCategory(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="primary"
                    style={{ ...smallbuttonStyle, padding: '4px', fontSize: '10px' }}
                    onClick={() => handleUpdateOrder(index, true)}
                    >
                    <ArrowUpwardIcon/>
                  </Button>

                  <Button
                    color="primary"
                    style={{ ...smallbuttonStyle, padding: '4px',fontSize: '10px' }}
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
        width="350px"
        marginLeft="-15vh"
        >
        {selectedCategory !== -1 ? (
          <Box>
            <Box display="flex">
            </Box>
            <Typography variant="h4" gutterBottom>
              <b>Menu items</b>
            </Typography>
            <Button
              variant='contained'
              onClick={handleAddButtonClick} 
              style={{
                background: "#eeeeee",
                border: "4px solid #FFA0A0",
                color: 'black',
                fontWeight: 'bold',
                borderRadius: 10,
              }}
            >
              Add menu item
            </Button>

            <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} style={{ gap: '10px' }}>
              { adding && (
                <Box display="flex" flexDirection="row" alignItems="flex-start">
                  <Item onItemAdd={handleCardDoneClick} onItemCancel={handleCardCancelClick} category={categories[selectedCategory]}/>
                  <div onBlur={handleCardBlur} tabIndex={-1} />
                </Box>
              )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1vw' }}>
                {Object.entries(menuItems)
                  .filter(([index, menuItem]) => menuItem.name !== null)
                  .map(([index, menuItem]) => (
                    <div style={{ width: '20vw', height: '30vh', margin: '4%' }}>
                      <MenuItem
                        ItemCategory={categories[selectedCategory]}
                        ItemIndex={index}
                        ItemName={menuItem.name}
                        ItemDescription={menuItem.description}
                        ItemPrice={menuItem.cost}
                        ItemIngredient={menuItem.ingredients}
                        ItemVegetarian={menuItem.vegetarian}
                        onItemRemove={() => handleRemoveItemClick(index)}
                        onItemsCategory={() => handleCategoryClick(selectedCategory)}
                      />
                    </div>
                ))}
              </div>
                {menuItems
                  .filter((menuItem) => menuItem.category === selectedCategory && menuItem.name !== null)
                  .map((menuItem, index) => (
                      <MenuItem
                        ItemName={menuItem.name}
                        ItemDescription={menuItem.description}
                        ItemPrice={menuItem.cost}
                        ItemIngredient={menuItem.ingredients}
                        ItemVegetarian={menuItem.vegetarian}
                        onItemRemove={() => handleRemoveItemClick(index)}
                      />
                ))}
            </Box>
        </Box>
        ) : (
          <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Typography variant="h5" style={{ margin: '20px' }}>
            Edit menu here. <span role="img" aria-label="Smiley">&#128512;</span>
          </Typography>
        </Box>
          )}
      </Box>

    </Container>
  );
};
export default Menu;

import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardActions, sizing, CardContent, Container, Grid, Drawer, Box, Button, Typography, TextField } from '@mui/material';
import Item from './Item';
import {Link} from 'react-router-dom';

const Browse = () => {
  
  // // const [editing, setEditing] = useState(false);
  // // const [categoryEditingIndex, setCategoryEditingIndex] = useState(-1);
  // // const [categoryediting, setCategoryEditing] = useState(false);
  // // const [quantityText, setCategoryText] = useState('');
  // // const [categories, setCategories] = useState([]);
  // // const [selectedCategory, setSelectedCategory] = useState(-1);
  // // const [menuItems, setMenuItems] = useState([]);
  // // const [adding, setAdding] = useState(false);
  // // const [cardData, setCardData] = useState({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false });

  // // const handleSaveQuantity = () => {
  // //   if (quantityText.trim() !== '') {
  // //     const payload = { name: quantityText.trim() };

  // //     fetch('http://localhost:8000/order/customer/add', {
  // //       method: 'POST',
  // //       headers: {
  // //         'Content-Type': 'application/json',
  // //       },
  // //       body: JSON.stringify(payload),
  // //     })
  // //       .then(response => {
  // //         if (response.ok) {
  // //           return response.json();
  // //         } else {
  // //           throw new Error('Failed to save category');
  // //         }
  // //       })
  // //       .then(data => {
  // //         // Handle the response data if necessary
  // //         setCategories([...categories, quantityText.trim()]);
  // //         setCategoryText('');
  // //         setEditing(false);
  // //       })
  // //       .catch(error => {
  // //         // Handle the error if necessary
  // //         console.error(error);
  // //       });
  // //   }
  // // };

  // // const handleNewButtonClick = () => {
  // //   setEditing(true);
  // // };

  // // const handleCategoryTextChange = (e) => {
  // //   setCategoryText(e.target.value);
  // // };

  // // const handleCategoryClick = (index) => {
  // //   setSelectedCategory(index);
  // // };

  // // const handleCategoryEdit = () => {
  // //   setCategoryEditing(true);
  // // };

  // // const handleCategoryDone = () => {
  // //   setCategoryEditing(false);
  // // };
  // // const handleAddButtonClick = () => {
  // //   setAdding(true);
  // // };

  // // const handleCardDoneClick = (category, name, price, description, ingredient, vegetarian) => {
  // //   console.log('hi');
  // //   if (name && price && description && ingredient) {
  // //     const newMenuItem = { category, name: name, price: price, description: description, ingredient: ingredient, vegetarian: vegetarian };
  // //     setMenuItems((prevMenuItems) => [...prevMenuItems, newMenuItem]);
  // //     console.log('Item details:', cardData);
  // //     // Reset the form data
  // //     setCardData({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false });
  // //     setAdding(false);
  // //   }
  // // };

  // // const handleRemoveItemClick = (index) => {
  // //   setMenuItems((prevMenuItems) => {
  // //     const updatedMenuItems = [...prevMenuItems];
  // //     updatedMenuItems.splice(index, 1);
  // //     return updatedMenuItems;
  // //   });
  // // };
  
  // // const handleCardCancelClick = () => {
  // //   setCardData({ category: -1, name: '', price: '', description: '', ingredient: '', vegetarian: false });
  // //   setAdding(false);
  // // };
  
  // // const handleCardBlur = () => {
  // //   if (cardData.name || cardData.price || cardData.description) {
  // //     setAdding(false);
  // //   }
  // // };
  // // const handleItemAdd = (name, price, description) => {
  // //   // Perform any necessary logic with the item details
  // //   console.log('Item details:', name, price, description);
  // // };

  // // const handleEditCategory = (index) => {
  // //   setCategoryEditingIndex(index);
  // // };
  
  // // const handleSaveCategoryName = (index) => {
  // //   // Save the updated category name
  // //   const updatedCategories = [...categories];
  // //   updatedCategories[index] = categories[index];
  // //   setCategories(updatedCategories);
  
  // //   // Reset the category editing index
  // //   setCategoryEditingIndex(-1);
  // // };
  // // const handleCategoryInputChange = (value, index) => {
  // //   setCategories((prevCategories) => {
  // //     const updatedCategories = [...prevCategories];
  // //     updatedCategories[index] = value;
  // //     return updatedCategories;
  // //   });
  // // };

  
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
    },
  };
  const buttonStyle = {
    margin: '5%',
    width: '90%',
    height: '45px'
  }
  const cardStyle = {
    width: '390px',
    height: '390px',
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
            <Button variant="contained"  style={buttonStyle}>  
                Main Dish
            </Button>
            <Button variant="contained"  style={buttonStyle}>  
                Side Dish
            </Button>
            <Button variant="contained" color="primary" style={buttonStyle}>  
                Salad
            </Button>
            <Button variant="contained" color="primary" style={buttonStyle}>  
                Beverages
            </Button> 
            <Button variant="contained" color="primary" style={buttonStyle}>  
                Dessert
            </Button>   
            </Box>
            <Grid container direction="column" spacing={2}>
                <Link to="/Cart">
                    <Button variant="contained" color="primary" style={{margin: '17%', spacing: '-20', width: '70%', height: '45px'}}>  
                        Order Summary
                    </Button> 
                </Link>
            </Grid>
            </Drawer>

     <Box flexGrow={1} p={2}>
        <Typography variant="h5" align="center" style={{ margin: '5px' }}>
             Please browse and order from the menu below.
        </Typography>
        <div>
        <Box margin='3%'>
        <Card width='30%' margin-bottom= '20px'>
            <CardContent>
                <Typography variant="h6" align="left" style={{ margin: '2px' }}>
                    Chicken Supreme
                </Typography>
                <TextField label="Enter quantity" width='50%' margin='3%'/>
                <Button variant="contained" color="primary" style={{margin: '1%', width: '20%', height: '45px'}}>
                    Confirm
                </Button>
            </CardContent>
        </Card> 
        </Box>
        </div>
        <div>
        <Box margin='3%'>
        <Card width='30%' margin-bottom= '20px'>
            <CardContent>
                <Typography variant="h6" align="left" style={{ margin: '2px' }}>
                    Frozen yoghurt
                </Typography>
                <TextField label="Enter quantity" width='50%' margin='3%'/>
                <Button variant="contained" color="primary" style={{margin: '1%', width: '20%', height: '45px'}}>
                    Confirm
                </Button>
            </CardContent>
        </Card>
        </Box>
        </div> 
        <div>
        <Box margin='3%'>
        <Card width='30%' margin-bottom= '20px'>
            <CardContent>
                <Typography variant="h6" align="left" style={{ margin: '2px' }}>
                    Carbonara
                </Typography>
                <TextField label="Enter quantity" width='50%' margin='3%'/>
                <Button variant="contained" color="primary" style={{margin: '1%', width: '20%', height: '45px'}}>
                    Confirm
                </Button>
            </CardContent>
        </Card>
        </Box>
        </div> 
        <div>
        <Box margin='3%'>
        <Card width='30%' margin-bottom= '20px'>
            <CardContent>
                <Typography variant="h6" align="left" style={{ margin: '2px' }}>
                    Lasagne
                </Typography>
                <TextField label="Enter quantity" width='50%' margin='3%'/>
                <Button variant="contained" color="primary" style={{margin: '1%', width: '20%', height: '45px'}}>
                    Confirm
                </Button>
            </CardContent>
        </Card>
        </Box>
        </div> 
        <div>
        <Box margin='3%'>
        <Card width='30%' margin-bottom= '20px'>
            <CardContent>
                <Typography variant="h6" align="left" style={{ margin: '2px' }}>
                    Eclair
                </Typography>
                <TextField label="Enter quantity" width='50%' margin='3%'/>
                <Button variant="contained" color="primary" style={{margin: '1%', width: '20%', height: '45px'}}>
                    Confirm
                </Button>
            </CardContent>
        </Card>
        </Box>
        </div> 
     </Box>
    </Box>
    </Container>
    
  );
};

export default Browse;

import React, { useState,useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Drawer, Box, Button, Typography } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ItemCard from './CardCust';


const Browse = () => {
    let [cats, setCategories] = useState([])
    let [menuItems, setItems] = useState([])
    let [cat, setCurrCat] = useState(-1)


    const id = useParams();
    const backLink = `/CustomerMain/${id.id}` 
    const cartLink = `/Cart/${id.id}` 

    let handleCatChange = (category) => {
      cat = category.id
      
      getItems()
      console.log(category.id)
      console.log(cat)

      console.log(menuItems)
      console.log('end')
    }

    let getCategories = async () => {
        let response = await fetch(`http://localhost:8000/menu/list/categories`)
        let data = await response.json()

        let categories = []
        for (var i of data) {
          console.log(i)
          categories.push({
            name: i.name,
            id: i.id,
          })
        }
        console.log(categories)

        setCategories(categories)    
        if (categories.length > 0) {
            getItems()
            setCurrCat(categories[0].id)
        }
    }

    useEffect(() => {
        getCategories()
      }, [])

    let getItems = async () => {
      if (cat === -1) {
        return
      }

      let response = await fetch(`http://localhost:8000/menu/list/items?cat_id=${cat}`)
      let data = await response.json()
      let items = []
      for (var i of data) {
        console.log(i)
        items.push({
          name: i[0],
          id: i[5],
          description: i[2],
          ingredient: i[3],
          vegetarian: i[4],
          price: i[1]
        })
      }
      setItems(items)
      console.log(items)

    }
  
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
            {cats.map((category) => (

                <List key={category.name}>
                    <ListItem disablePadding value={category} onClick={()=>handleCatChange(category)}>
                        <ListItemButton>
                            <ListItemText 
                            primary={category.name}/>
                        </ListItemButton>
                    </ListItem>
                    {/* <ListItem disablePadding>
                        <ListItemButton component="a"
                            href="#simple-list">
                            <ListItemText 
                            primary="PHP" />
                        </ListItemButton>
                    </ListItem> */}

                </List>
            ))}

            {/* <Button variant="contained"  style={buttonStyle}>  
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
            </Button>    */}
            </Box>
            <Grid container direction="column" spacing={2}>
                <Link to={cartLink}>
                    <Button variant="contained" color="primary" style={{margin: '17%', spacing: '-20', width: '70%', height: '45px'}}>  
                        Order Summary
                    </Button> 
                </Link>
            </Grid>
            </Drawer>

      <Box flexGrow={1} p={2}>
        {cat !== -1 ? (
          <Box>
           <Typography variant="h5" align="center" style={{ margin: '5px' }}>
             Please browse and order from the menu below.
            </Typography> 

            <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} style={{ gap: '20px' }}>

            { Object.entries(menuItems).map(([name, menuItem]) => (
              <Box key={name} display="flex" flexDirection="row" >
                <Typography variant="h5" align="center" style={{ margin: '5px' }}>
                  1 22
                </Typography> 
                <ItemCard
                  ItemName={menuItem.name}
                  ItemDescription={menuItem.description}
                  ItemPrice={menuItem.price}
                  ItemIngredient={menuItem.ingredient}
                  ItemVegetarian={menuItem.vegetarian}
                  TableID={id.id}/>
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
            No Menu Item 
          </Typography>
          </Box>
        )}

        {/* <div>
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
        </div>  */}
     </Box>
    </Box>
    </Container>
    
  );
};

export default Browse;

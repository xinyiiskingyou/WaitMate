import React, { useState, useEffect } from "react";
import { 
  Container,
  Box,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  IconButton,
  ThemeProvider,
  AppBar,
  Toolbar,
  Button,
  createTheme
} from "@mui/material";
import { Link, useParams } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListCategories from './Category/ListCategories';
import ListItems from './Items/ListItems';
import BrowseItems from './Items/BrowseItems';
import SendNotification from "../Notifications/SendNotification";
import WaitMate from "../../assets/WaitMate.png";

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FBDDDD",
          },
          "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#FBDDDD",
            },
        },
      },
    },
  },
});

const BrowseMenu = () => {
  const { categories } = ListCategories();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryID, setCurrCategoryID] = useState(-1)
  const { menuItems, setMenuItems, fetchMenuItems } = ListItems(categoryID);
  const id = useParams();
  const cartLink = `/cart/${id.id}` 

  const handleCategoryChange = (index, category) => {
    setMenuItems([]);
    setCurrCategoryID(index);
    setCurrentCategory(category);
    fetchMenuItems(index);
    console.log(menuItems)
  };

  useEffect(() => {
    window.addEventListener('popstate', (e) => {
      window.history.go(1);
    });
  }, []);
  
  return (
    <Container maxWidth="sm">
      <ThemeProvider theme={theme}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <img src={WaitMate} style={{ width: '200px', marginRight: '10px' }} />
            <div style={{ display: 'flex', marginLeft: '500px', alignItems: "flex-end", justifyContent: 'space-between', gap: "45px" }}>
                <Button style={{color:"black", fontWeight:"bolder"}} component={Link} to="/browse/:id">
                  Menu
                </Button>
                <Button style={{color:"black", fontWeight:"bolder"}} component={Link} to="/button2">
                  Too Bored?
                </Button>
                <Button style={{color:"black", fontWeight:"bolder"}} component={Link} to="/manager/coupon">
                  Meme of the Week
                </Button>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </ThemeProvider>
      <Box sx={{ display: "flex"}}>
     
        {/* <Drawer variant="permanent"> */}
       
          <Box
            sx={{
              margin: 2,
              mt: 10,
              borderRadius: 8,
              bgcolor: '#FFFFFF',
              width: '20vw',
              height: '70vh',
              flexDirection: 'column',
              justifyContent: "flex-start"
            }}
          >
            <Typography
              variant="h4"
              align="center"
              style={{
                fontSize: '1.5vw',
                fontWeight: 'bolder',
                marginTop: '20vh',
              }}
            >
              Menu Categories
            </Typography>
            { Object.entries(categories).map(([index, category]) => (
              <List key={category}>
                <ListItem disablePadding value={category} onClick={()=>handleCategoryChange(index, category)}>
                  <ListItemButton>
                    <ListItemText 
                      primary={category.toUpperCase()}
                      primaryTypographyProps={{ 
                        style: { 
                          fontSize: '1vw', 
                          border: category === currentCategory ? "5px solid #FFA0A0" :"5px solid #bdbdbd",
                          borderRadius: 18, 
                          padding: '0.5vh',
                          textAlign: "center",
                          background: category === currentCategory ? "#FFCFCF" : "#E0E0E0",
                          marginBottom: '-1.5vh'
                        } 
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            ))}

            <Grid container direction="column" spacing={0}>
              <Link to={cartLink}>
                <IconButton sx={{
                  margin: '15%', 
                  spacing: '-20', 
                  width: '70%', 
                  height: '5vh',
                  border: "6px solid #FFA0A0",
                  background: "#FFCFCF",
                  color: 'black',
                  fontSize: '1vw',
                  borderRadius: 8,
                }}>
                  Order Summary <ShoppingCartIcon />
                </IconButton>
              </Link>
            </Grid>

          </Box>
        {/* </Drawer> */}
        <Box flexGrow={1} p={2} marginLeft="-22%">
          <Grid container columnGap={3} justifyContent="right" alignItems="right">
            <SendNotification id={id.id} />
          </Grid>
          {categoryID !== -1 ? (
            <Box>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.1vw',  gridRowGap: '2vw' }}>
              {Object.entries(menuItems)
                .filter(([_, menuItem]) => menuItem.name !== null)
                .map(([index, menuItem]) => (
                  <div style={{ width: '20vw', height: '30vh', margin: '5%' }}>
                    <BrowseItems
                      itemName={menuItem.name}
                      itemPrice={menuItem.cost}
                      itemDescription={menuItem.description}
                      itemIngredient={menuItem.ingredients} 
                      itemVegetarian={menuItem.is_vegan}
                      tableID={id.id}
                    />
                  </div>
                ))}
              </div>
            </Box>
          ) : (
            <Box 
              display="flex"
              alignItems="center"
              justifyContent="center"
              height="80vh"
            >
              <Typography variant="h4" justifyContent="flex-end" alignItems="flex-end" mr= {- 20} style={{ margin: '20px' }}>
                No Menu Item 
              </Typography>
            </Box>
        )}
        </Box>
      </Box>
    </Container>
  );
};

export default BrowseMenu;

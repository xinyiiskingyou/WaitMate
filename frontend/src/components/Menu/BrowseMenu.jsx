import React, { useState, useEffect } from "react";
import { 
  Container,
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
  createTheme,
  Paper,
  Pagination, 
  PaginationItem,
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

const buttonStyle = {
  color:"black", 
  fontWeight:"bolder"
};
const ITEMS_PER_PAGE = 6;

const BrowseMenu = () => {
  const { categories } = ListCategories();
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryID, setCurrCategoryID] = useState(-1)
  const { menuItems, setMenuItems, fetchMenuItems } = ListItems(categoryID);
  const id = useParams();
  const cartLink = `/cart/${id.id}` 

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsForCurrentPage = menuItems.slice(startIndex, endIndex);

  const handleCategoryChange = (index, category) => {
    setMenuItems([]);
    setCurrCategoryID(index);
    setCurrentCategory(category);
    fetchMenuItems(index);
    console.log(menuItems)
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
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
                <img src={WaitMate} alt={WaitMate} style={{ width: '200px', marginRight: '10px' }} />
                <div style={{ display: 'flex', marginLeft: '500px', alignItems: "flex-end", justifyContent: 'space-between', gap: "50px" }}>
                  <Button style={buttonStyle} component={Link} to={`/browse/${id.id}`}>
                    Menu
                  </Button>
                  <Button style={buttonStyle} component={Link} to="/button2">
                    Meme of the Week
                  </Button>
                  <Button style={buttonStyle} component={Link} to="/button2">
                    Too Bored?
                  </Button>
                  <SendNotification id={id.id}/>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </ThemeProvider>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}>
        <Drawer
          variant="permanent"
          PaperProps={{ style: { 
            marginTop: "90px",
            width: '250px', 
            height: "86vh", 
            borderTopRightRadius: '20px',
            borderBottomRightRadius: '20px'
          }}}>
          <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
            <Typography variant='h5'style={{margin: "20px"}}>
              Menu Category
            </Typography>
          </div>

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
                fontSize: '15px',
                borderRadius: 8,
              }}>
                Order Summary <ShoppingCartIcon />
              </IconButton>
            </Link>
          </Grid>
        </Drawer>
        
        {categoryID !== -1 ? (
          <Paper elevation={3} sx={{
            padding: "20px",
            borderRadius: "8px",
            width: "1150px", 
            height: "570px", 
            marginLeft: "200px",
            position: 'absolute',
            marginTop: '60px',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1vw'}}>
              {Object.entries(itemsForCurrentPage)
                .filter(([_, menuItem]) => menuItem.name !== null)
                .map(([index, menuItem]) => (
                  <BrowseItems
                    itemName={menuItem.name}
                    itemPrice={menuItem.cost}
                    itemDescription={menuItem.description}
                    itemIngredient={menuItem.ingredients} 
                    itemVegetarian={menuItem.is_vegan}
                    tableID={id.id}
                  />
                ))}
            </div>
          </Paper>
        ) : (<></>)}

        <div style={{ position: 'absolute', bottom: '22px', left: '55%', transform: 'translateX(-50%)' }}>
          <Pagination
            count={Math.ceil(menuItems.length / ITEMS_PER_PAGE)}
            page={currentPage}
            onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                component={IconButton}
                {...item}
              />
            )}
          />
        </div>
      </div>
    </Container>
  );
};

export default BrowseMenu;

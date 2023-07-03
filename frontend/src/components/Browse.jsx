import React, { useState,useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Drawer, Box, Button, Typography } from '@mui/material';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ItemCard from './CardCust';
import WestIcon from '@mui/icons-material/West';
import cart from '../assets/cart.png'
import boring from '../assets/boring.png'
import meme from '../assets/meme.png'
import bell from '../assets/bell.png'
import thanks from '../assets/thank-you.png'

const Browse = () => {
    let [cats, setCategories] = useState([])
    let [menuItems, setItems] = useState([])
    let [cat, setCurrCat] = useState(-1)
    const [open, setOpen] = useState(false);

    const id = useParams();
    const backLink = `/CustomerMain/${id.id}` 
    const cartLink = `/Cart/${id.id}` 

    let handleCatChange = (category) => {
      cat = category.id
      getItems()
    }

    let getCategories = async () => {
        let response = await fetch(`http://localhost:8000/menu/list/categories`)
        let data = await response.json()

        let categories = []
        for (const [key, value] of Object.entries(data)) {
          console.log(key, value)
          categories.push({
            name: value,
            id: key,
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

      let response = await fetch(`http://localhost:8000/menu/list/items/${cat}`)
      let data = await response.json()
      console.log(data)

      let items = []
      for (var i of data) {
        if (i[0] === null) {
          break
        }
        console.log(i)
        items.push({
          name: i.name,
          description: i.description,
          ingredient: i.ingredients,
          vegetarian: i.is_vegan,
          cost: i.cost,
        })
      }
      setItems(items)
      console.log(items)
    }
  
  const handleClose = () => {
    setOpen(false);
  };

  const handle_require_assistance = async () => {
    const payload = {
      table_id: id.id,
      status: "ASSIST"
    };
    fetch('http://localhost:8000/notification/customer/send', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(response => {
      if (response.ok) {
        setOpen(true);
        return response.json();
      } else {
        throw new Error('Please try again.');
      }
    }).catch(error => {
      // Handle the error if necessary
      console.error(error);
      alert(error);
    });
  }
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

  const cardStyle = {
    width: '390px',
    height: '390px',
  }

  const buttonStyle = { 
    border: '4px solid #FFA0A0', 
    height: '8vh', 
    width: '10vw',
    textAlign: 'center', 
    justifyContent: 'center',
    background: "transparent",
    color: 'black',
    fontWeight: "bolder",
    borderRadius: 6,
  }
  return (
    <Container maxWidth="sm">
      
        <Box sx={{ display: 'flex' }}>
            <Drawer variant="permanent">
            
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
              Menu Categories
            </Typography>

            {cats.map((category) => (
                <List key={category.name}>
                  <ListItem disablePadding value={category} onClick={()=>handleCatChange(category)}>
                      <ListItemButton>
                        <ListItemText 
                          primary={category.name.toUpperCase()}
                          primaryTypographyProps={{ 
                            style: { 
                              fontSize: '1.05vw', 
                              border: "5px solid #bdbdbd",
                              borderRadius: 18, 
                              padding: '6px',
                              textAlign: "center",
                              letterSpacing: "0.05vw",
                              background:'#e0e0e0',
                              marginBottom: '-1.5vh'
                            } 
                          }} 
                        />
                      </ListItemButton>
                  </ListItem>
                </List>
            ))}
            </Box>
            <Grid container direction="column" spacing={2}>
                <Link to={cartLink}>
                  <Button variant="contained" color="primary" style={{
                    margin: '17%', 
                    spacing: '-20', 
                    width: '70%', 
                    height: '45px',
                    border: "6px solid #FFA0A0",
                    background: "#ffcfcf",
                    color: 'black',
                    fontSize: '0.8vw',
                    borderRadius: 8,
                  }}>  
                    Order Summary  <img src={cart} alt="CartIcon" style={{ height: "30px", width: "30px", marginLeft: "5px" }} />
                  </Button> 
                </Link>
            </Grid>
            </Drawer>

      <Box flexGrow={1} p={2}>
        {cat !== -1 ? (
          <Box>
          <Grid container columnGap={3} justifyContent="flex-end" marginLeft='25vw'>
            <Grid item>
              <Button 
                variant="contained" 
                color="primary" 
                style={buttonStyle}
                onClick={() => handle_require_assistance()}
              >
                <img src={bell} alt="BellIcon" style={{
                  width: '3vw',
                  height: '5vh',
                  marginLeft: '0.2vw'
                }}/>
                Require Assistance
              </Button>

              <Dialog open={open} onClose={handleClose} fullWidth>
                <img src={thanks} alt="ThanksIcon" style={{
                  width: '9.6vw',
                  height: '21vh',
                  marginTop: '1.5vh',
                  marginLeft: '14vw'
                }}/>
                <DialogContent style={{ fontSize: '25px', textAlign: 'center', padding: '20px', letterSpacing: '0.4px' }}>
                  Request received. <br />
                  Our staff will be with you shortly.
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" color="primary" onClick={handleClose} style={{ background: "#FFA0A0" }}>
                    Confirm
                  </Button>
                </DialogActions>
              </Dialog>

            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" style={buttonStyle}>
                <img src={boring} alt="BoringIcon" style={{
                  width: '4vw',
                  height: '6vh',
                  marginTop: '0.5vh',
                  marginRight: '1vw',
                }}/>
                Too Bored?
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" style={buttonStyle}>
                <img src={meme} alt="MemeIcon" style={{
                  width: '4.2vw',
                  height: '6.2vh',
                  marginRight: '1vw'
                }}/>
                Memes
              </Button>
            </Grid>
          </Grid>

            <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} 
              style={{ 
                gap: '10px',
              }}>
              
              <Grid container spacing={25}>
              { Object.entries(menuItems).map(([name, menuItem]) => (
                  <Grid item key={name} xs={12} sm={8} md={6} sx={{ marginTop: '2px', marginBottom: '1px', borderRadius: 40 }}>
                    <ItemCard
                      ItemName={menuItem.name}
                      ItemDescription={menuItem.description}
                      ItemPrice={menuItem.cost}
                      ItemIngredient={menuItem.ingredient}
                      ItemVegetarian={menuItem.vegetarian}
                      TableID={id.id}/>
                  </Grid>
              ))}
              </Grid>
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
     </Box>
    </Box>
    </Container>
    
  );
};

export default Browse;

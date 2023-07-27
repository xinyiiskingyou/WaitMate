import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { 
  Drawer, 
  Box,
  Typography,
  Grid, 
  Button,
  TextField,
  ButtonGroup,
  Container
} from "@mui/material";
import ListCategories from "./Category/ListCategories";
import WestIcon from '@mui/icons-material/West';
import AddCategory from "./Category/AddCategoy";
import UpdateCategoryName from "./Category/UpdateCategoryName";
import UpdateCategoryOrder from "./Category/UpdateCategoryOrder";
import ListItems from './Items/ListItems'
import ManageItems from './Items/ManageItems'
import coupon from '../../assets/coupon.png'
import meme from '../../assets/meme.png'

const EditButtonStyle = {
  marginTop: '2.5vh',
  marginLeft: '1vw',
  width: '55%',
  height: '80%',
  borderRadius: 10,
  color: 'black',
  fontWeight: 'medium',
  padding: '1%',
}

const smallbuttonStyle = {
  marginTop: '2.9vh',
  height: '50%',
  border: '1px solid #bdbdbd',
  color: 'black'
}

const AddbuttonStyle = {
  marginTop: '8%',
  marginButton: '10%',
  marginLeft: '10%',
  width: '80%',
  background: "transparent",
  border: "4px solid #FFA0A0",
  borderRadius: 15,
  color: 'black',
  fontWeight: 'bold'
}

const ManageMenu = () => {
  const { categories, setCategories } = ListCategories();
  const [categoryEditingIndex, setCategoryEditingIndex] = useState(-1);
  const [editedCategory, setEditedCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(-1);

  const { menuItems, setMenuItems, fetchMenuItems } = ListItems(selectedCategory);

  const backLink = `/staff`;
  const [cookies] = useCookies(['token']);
  
  const navigate = useNavigate();

  const handleCategoryInputChange = (value) => {
    setEditedCategory(value);
  };

  const handleEditCategory = (index) => {
    setCategoryEditingIndex(index);
  };

  const handleCategoryClick = (index) => {
    setMenuItems([]);
    setSelectedCategory(index);
    fetchMenuItems(index);
  };

  const handleSettingClick = () => {
    navigate('/manager/setting');
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
          
          <AddCategory cookies={cookies} categories={categories} setCategories={setCategories} />
          
          { Object.entries(categories).map(([index, category]) => (
            <Box key={index}>
              {categoryEditingIndex === index ? (
                <>
                  <TextField
                    value={editedCategory || category}
                    size='small'
                    variant='outlined'
                    color='primary'
                    style={{ margin: '5%', width: '80%' }}
                    onChange={(e) => handleCategoryInputChange(e.target.value, index)}
                    fullWidth 
                  />
                  <UpdateCategoryName cookies={cookies} index={index} editedCategory={editedCategory} 
                    setCategoryEditingIndex={setCategoryEditingIndex} setEditedCategory={setEditedCategory}
                    categories={categories} setCategories={setCategories}
                  />
                </>
              ) : (
                <Box display="flex" justifyContent="space-evenly">
                  <Button 
                    variant="outlined" 
                    color="primary"
                    style={{...EditButtonStyle, 
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
                    <UpdateCategoryOrder cookies={cookies} index={index} categories={categories} 
                      setCategories={setCategories} 
                    />
                  </ButtonGroup>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Drawer>

      <div style={{display: 'flex', flexDirection: "row"}}>
        <Button variant="contained" style={{...AddbuttonStyle, top: "5px", right: "0px"}}>
          <img src={meme} alt="MemeIcon" style={{
            maxWidth: '100%',
            maxHeight: '7vh',
            marginRight: '1vw'
          }}/>
          Memes
        </Button>
        <Link to="/manager/coupon" style={{
          marginTop: '8%',
          marginLeft: "10%",
          width: '100%',
        }}>
        <Button style={{...AddbuttonStyle, top: "5px", right: "0px"}}>
          <img src={coupon} alt="CouponIcon" style={{
            maxWidth: '100%',
            maxHeight: '7vh',
            marginRight: '1vw'
          }}/>
          Coupons
        </Button>
      </Link>
        <Button style={{...AddbuttonStyle, top: "5px", right: "0px"}} onClick={handleSettingClick}>
          Settings
        </Button>
      </div>

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
            <Typography variant="h4" gutterBottom>
              <b>Menu items</b>
            </Typography>
            
            <ManageItems 
              categories={categories} 
              selectedCategory={selectedCategory}
              menuItems={menuItems} 
              setMenuItems={setMenuItems}
              onItemsCategory={() => handleCategoryClick(selectedCategory)}
              cookies={cookies}
            />
            </Box>
        ) : (
          <Typography variant="h5" style={{ margin: '20px' }}>
            Edit menu here. <span role="img" aria-label="Smiley">&#128512;</span>
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ManageMenu;

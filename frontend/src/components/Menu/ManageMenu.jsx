import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { 
  Drawer, 
  Box,
  Typography,
  Button,
  TextField,
  ButtonGroup,
  Container,
  Paper
} from "@mui/material";
import ListCategories from "./Category/ListCategories";
import WestIcon from '@mui/icons-material/West';
import AddCategory from "./Category/AddCategoy";
import UpdateCategoryName from "./Category/UpdateCategoryName";
import UpdateCategoryOrder from "./Category/UpdateCategoryOrder";
import ListItems from './Items/ListItems'
import ManageItems from './Items/ManageItems'
import Manager from '../Staff/ManagerInterface'

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
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const navigate = useNavigate();

  const backLink = `/staff`;
  const [cookies] = useCookies(['token']);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


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

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Container maxWidth="sm">
      <Manager />

      <div style={{display: "flex", alignItems: "center", justifyContent: "flex-start", height: "100vh"}}>
        <Button style={{
          height: "50%", 
          background: "white", 
          marginLeft: "-30vw", 
          marginTop: "40vh", 
          padding: "100px 0",
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px'
        }} onClick={toggleSidebar}>
          <Typography className='sideways-text' color={"black"}>Menu Category</Typography>
        </Button>

        <Box 
          flexGrow={1} 
          p={2} 
          display="flex"
          height="80vh"
          width="350px"
        >
          <Drawer
            variant="temporary"
            open={isSidebarOpen}
            onClose={toggleSidebar}
            ModalProps={{ keepMounted: true }}
            PaperProps={{ style: { 
              marginTop: "180px",
              width: '250px', 
              height: "600px", 
              borderTopRightRadius: '20px',
              borderBottomRightRadius: '20px'
            }}}>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
              <Typography variant='h5'style={{margin: "20px"}}>
                Menu Category
              </Typography>
            </div>
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
          </Drawer>

          {selectedCategory !== -1 ? (
            <Paper elevation={3} sx={{
              padding: "20px",
              borderRadius: "8px",
              width: "1200px", 
              height: "80vh", 
              marginLeft: "15vw",
            }}>
              <ManageItems 
                categories={categories} 
                selectedCategory={selectedCategory}
                menuItems={menuItems} 
                setMenuItems={setMenuItems}
                onItemsCategory={() => handleCategoryClick(selectedCategory)}
                cookies={cookies}
              />
            </Paper>
          ) : ( <></> )}
        </Box>
      </div>
    </Container>
  );
};

export default ManageMenu;

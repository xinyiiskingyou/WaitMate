import React, { useState } from "react";
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
import AddCategory from "./Category/AddCategoy";
import UpdateCategoryName from "./Category/UpdateCategoryName";
import UpdateCategoryOrder from "./Category/UpdateCategoryOrder";
import ListItems from './Items/ListItems'
import ManageItems from './Items/ManageItems'
import Manager from '../UserInterface/ManagerInterface'

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

const ManageMenu = () => {
  const { categories, setCategories } = ListCategories();
  const [categoryEditingIndex, setCategoryEditingIndex] = useState(-1);
  const [editedCategory, setEditedCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const { menuItems, setMenuItems, fetchMenuItems } = ListItems(selectedCategory);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [cookies] = useCookies(['token']);

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
          position: "fixed",
          top: "40vh",
          left: 0,
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
              marginTop: "24vh",
              width: '19vw',
              height: "73vh",
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
              borderRadius: "8px",
              width: "73vw",
              height: "84vh",
              marginLeft: "-15vw",
              marginTop: '5px',
              position: 'fixed',
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

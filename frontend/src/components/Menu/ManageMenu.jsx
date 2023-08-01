import React, { useState, useEffect } from "react";
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
import Manager from "../UserInterface/ManagerInterface";
import { Reorder, motion } from "framer-motion";
import { CategoryItem } from "./Category/CategoryItem";
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
  const [items, setItems] = useState(categories);
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

  useEffect(() => {
    setItems(categories);
  }, [categories]);

  useEffect(() => {
    // Check if selectedCategory is not -1 (i.e., a category is selected)
    if (selectedCategory !== -1) {
      // Fetch menu items for the selected category
      fetchMenuItems(selectedCategory);
    }
  }, [selectedCategory]);
  // "
  // categories={categories}
  // selectedCategory={selectedCategory}
  // menuItems={menuItems}
  // setMenuItems={setMenuItems}
  // onItemsCategory={() => handleCategoryClick(selectedCategory)}"

  return (
    <Container maxWidth="100%">
      <Manager />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh", marginLeft: "-40px" }}>
        <Button style={{
          height: "50%",
          background: "white",
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
            PaperProps={{
              style: {
                marginTop: "180px",
                width: '250px',
                height: "600px",
                borderTopRightRadius: '20px',
                borderBottomRightRadius: '20px'
              }
            }}>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
              <Typography variant='h5' style={{ margin: "20px" }}>
                Menu Category
              </Typography>
            </div>
            <AddCategory cookies={cookies} categories={categories} setCategories={setCategories} />
            <Reorder.Group axis="y" onReorder={setCategories} values={items}>
              {Object.entries(items).map(([index, category]) => (
                <CategoryItem
                  key={category}
                  item={category}
                  index={index}
                  selectedCategory={selectedCategory}
                  handleCategoryClick={handleCategoryClick}
                />
              ))}
            </Reorder.Group>
          </Drawer>

          {selectedCategory !== -1 ? (
            <Paper elevation={3} sx={{
              padding: "20px",
              borderRadius: "8px",
              width: "70vw",
              height: "80vh",
              marginTop: "10vh",
              marginLeft: "10vw",
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
          ) : (<></>)}
        </Box>
      </div>
    </Container>
  );
};

export default ManageMenu;

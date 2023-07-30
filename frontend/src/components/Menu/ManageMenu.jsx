import React, { useState, useEffect } from "react";
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
  Paper,
} from "@mui/material";
import ListCategories from "./Category/ListCategories";
import WestIcon from '@mui/icons-material/West';
import AddCategory from "./Category/AddCategoy";
import ListItems from './Items/ListItems'
import ManageItems from './Items/ManageItems'
import Manager from '../Staff/ManagerInterface'
import { Reorder, motion } from "framer-motion";
import { Item } from "./Item";
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
  const [selectedCategory, setSelectedCategory] = useState(-1);
  const { menuItems, setMenuItems, fetchMenuItems } = ListItems(selectedCategory);
  const [items, setItems] = useState(categories);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const backLink = `/staff`;
  const [cookies] = useCookies(['token']);
  

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


  return (
    <Container maxWidth="100%">
      <Manager />

      <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "80vh", marginLeft: "-40px"}}>
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
            <Reorder.Group axis="y" onReorder={setCategories} values={items}>
              {Object.entries(items).map(([index, category]) => (
                <Item 
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
          ) : ( <></> )}
        </Box>
      </div>
    </Container>
  );
};

export default ManageMenu;

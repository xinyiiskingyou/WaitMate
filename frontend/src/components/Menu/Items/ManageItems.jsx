import React, { useState } from "react";
import { Box, Card, IconButton, Pagination, PaginationItem } from "@mui/material";
import AddItem from "./AddItem"
import UpdateItemOrder from "./UpdateItemOrder"
import UpdateItemDetails from './UpdateItemDetails'
import RemoveItem from './RemoveItem'
import AddIcon from '@mui/icons-material/Add';

const ITEMS_PER_PAGE = 6;

const ManageItems = ({
  categories,
  selectedCategory,
  menuItems, 
  setMenuItems,
  onItemsCategory,
  cookies
}) => {
  const [adding, setAdding] = useState(false);
  const [cardData, setCardData] = useState({ category: -1, name: '', cost: '', description: '', ingredients: '', is_vegan: false, is_up: false });
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const itemsForCurrentPage = menuItems.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleAddButtonClick = () => {
    setAdding(true);
  };

  const handleCardDoneClick = (category, name, cost, description, ingredients, is_vegan) => {
    if (name && cost && description && ingredients) {
      const newMenuItem = { category, name: name, cost: cost, description: description, ingredients: ingredients, is_vegan: is_vegan };
      setMenuItems((prevMenuItems) => [...prevMenuItems, newMenuItem]);
      console.log('Item details:', cardData);
      // Reset the form data
      setCardData({ category: -1, name: '', cost: '', description: '', ingredients: '', is_vegan: false, is_up: false });
      setAdding(false);
    }
  };

  const handleCardCancelClick = () => {
    setCardData({ category: -1, name: '', cost: '', description: '', ingredients: '', is_vegan: false, is_up: false });
    setAdding(false);
  };
  
  const handleCardBlur = () => {
    if (cardData.name || cardData.cost || cardData.description) {
      setAdding(false);
    }
  };

  const handleRemoveItemClick = (index) => {
    setMenuItems((prevMenuItems) => {
      const updatedMenuItems = [...prevMenuItems];
      updatedMenuItems.splice(index, 1);
      return updatedMenuItems;
    });
  };

  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} style={{ gap: '10px' }}>
        { adding && (
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <AddItem onItemAdd={handleCardDoneClick} onItemCancel={handleCardCancelClick} category={categories[selectedCategory]}/>
            <div onBlur={handleCardBlur} tabIndex={-1} />
          </Box>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5vw', marginLeft: '4vw'}}>
          {Object.entries(itemsForCurrentPage)
            .filter(([_, menuItem]) => menuItem.name !== null)
            .map(([index, menuItem]) => (
              <div style={{ width: '20vw', height: '30vh'}}>
                <Card sx={{ maxHeight: '34vh', width: '100%', backgroundColor: "#FBDDDD" }}>
                  <UpdateItemDetails 
                    itemCategory={categories[selectedCategory]}
                    itemName={menuItem.name}
                    itemPrice={menuItem.cost}
                    itemDescription={menuItem.description}
                    itemIngredient={menuItem.ingredients} 
                    itemVegetarian={menuItem.is_vegan}
                    itemIndex={index}
                    cookies={cookies}
                  />
                  <RemoveItem itemName={menuItem.name} cookies={cookies} onItemRemove={() => handleRemoveItemClick(index)}/>
                  <UpdateItemOrder name={menuItem.name} onItemsCategory={onItemsCategory} cookies={cookies} />
                </Card>
              </div>
          ))}
        </div>
      </Box>

      <div style={{ position: 'fixed', bottom: '6vh', left: '55%', transform: 'translateX(-45%)' }}>
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

      <IconButton
        onClick={handleAddButtonClick}
        style={{
          backgroundColor: "#FBDDDD",
          borderRadius: "50%",
          fontSize: "12vh",
          position: "fixed",
          bottom: "6vh", 
          right: '10vw'
        }}
      >
        <AddIcon />
      </IconButton>
    </>
  );
}

export default ManageItems;

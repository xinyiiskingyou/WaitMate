import React, { useState } from "react";
import { Box, Button, Card } from "@mui/material";
import AddItem from "./AddItem"
import UpdateItemOrder from "./UpdateItemOrder"
import UpdateItemDetails from './UpdateItemDetails'
import RemoveItem from './RemoveItem'

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
      <Button
        variant='contained'
        onClick={handleAddButtonClick} 
        style={{
          background: "#eeeeee",
          border: "4px solid #FFA0A0",
          color: 'black',
          fontWeight: 'bold',
          borderRadius: 10,
        }}
      >
        Add menu item
      </Button>

      <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} style={{ gap: '10px' }}>
        { adding && (
          <Box display="flex" flexDirection="row" alignItems="flex-start">
            <AddItem onItemAdd={handleCardDoneClick} onItemCancel={handleCardCancelClick} category={categories[selectedCategory]}/>
            <div onBlur={handleCardBlur} tabIndex={-1} />
          </Box>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1vw' }}>
          {Object.entries(menuItems)
            .filter(([_, menuItem]) => menuItem.name !== null)
            .map(([index, menuItem]) => (
              <div style={{ width: '20vw', height: '30vh', margin: '4%' }}>
                <Card sx={{ border: '5px solid #FFA0A0', maxHeight: '34vh', width: '100%', borderRadius: 8 }}>
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
    </>
  );
}

export default ManageItems;

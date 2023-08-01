
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useMotionValue, Reorder, motion, useDragControls } from "framer-motion";
import { useRaisedShadow } from "../use-raised-shadow";
import { Button, Typography, TextField } from "@mui/material";
import ListCategories from "./ListCategories"; 
import UpdateCategoryName from "./UpdateCategoryName";
import EditIcon from '../../../assets/edit.png';
import { ReorderIcon } from "./CategoryDragIcon";
import ErrorHandler from '../../ErrorHandler';

export const CategoryItem = ({ item, index, selectedCategory, handleCategoryClick }) => {
  const [originalIndex, setOriginalIndex] = useState(index);
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  const [ItemName, setItemName] = useState(item);

  const handleItemNameChange = (newItemName) => {
    setItemName(newItemName);
  };
  const [categoryEditingIndex, setCategoryEditingIndex] = useState(-1);
  const [editedCategory, setEditedCategory] = useState('');
  const handleCategoryInputChange = (value) => {
    setEditedCategory(value);
  };
  const handleEditCategory = (index) => {
    setCategoryEditingIndex(index);
  };

  const handleClick = () => {
    handleCategoryClick(index);
  };


  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const handleUpdateOrder = async () => {
    const payload = {
      name: ItemName,
      new_index: parseInt(index, 10) + 1
    };

    try {
      const response = await fetch('http://localhost:8000/menu/category/update/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // const updated = [...categories];
        // const currIndex = parseInt(index, 10);
        // const newIndex = is_up ? currIndex - 1 : currIndex + 1;
        // [updated[currIndex], updated[newIndex]] = [updated[newIndex], updated[currIndex]];
        // setCategories(updated);
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error(error);
      handleShowSnackbar(error.message);
    }
  };
  const { categories, setCategories } = ListCategories();
  const [cookies] = useCookies(['token']);

  const CategoryButtonStyle = {
    marginTop: '2vh',
    width: '55%',
    height: '80%',
    borderRadius: 10,
    color: 'black',
    fontWeight: 'medium',
    padding: '1%',
  }

  const EditbuttonStyle = {
    marginTop: '2.9vh',
    marginLeft: "2vh",
    borderRadius: "50px",
    height: '10%',
    width: "10%",
    color: 'black'
  }
  return (
    <Reorder.Item value={item} id={item} as={motion.div} style={{boxShadow, y, width: "100%"}} dragListener={false} dragControls={dragControls} layout>
        {categoryEditingIndex === index ? (
        <>
            <TextField
            value={editedCategory || item}
            size='small'
            variant='outlined'
            color='primary'
            style={{ margin: '5%', width: '80%' }}
            onChange={(e) => handleCategoryInputChange(e.target.value, index)}
            fullWidth 
            />
            <UpdateCategoryName cookies={cookies} index={index} editedCategory={editedCategory} 
            setCategoryEditingIndex={setCategoryEditingIndex} setEditedCategory={setEditedCategory}
            categories={categories} setCategories={setCategories} handleItemNameChange={handleItemNameChange}
            />
        </>
        ) : (
        <div style={{marginLeft: "-20px"}} onClick={handleClick}>
        <Button
            style={{...CategoryButtonStyle, 
                border: selectedCategory===index ? "3px solid #FFA0A0" :"3px solid #bdbdbd",
                background: selectedCategory===index ? "#FBDDDD" : "#E0E0E0",
            }}
        >{ItemName}</Button>
        <Button
            style={{...EditbuttonStyle,maxWidth: '10px', maxHeight: '10px', minWidth: '10px', minHeight: '10px'}}
            onClick={() => handleEditCategory(index)}
        >
            <img 
            src={EditIcon} 
            style={{
              height: '3vh',
            }}/>
        </Button>

        <Button 
          style={{...EditbuttonStyle,maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}}>
            <ReorderIcon dragControls={dragControls} handleUpdateOrder={handleUpdateOrder}/>
        </Button>
        </div>
        )}


    </Reorder.Item>
  );
};

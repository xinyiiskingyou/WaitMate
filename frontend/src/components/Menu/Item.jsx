
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useMotionValue, Reorder, motion, useDragControls } from "framer-motion";
import { useRaisedShadow } from "./use-raised-shadow";
import { Button, Typography, TextField } from "@mui/material";
import ListCategories from "./Category/ListCategories";
import UpdateCategoryOrder from "./Category/UpdateCategoryOrder";
import UpdateCategoryName from "./Category/UpdateCategoryName";
import EditIcon from '../../assets/edit.png';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { ReorderIcon } from "./DragIcon";
export const Item = ({ item, index, selectedCategory, handleCategoryClick }) => {
  const [originalIndex, setOriginalIndex] = useState(index);
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  const [ItemName, setItemName] = useState(item);
//   const [selectedCategory, setSelectedCategory] = useState(-1);
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

//   const handleCategoryClick = (index) => {
//     setSelectedCategory(index);
//   };

  const handleClick = () => {
    handleCategoryClick(index);
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
        {/* <UpdateCategoryOrder cookies={cookies} index={index} categories={categories} 
                    setCategories={setCategories} 
        /> */}
        <Button style={{...EditbuttonStyle,maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px'}}>
            <ReorderIcon dragControls={dragControls} />
        </Button>
        </div>
        )}


    </Reorder.Item>
  );
};

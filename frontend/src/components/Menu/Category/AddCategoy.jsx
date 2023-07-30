import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import ErrorHandler from '../../ErrorHandler';

const AddCategory = ({ cookies, categories, setCategories }) => {

  const [editing, setEditing] = useState(false);
  const [categoryText, setCategoryText] = useState('');
  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const handleCategoryTextChange = (e) => {
    setCategoryText(e.target.value);
  };

  const handleNewButtonClick = () => {
    setEditing(true);
  };

  const handleCategoryDone = () => {
    setCategoryText('');
    setEditing(false);
  };

  const handleAddCategory = async () => {

    if (categoryText.trim() !== '') {
      const payload = { name: categoryText.trim() };

      try {
        const response = await fetch('http://localhost:8000/menu/category/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.token}`
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setCategories([...categories, categoryText.trim()]);
          handleCategoryDone();
        } else {
          const errorResponse = await response.json();
          handleShowSnackbar(errorResponse.detail);
        }
      } catch (error) {
        console.error('error', error.message);
        handleShowSnackbar(error.message);
      }
    } else {
      handleShowSnackbar('Failed to add category. Please try again.');
      handleCategoryDone();
    }
  };

  return (
    <>
      {editing ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField
            id="category"
            label="Category"
            value={categoryText}
            onChange={handleCategoryTextChange}
            size='small'
            variant='outlined'
            color='primary'
            style= {{margin: '5%', width: '80%'}}
            fullWidth
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              onClick={handleAddCategory} 
              variant="contained" 
              style={{background: "#81c784", marginRight: "10px"}}
            >
              Save
            </Button>
            <Button 
              onClick={handleCategoryDone} 
              variant="contained" 
              style={{background: "#ffc570"}}
            >
              Cancel
            </Button>
          </div>
        </Box>
      ) : (
        <Button
          variant='contained'
          style={{backgroundColor: "#FBDDDD", marginRight: "20px", marginLeft: "20px"}}
          onClick={handleNewButtonClick} 
          >
          <Typography 
            color="black"
            style={{marginTop: "5px", marginBottom: "5px"}}>
            + Add Category
          </Typography>
          </Button>
      )}
    {showError}
    </>
  );
};

export default AddCategory;

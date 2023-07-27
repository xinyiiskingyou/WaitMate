import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import ErrorHandler from '../../ErrorHandler';

const buttonStyle = {
  margin: '5%',
  width: '70%',
  height: '80%',
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

const AddCategory = ({ cookies, categories, setCategories }) => {

  const [editing, setEditing] = useState(false);
  const [categoryText, setCategoryText] = useState('');
  const { _, handleShowSnackbar, showError } = ErrorHandler(); 

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
            color="primary"
            style={{...buttonStyle, background: "#81c784"}}
          >
            Save
          </Button>
          <Button 
            onClick={handleCategoryDone} 
            variant="contained" 
            color="primary"
            style={{...buttonStyle, background: "#ffc570"}}
          >
            Cancel
          </Button>
        </div>
      </Box>
    ) : (
      <Button 
        onClick={handleNewButtonClick} 
        variant="contained" 
        color="primary"
        style={AddbuttonStyle}
      >
        Add Category
      </Button>
    )}
    {showError}
    </>
  );
};

export default AddCategory;

import React from 'react';
import Button from '@mui/material/Button';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import ErrorHandler from '../../ErrorHandler';

const EditCatebuttonStyle = {
  marginTop: '20%',
  width: '10%',
  height: '40%',
}

const UpdateCategoryName = ({ 
  cookies, 
  index, 
  editedCategory, 
  setCategoryEditingIndex, 
  setEditedCategory,
  categories, 
  setCategories,
  handleItemNameChange
}) => {

  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const handleCancelSaveCategory = () => {
    setCategoryEditingIndex(-1);
    setEditedCategory("");
  }

  const handleSaveCategoryName = async (index) => {
    console.log(categories[index]);
    console.log(editedCategory);

    const payload = { 
      name: categories[index],
      new_name: editedCategory
    };

    if (editedCategory === null || !editedCategory) {
      setCategoryEditingIndex(-1);
      setEditedCategory("");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/menu/category/update/details', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedCategories = [...categories];
        updatedCategories[index] = editedCategory;
        setCategories(updatedCategories);
      
        // Reset the category editing index
        setCategoryEditingIndex(-1);
        handleItemNameChange(editedCategory);
        setEditedCategory("");
        return response.json();
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error(error);
      handleShowSnackbar(error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <Button 
        onClick={() => handleSaveCategoryName(index)}
        variant="contained"
        color="primary"
        style={{...EditCatebuttonStyle, background: "#81c784", marginRight: '5px'}}>
        <DoneIcon />
      </Button>

      <Button 
        onClick={handleCancelSaveCategory} 
        variant="contained" 
        color="primary"
        style={{...EditCatebuttonStyle, background: "#ffc570"}}
      >
        <ClearIcon />
      </Button>
      {showError}
    </div>
  );
};

export default UpdateCategoryName;

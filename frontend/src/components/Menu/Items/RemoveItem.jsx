import React from "react";
import { Button, IconButton } from "@mui/material";
import ErrorHandler from '../../ErrorHandler';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
const RemoveItem = ({
  itemName,
  cookies,
  onItemRemove
}) => {
  const { handleShowSnackbar, showError } = ErrorHandler();

  const handleRemove = async () => {
    const payload = { name: itemName };

    try {
      const response = await fetch('http://localhost:8000/menu/item/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onItemRemove();
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error('error', error.message);
      handleShowSnackbar(error.message);
    }
  }

  return (
    <>
      {/* <Button 
        variant="contained"
        size="small" 
        onClick={() => handleRemove()}
        style={{ color: 'white', backgroundColor: '#FF7A7A' }}> */}
      <IconButton style={{ }} onClick={() => handleRemove()}>
      <CloseIcon/>
      </IconButton>
        
      {/* </Button> */}
      {showError}
    </>
  );
}

export default RemoveItem;
import React from "react";
import OrderButton from '../OrderButton';
import ErrorHandler from '../../ErrorHandler';

const UpdateItemOrder = ({ name, index, onItemsCategory, cookies } ) => {

  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const handleUpdateOrder = async (is_up) => {
    let new_index = parseInt(index, 10) + 1;
    if (is_up) {
      new_index = new_index + 1;
    } else {
      new_index = new_index - 1;
    }
    const payload = {
      name: name,
      new_index: new_index
    };
    console.log(payload);
    
    try {
      const response = await fetch('http://localhost:8000/menu/item/update/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onItemsCategory();
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
    <>
      <OrderButton onClick={() => handleUpdateOrder(true)} isUpButton={true} />
      <OrderButton onClick={() => handleUpdateOrder(false)} isUpButton={false} />
      {showError}
    </>
  );
}

export default UpdateItemOrder;
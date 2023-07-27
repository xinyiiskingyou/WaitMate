import React from "react";
import OrderButton from '../OrderButton';
import ErrorHandler from '../../ErrorHandler';

const UpdateItemOrder = ({ name, onItemsCategory, cookies } ) => {

  const { _, handleShowSnackbar, showError } = ErrorHandler(); 

  const handleUpdateOrder = async (is_up) => {
    const payload = {
      name: name,
      is_up: is_up
    };

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
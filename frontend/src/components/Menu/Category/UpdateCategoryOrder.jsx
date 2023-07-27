import React from 'react';
import ErrorHandler from '../../ErrorHandler';
import OrderButton from '../OrderButton';

const UpdateCategoryOrder = ({ cookies, index, categories, setCategories }) => {

  const { _, handleShowSnackbar, showError } = ErrorHandler(); 

  const handleUpdateOrder = async (index, is_up) => {
    const payload = {
      id: parseInt(index, 10) + 1,
      name: categories[index],
      is_up: is_up
    };

    console.log(payload);
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
        const updated = [...categories];
        const currIndex = parseInt(index, 10);
        const newIndex = is_up ? currIndex - 1 : currIndex + 1;
        [updated[currIndex], updated[newIndex]] = [updated[newIndex], updated[currIndex]];
        setCategories(updated);
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
      <OrderButton onClick={() => handleUpdateOrder(index, true)} isUpButton={true} />
      <OrderButton onClick={() => handleUpdateOrder(index, false)} isUpButton={false} />
      {showError}
    </>
  );
}

export default UpdateCategoryOrder;

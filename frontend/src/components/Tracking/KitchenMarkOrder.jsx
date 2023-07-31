import React from 'react';
import { Button } from '@mui/material';
import ErrorHandler from '../ErrorHandler';

const buttonStyle = { 
  border: '4px solid #A1C935', 
  height: '7vh', 
  width: '12vw',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#A1C935",
  color: 'black',
  fontWeight: "bolder",
  borderRadius: 8,
}

const KitchenMarkOrder = ({
  tableID,
  itemName,
  amount,
  state,
  setKitchen,
  is_prepared,
  cookies
}) => {
  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const markOrder = async () => {
    const table_payload = {
      table_id: parseInt(tableID, 10),
    };

    const order_payload = {
      item: itemName,
      amount: amount,
      table_id: parseInt(tableID, 10),
    };

    try {
      const response = await fetch('http://localhost:8000/track/kitchen/mark', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`},
        body: JSON.stringify({"order_req": order_payload, "table_req": table_payload}),
      })

      if (response.ok) {
        setKitchen((prevKitchen) => {
          let isUpdated = false;
          const updatedKitchen = prevKitchen.map((order) => {
            if (
              !isUpdated && // Check if not already updated
              order.tablenum === tableID &&
              order.name === itemName &&
              order.amount === amount
            ) {
              isUpdated = true; // Set the flag to true to indicate that we have updated an element
              return { ...order, state: 'Ready' };
            }
            return order;
          });
          return updatedKitchen;
        });
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error(error);
      handleShowSnackbar(error.message);
    }
  } 

  return (
    <> 
      {is_prepared===1 ? (
        <Button variant="contained" color="primary" disabled>
          {state}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          style={buttonStyle}
          onClick={() => markOrder()}
        >
          {state}
        </Button>
      )}
      {showError}
    </>
  );
}

export default KitchenMarkOrder;

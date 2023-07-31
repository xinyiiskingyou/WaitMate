import React, { useState } from "react";
import {Button,Typography} from '@mui/material';
import { useCookies } from 'react-cookie';
import ErrorHandler from '../ErrorHandler';

const WaitstaffMarkOrder = ({amount, name, is_prepared, is_served, id}) => {

  const [cookies] = useCookies(['token']);
  const [state, setState] = useState(is_prepared === 0 ? "preparing" : is_served === 1 ? "served" : "ready");
  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const handleComplete = async () => {
    console.log(id);
    setState("Served");
    const table_payload = {
      table_id: parseInt(id, 10),
    };

    const order_payload = {
      item: name,
      amount: amount,
      table_id: parseInt(id, 10),
    };

    try {
      const response = await fetch('http://localhost:8000/track/waitstaff/mark', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`},
        body: JSON.stringify({"order_req": order_payload, "table_req": table_payload}),
      });
      if (response.ok) {
        setState("Served");
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
  <div style={{width: "100%"}}>
    <div style={{ marginTop: "20px", display:"flex", flexDirection: "row", justifyContent: "space-between"}}>
      <Typography variant="h5">{amount} x {name} </Typography>
      <Button onClick={handleComplete} disabled={state !== "ready"}>{state}</Button>
    </div>
    {showError}
  </div>
  );
};
  
export default WaitstaffMarkOrder;

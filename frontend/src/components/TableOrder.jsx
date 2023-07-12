import React, { useState, useEffect } from "react";
import {Button,Typography} from '@mui/material';

const TableOrder = ({amount, name, is_prepared, is_served, id}) => {

    const index = 0;
    const [state, setState] = useState(is_prepared === 0 ? "preparing" : is_served === 1 ? "served" : "ready");
    const [textColor, setTextColor] = useState(index === 0 ? '#A1C935' : index === 1 ? '#FF7A7A' : index === 2 ? '#F59B0C' : '#FFFFFF');
    let status = "preparing";
    console.log("p", is_prepared);
    console.log(is_served);    

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
          //console.log(payload);
          await fetch('http://localhost:8000/track/waitstaff/mark', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"order_req": order_payload, "table_req": table_payload}),
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Failed to update status');
              }
            })
            .then(data => {
                setState("Served");
            })
            .catch(error => {
              // Handle the error if necessary
              console.error(error);
              alert('Failed to update the status.');
            });
    };


    return (
    <div style={{width: "100%"}}>
    <div style={{ marginTop: "20px", display:"flex", flexDirection: "row", justifyContent: "space-between"}}>
        <Typography variant="h5">{amount} x {name} </Typography>
        <Button onClick={handleComplete} disabled={state !== "ready"}>{state}</Button>

    </div>

    </div>
    );
  };
  
  export default TableOrder;
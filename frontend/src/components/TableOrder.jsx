import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Checkbox} from '@mui/material';

const TableOrder = ({amount, name, id}) => {
    const [complete, SetComplete] = useState(false);
    console.log(complete);
    const handleComplete = async () => {
        console.log(id);
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
                SetComplete(true);
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
        <Checkbox onChange={handleComplete}/>
    </div>

    </div>
    );
  };
  
  export default TableOrder;
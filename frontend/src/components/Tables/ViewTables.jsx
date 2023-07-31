import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { IconButton, Box } from "@mui/material";
import UpdateTable from "./UpdateTable";
import ErrorHandler from '../ErrorHandler';
import order from "../../assets/order.png";
import ListTableOrder from "../Orders/ListTableOrder";

const ViewTables = ({
  setSelectedTable,
  setTableOrder
}) => {
  const [table, setTable] = useState({});
  const [cookies] = useCookies(['token']);
  const { handleShowSnackbar, showError } = ErrorHandler(); 

  const ViewTableStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/table/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
      });
      const data = await response.json();
      console.log(data);
      setTable(data);
    } catch (error) {
      console.error('Error fetching status:', error);
      handleShowSnackbar(error.message);
    }
  }
  const handleFetchOrder = async (index) => {
    const order_list = await ListTableOrder(index);
    setSelectedTable(index);
    setTableOrder(order_list);
    return order_list;
  }

  const tableElements = Object.entries(table).map(([id, value]) => {
    return (
      <div key={id} style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}><b>Table {id}</b></div>
        </div>
          <UpdateTable table_id={id} value={value} cookies={cookies} />
        <IconButton onClick={() => handleFetchOrder(id)}>
          <img src={order} alt="MemeIcon" style={{ width: '1.8vw', height: '3.5vh' }}/>
        </IconButton>
      </div>
    );
  });

  useEffect(() => {
    ViewTableStatus();
  })

  return (
    <Box sx={{ border: '2px solid #000', width: '50%', height: '80vh', m: 2, padding: "3%" }}>
      {tableElements}
      {showError}
    </Box>
  );
};

export default ViewTables;

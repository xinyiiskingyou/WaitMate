import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { IconButton, Paper } from "@mui/material";
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
          <div style={{ textAlign: "center", whiteSpace: 'nowrap', fontSize: '2.7vh'}}><b>Table {id}</b></div>
        </div>
          <UpdateTable table_id={id} value={value} cookies={cookies} />
        <IconButton onClick={() => handleFetchOrder(id)}>
          <img src={order} alt="MemeIcon" style={{ width: '1.8vw', height: '3.7vh' }}/>
        </IconButton>
      </div>
    );
  });

  useEffect(() => {
    ViewTableStatus();
  })

  return (
    <Paper elevation={5} sx={{
      padding: "20px",
      borderRadius: "8px",
      width: "31vw", 
      height: "80vh", 
      left: "250px",
      position: 'fixed',
      marginTop: '9vh',
    }}>
      {tableElements}
      {showError}
    </Paper>
  );
};

export default ViewTables;

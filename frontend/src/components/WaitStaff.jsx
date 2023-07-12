
import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Grid, Button, IconButton, Checkbox, Icon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import order from "../assets/order.png";
import Table from "./Table";
import TableOrder from "./TableOrder";
const WaitStaff = () => {

  const [table, setTable] = useState({});
  const [selectedtable, setSelectedTable] = useState(-1);
  const [tableOrder, setTableOrder] = useState([]);
  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:8000/table/status');
      const data = await response.json();
      console.log(data);
      setTable(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  const handleReturn = () => {
    setSelectedTable(-1);
  };
  const tableElements = Object.entries(table).map(([id, value]) => {
    let index;
    switch (value) {
      case "OCCUPIED":
        index = 0;
        break;
      case "ASSIST":
        index = 1;
        break;
      case "BILL":
        index = 2;
        break;
      default:
        index = -1;
    }

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
          <div style={{ textAlign: "center" }}>Table {id}</div>
        </div>
        <Table index={index} table_id={id} />
        <IconButton onClick={() => fetchOrder(id)}>
          <img src={order} alt="MemeIcon" />
        </IconButton>
      </div>
    );
  });

  const fetchOrder = async (index) => {
    //index = String(index);
    console.log(index);
    const url = `http://localhost:8000/order/cart/list?table_id=${index}`;
    console.log(url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      const itemArray = Object.values(data);
      let order_list = []
      for (var i of data) {
        order_list.push({ name: i[0], amount: i[1], is_prepared: i[2], is_served: i[3] })
      }
      setTableOrder(order_list);
      setSelectedTable(index);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories:', error);
      window.location.reload();
    }
  };

  return (
    <Container>
      <Box display="flex" >
        <Box sx={{ border: '2px solid #000', width: '50%', height: '80vh', m: 2, padding: "3%" }}>
          {tableElements}
        </Box>

        <Box sx={{ border: '2px solid #000', width: '50%', height: '80vh', m: 2, padding: "3%" }}>
          {selectedtable === -1 ? (
            <Typography variant="h4" align="center" margin={'15px'}>Notification Board</Typography>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <IconButton><ArrowBackIcon onClick={handleReturn} /></IconButton>
                <Typography variant="h4" align="center" margin={'15px'}>Table {selectedtable} Order </Typography>
              </div>

              {tableOrder.map((table) => (
                <div key={table.id} style={{ marginTop: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <TableOrder amount={table.amount} name={table.name} is_prepared={table.is_prepared} is_served={table.is_served} id={selectedtable}></TableOrder>
                </div>
              ))}
            </div>
          )}

        </Box>
      </Box>
    </Container>
  );
};

export default WaitStaff;
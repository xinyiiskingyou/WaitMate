
import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Grid, Button, IconButton, Select, MenuItem, Menu, ListItem, ListItemText, List} from '@mui/material';
import order from "../assets/order.png";
import Table from "./Table";
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

  const handleSelectTable = (index) => {
    console.log(index);
    setSelectedTable(index);
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
        <Table index={index} table_id={id}/>
        <IconButton onClick={() => fetchOrder(id)}>
          <img src={order} alt="MemeIcon"/>
        </IconButton>
      </div>
    );
  });

  const fetchOrder = async (index) => {
    index = String(index);
    console.log(index);
    try {
      const response = await fetch('http://localhost:8000/order/cart/list/' + index);
      const data = await response.json();
      const itemArray = Object.values(data);
      setTableOrder(itemArray);
      setSelectedTable(index);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories:', error);
      window.location.reload();
    }
  };
  
    const StyledTableCell = ({ children }) => (
          <Box
            sx={{
              borderRadius: '8px',
              padding: '8px',
              display: 'inline-block',
              margin: '5px',
            }}
          >
            {children}
          </Box>
      );

      const CustomTableCell = ({ status }) => {
        const cellStyles = {
          margin: '5px',
          padding: '8px',
          borderRadius: '8px',
          display: 'inline-block',
          backgroundColor: status === 'Seated' ? '#A1C935' : '#C4C4C4',
          color: status === 'Seated' ? 'white' : 'inherit',

        };
      
        return <Button sx={cellStyles}>{status}</Button>;
      };
      const generateTableRows = (data) => {
        return data.map((row, index) => (
          <Box key={index} display= 'flex' justifyContent= 'center' alignItems= 'center' >
            <StyledTableCell>
            <Typography variant="h6" align="center" margin={'10px'}>{row.table}
            </Typography>
            </StyledTableCell>
            <CustomTableCell status={row.status} />
          </Box>
        ));
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
                <Typography variant="h4" align="center" margin={'15px'}>Table {selectedtable} Order </Typography>

              )}
                
            </Box>
        </Box>
    </Container>
    );
};

export default WaitStaff;
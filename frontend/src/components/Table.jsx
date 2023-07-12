import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Grid, Button, IconButton, Select, MenuItem, Menu, ListItem, ListItemText, List} from '@mui/material';
import order from "../assets/order.png";

const Table = ({index, table_id}) => {
    const options = [
      'OCCUPIED',
      'ASSIST',
      'BILL',
    ];

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(index);
    const [textColor, setTextColor] = useState(index === 0 ? '#A1C935' : index === 1 ? '#FF7A7A' : index === 2 ? '#F59B0C' : '#FFFFFF');
    const open = Boolean(anchorEl);
    const handleClickListItem = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuItemClick = async (event, index, option, table_id) => {

        const payload = {
            table_id: parseInt(table_id, 10),
            status: option};
          console.log(payload);
          await fetch('http://localhost:8000/table/status/update', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Failed to update status');
              }
            })
            .then(data => {
                setSelectedIndex(index);
                setAnchorEl(null);
                setTextColor(index === 0 ? '#A1C935' : index === 1 ? '#FF7A7A' : index === 2 ? '#F59B0C' : '#FFFFFF');
            })
            .catch(error => {
              // Handle the error if necessary
              console.error(error);
              alert('Failed to update the status.');
            });
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

      return (
        <div style={{width: "100%"}}>
        <List>
          <ListItem
            button
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}
          >          
          <ListItemText 
          primary={options[selectedIndex]}
          style={{
            textAlign: "center",
            backgroundColor: textColor,
          }}/>
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option}
              disabled={index === selectedIndex}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index, option, table_id)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
        </div>
      );
  };
  
  export default Table;
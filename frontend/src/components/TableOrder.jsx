import React, { useState, useEffect } from "react";
import { Container, Button,Box, Typography, Checkbox, MenuItem, Menu, ListItem, ListItemText, List} from '@mui/material';

const TableOrder = ({amount, name, id}) => {
    const options = [
        'SERVED',
      ];
    const index = 0;
    const [complete, SetComplete] = useState(false);
    const [state, setState] = useState("waiting");
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(index);
    const [textColor, setTextColor] = useState(index === 0 ? '#A1C935' : index === 1 ? '#FF7A7A' : index === 2 ? '#F59B0C' : '#FFFFFF');
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
      };
    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
      };
    console.log(complete);
    const handleComplete = async () => {
        console.log(id);
        SetComplete(true);
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
                SetComplete(true);
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
        <Checkbox onChange={handleComplete}/>
        <Button onClick={handleComplete}>{state}</Button>
        <List>
          <ListItem
            button
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickListItem}
          >          
          <ListItemText 
          primary={options[0]}
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
          {options.map((option) => (
            <MenuItem
              key={option}
              disabled={index === 0}
              selected={index === 0}
              onClick={handleComplete}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
    </div>

    </div>
    );
  };
  
  export default TableOrder;
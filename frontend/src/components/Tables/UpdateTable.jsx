import React, { useState } from "react";
import { List, ListItem, ListItemText, Menu, MenuItem } from '@mui/material';
import ErrorHandler from '../ErrorHandler';

const UpdateTable = ({ table_id, value, cookies }) => {
  const options = [
    'OCCUPIED',
    'ASSIST',
    'BILL',
    'EMPTY'
  ];
  const { handleShowSnackbar, showError } = ErrorHandler();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = async (option, table_id) => {
    const payload = {
      table_id: parseInt(table_id, 10),
      status: option
    };
    console.log(payload);
    try {
      const response = await fetch('http://localhost:8000/table/status/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setAnchorEl(null);
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
      }
    } catch (error) {
      console.error(error);
      handleShowSnackbar(error.message);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <List>
        <ListItem
          button
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickListItem}
        >
          <ListItemText
            primary={value}
            style={{
              textAlign: "center",
              backgroundColor: value === 'OCCUPIED' ? '#A1C935' : value === 'ASSIST' ? '#FF7A7A' : value === 'BILL' ? '#F59B0C' : '#FFFFFF',
            }}
          />
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
            disabled={option === value}
            selected={option === value}
            onClick={() => handleMenuItemClick(option, table_id)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      {showError}
    </div>
  );
};

export default UpdateTable;

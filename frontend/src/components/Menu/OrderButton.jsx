import React from 'react';
import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const smallbuttonStyle = {
  padding: '4px',
  border: '1px solid #bdbdbd',
  color: 'black',
  marginBottom: "10px"
}

const OrderButton = ({ onClick, isUpButton }) => {
  const icon = isUpButton ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;

  return (
    <Button color="primary" style={{ ...smallbuttonStyle}} onClick={onClick}>
      {icon}
    </Button>
  );
};

export default OrderButton;

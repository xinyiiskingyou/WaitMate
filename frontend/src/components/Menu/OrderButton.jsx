import React from 'react';
import Button from '@mui/material/Button';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const smallbuttonStyle = {
  marginTop: '2.9vh',
  height: '50%',
  border: '1px solid #bdbdbd',
  color: 'black'
}

const OrderButton = ({ onClick, isUpButton }) => {
  const icon = isUpButton ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />;

  return (
    <Button color="primary" style={{ ...smallbuttonStyle, padding: '4px', fontSize: '10px' }} onClick={onClick}>
      {icon}
    </Button>
  );
};

export default OrderButton;

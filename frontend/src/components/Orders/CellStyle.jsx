import React from 'react';
import { TableCell } from "@mui/material";

const customTableCell = (content) => {
  const cellStyles = {
    width: '20%',
    fontSize: 24,
    borderBottom: 'none',
  };

  return (
    <TableCell style={{width: '20%', textAlign: 'center'}} component='th' scope='row' sx={cellStyles}>
      <b>{content}</b>
    </TableCell>
  );
};

export const CustomCell = ({ content, width, paddingRight, paddingLeft, color }) => {
  const cellStyles = {
    fontSize: 25,
    borderBottom: 'none',
    paddingRight: paddingRight || 0,
    paddingLeft: paddingLeft || 0,
  };

  return (
    <TableCell sx={cellStyles} component='th' scope='row' style={{width: width || '20%',  textAlign: 'center', color: color}}>
      {content}
    </TableCell>
  );
};

export default customTableCell;
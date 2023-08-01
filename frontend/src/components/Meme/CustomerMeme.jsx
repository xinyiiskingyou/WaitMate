import React, { useState } from "react";
import { Box, Card, IconButton, Pagination, PaginationItem } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

const ITEMS_PER_PAGE = 6;

const CustomerMeme = () => {
  
  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="flex-start" marginTop={5} style={{ gap: '10px' }}>
        {(
          <Box display="flex" flexDirection="row" alignItems="flex-start">
          </Box>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2vw' }}>
         
        </div>
      </Box>

      <div style={{ position: 'relative', marginTop: '2vh' }}>
        <Box display="flex" justifyContent="center" alignItems="center" marginTop={2}>
        </Box>

        <Box position="relative">
          <IconButton
            style={{
              backgroundColor: "#FBDDDD",
              borderRadius: "50%",
              fontSize: "12vh",
              position: "absolute",
              bottom: "10px", 
              right: "11px",
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
      </div>
    </>
  );
}

export default CustomerMeme;

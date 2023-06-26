import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardActions, CardContent, Container, Drawer, Box, Button, Typography, TextField } from '@mui/material';
import Item from './Item';
import MenuItem from './Card';

const customerMenu = () => {
  const buttonStyle = {
    margin: '5%',
    width: '80%'
  }
  return (
    <Container maxWidth="sm">
    <Box sx={{ display: 'flex' }}>
    <Drawer variant="permanent">
      <Box 
        sx={{ 
          margin: 2, 
          borderRadius: 2, 
          bgcolor: '#ECEBEB',
          height: '100%',
          display:"flex",
          flexDirection:"column"
        }}>
        <Typography variant="h5" align="center" style={{ margin: '20px' }}>
          Menu Categories
        </Typography>
        </Box>
        </Drawer>
        </Box>
        </Container>
    );
};

export default customerMenu;

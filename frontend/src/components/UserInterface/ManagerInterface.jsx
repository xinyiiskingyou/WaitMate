import React from 'react';
import { Link } from 'react-router-dom';
import '../../app.css';
import {
  AppBar, 
  Toolbar, 
  ThemeProvider, 
  createTheme,
  Button
} from '@mui/material';
import WaitMate from "../../assets/WaitMate.png";

const theme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FBDDDD",
          },
          "& .MuiOutlinedInput-root.Mui-focused  .MuiOutlinedInput-notchedOutline":
            {
              borderColor: "#FBDDDD",
            },
        },
      },
    },
  },
});

const Manager = () => {

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <img src={WaitMate} alt={WaitMate} style={{ width: '200px', marginRight: '10px' }} />
            <div style={{ display: 'flex', marginLeft: '500px', alignItems: "flex-end", justifyContent: 'space-between', gap: "50px" }}>
                <Button style={{color:"black"}} component={Link} to="/manager/menu">
                  Menu
                </Button>
                <Button style={{color:"black"}} component={Link} to="/manager/meme">
                  Meme
                </Button>
                <Button style={{color:"black"}} component={Link} to="/manager/coupon">
                  Coupon
                </Button>
                <Button style={{color:"black"}} component={Link} to="/manager/setting">
                  Management
                </Button>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </ThemeProvider>
  );
};

export default Manager;
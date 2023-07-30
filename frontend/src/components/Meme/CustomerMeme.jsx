import React, { useState, useEffect } from "react";
import { 
  Container,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Grid,
  IconButton,
  ThemeProvider,
  AppBar,
  Toolbar,
  Button,
  createTheme,
  Paper,
  Pagination, 
  PaginationItem,
} from "@mui/material";
import { Link, useParams } from 'react-router-dom';
import SendNotification from "../Notifications/SendNotification";
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

const buttonStyle = {
  color:"black", 
  fontWeight:"bolder"
};
const ITEMS_PER_PAGE = 6;

const CustomerMeme = () => {
  const id = useParams();
  return (
    <Container maxWidth="sm">
      <ThemeProvider theme={theme}>
        <div>
          <AppBar position="fixed">
            <Toolbar>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <img src={WaitMate} alt={WaitMate} style={{ width: '200px', marginRight: '10px' }} />
                <div style={{ display: 'flex', marginLeft: '500px', alignItems: "flex-end", justifyContent: 'space-between', gap: "50px" }}>
                  <Button style={buttonStyle} component={Link} to={`/browse/${id.id}`}>
                    Menu
                  </Button>
                  <Button style={buttonStyle} component={Link} to={`/customermeme/${id.id}`}>
                    Meme of the Week
                  </Button>
                  <Button style={buttonStyle} component={Link} to={`/toobored/${id.id}`}>
                    Too Bored?
                  </Button>
                  <SendNotification id={id.id}/>
                </div>
              </div>
            </Toolbar>
          </AppBar>
        </div>
      </ThemeProvider>
    </Container>
  );
};

export default CustomerMeme;

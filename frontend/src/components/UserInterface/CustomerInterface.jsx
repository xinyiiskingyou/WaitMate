import React from "react";
import { Link, useParams } from 'react-router-dom';
import { 
  createTheme,
  Button,
  ThemeProvider,
  AppBar,
  Toolbar
} from "@mui/material";
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

const CustomerInterface = () => {
  const id = useParams();

  return (
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="fixed">
          <Toolbar>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <img src={WaitMate} alt={WaitMate} style={{ width: '200px', marginRight: '30vw' }} />
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: "flex-end", gap: "50px" }}>
                <Button style={buttonStyle} component={Link} to={`/customer/browse/${id.id}`}>
                  Menu
                </Button>
                <Button style={buttonStyle} component={Link} to={`/button2`}>
                  Meme of the Week
                </Button>
                <Button style={buttonStyle} component={Link} to={`/customer/activity/${id.id}`}>
                  Too Bored?
                </Button>
                <SendNotification id={id.id}/>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    </ThemeProvider>
  );
}

export default CustomerInterface;

import React from "react"
import { Grid, Box, Button, Typography } from "@mui/material";
import { handleLogoutSubmit } from '../../auth.js';
import ListAllOrder from "../Orders/ListAllOrder.jsx";
import logout from "../../assets/logout.png"
import WaitMate from "../../assets/WaitMate.png";

const logoutbuttonStyle = {
  height: '7vh',
  width: '10vw',
  textAlign: 'center',
  justifyContent: 'center',
  background: "#FEFFCB",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
  right: '4vw'
}

const KitchenInterface = () => {
  return (
    <Grid container direction="column" spacing={2}>
      <img src={WaitMate} alt={WaitMate} style={{ width: '200px', left: 20, height: '60px', position: 'fixed', top: '15px' }} />
      <Grid item xs={2}>
        <Box sx={{
          margin: 2,
          mt: 4,
          borderRadius: 2,
          height: '100%',
          display:"flex",
          flexDirection:"column",
        }}>
          <Grid container spacing={2} style={{ marginLeft: '14vw'}}>
            <Grid item xs={8}>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                noWrap
                fontWeight="bold"
                marginTop="2vh"
              >
                Order List
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Button variant="contained" color="primary" style={logoutbuttonStyle} onClick={handleLogoutSubmit}>
                Logout
                <img src={logout} alt="LogoutIcon" style={{
                  height: '4vh',
                  width: '2vw',
                  marginLeft: '0.7vw'
                }}/>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    <ListAllOrder />
  </Grid>
  );
}

export default KitchenInterface;
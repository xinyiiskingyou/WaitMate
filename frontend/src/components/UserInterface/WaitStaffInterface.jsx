import React, { useState }  from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  IconButton,
  Paper
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCookies } from 'react-cookie';
import ViewTables from '../Tables/ViewTables';
import WaitstaffMarkOrder from '../Tracking/WaitstaffMarkOrder';
import FetchCustomerNotification from '../Notifications/FetchCustomerNotification';
import FetchKitchenNotification from '../Notifications/FetchKitchenNotification';
import { handleLogoutSubmit } from '../../auth.js';
import logout from "../../assets/logout.png"
import WaitMate from "../../assets/WaitMate.png";

const logoutbuttonStyle = { 
  position: 'fixed',
  top: '2vh',
  right: '2vw',
  height: '6vh', 
  width: '10vw',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#FEFFCB",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
}

const WaitStaffInterface = () => {
  const [selectedtable, setSelectedTable] = useState(-1);
  const [cookies] = useCookies(['token']);
  const [tableOrder, setTableOrder] = useState([]);

  const handleReturn = () => {
    setSelectedTable(-1);
  };

  return (
    <Container>
      <Box display="flex" >
        <img src={WaitMate} alt={WaitMate} style={{ width: '200px', left: 20, height: '60px', position: 'fixed' }} />
        <Button variant="contained" color="primary" style={logoutbuttonStyle} onClick={handleLogoutSubmit}>
          Logout
          <img src={logout} alt="LogoutIcon" style={{
            height: '4vh',
            width: '2vw',
            marginLeft: '0.7vw'
          }}/>
        </Button>
        <ViewTables setSelectedTable={setSelectedTable} setTableOrder={setTableOrder}/>

        <div>
          {selectedtable === -1 ? (
            <>
              <FetchCustomerNotification cookies={cookies} />
              <FetchKitchenNotification cookies={cookies} />
            </>
          ) : (
            <Paper elevation={5} sx={{
              padding: "20px",
              borderRadius: "8px",
              width: "30vw", 
              height: "80vh", 
              left: "54vw",
              position: 'fixed',
              marginTop: '9vh',
            }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <IconButton><ArrowBackIcon onClick={handleReturn} /></IconButton>
                <Typography variant="h4" align="center" margin={'12px'}>Table {selectedtable} Order </Typography>
              </div>

              {tableOrder.map((table) => (
                <div key={table.id} style={{ marginTop: "20px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                  <WaitstaffMarkOrder 
                    amount={table.amount} 
                    name={table.name} 
                    is_prepared={table.is_prepared} 
                    is_served={table.is_served} 
                    id={selectedtable}
                  />
                </div>
              ))}
            </Paper>
          )}
        </div>
      </Box>
    </Container>
  );
}

export default WaitStaffInterface;

import React, { useState }  from "react";
import {
  Container,
  Box,
  Button,
  Typography,
  IconButton
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCookies } from 'react-cookie';
import ViewTables from '../Tables/ViewTables';
import WaitstaffMarkOrder from '../Tracking/WaitstaffMarkOrder';
import FetchCustomerNotification from '../Notifications/FetchCustomerNotification';
import FetchKitchenNotification from '../Notifications/FetchKitchenNotification';
import { handleLogoutSubmit } from '../../auth.js';

const logoutbuttonStyle = { 
  position: 'fixed', // Set the position to fixed
  top: '10px', // Distance from the top of the viewport
  right: '20px', // Distance from the right of the viewport
  border: '4px solid #FFA0A0', 
  height: '5vh', 
  width: '10vw',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#FFCFCF",
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
        <ViewTables setSelectedTable={setSelectedTable} setTableOrder={setTableOrder}/>
        <Button variant="contained" color="primary" style={logoutbuttonStyle} onClick={handleLogoutSubmit}>
          Logout
        </Button>

        <Box sx={{ border: '2px solid #000', width: '50%', height: '80vh', m: 2, padding: "3%" }}>
          {selectedtable === -1 ? (
            <>
              <div>
                <Typography variant="h4" align="center" margin={'15px'}>Notification Board</Typography>
              </div>
              <FetchCustomerNotification cookies={cookies} />
              <FetchKitchenNotification cookies={cookies} />
            </>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <IconButton><ArrowBackIcon onClick={handleReturn} /></IconButton>
                <Typography variant="h4" align="center" margin={'15px'}>Table {selectedtable} Order </Typography>
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
            </div>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default WaitStaffInterface;

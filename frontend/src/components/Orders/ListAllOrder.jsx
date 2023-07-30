import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { 
  Grid, 
  Box,
  TableContainer, 
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import KitchenMarkOrder from '../Tracking/KitchenMarkOrder'

const ListAllOrder = () => {
  const [orders, setOrders] = useState([])
  const [cookies] = useCookies(['token']);

  const getOrdersList = async () => {
    let response = await fetch('http://localhost:8000/order/listall', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.token}`
      },      
    })

    let data = await response.json()
    let order_list = []

    for (var i of data) {
      order_list.push({
        time: i[0], 
        tablenum: i[1], 
        name: i[2], 
        amount: i[3], 
        state: i[4] === 0 ? "preparing" : "ready"
      })
    }
    setOrders(order_list)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getOrdersList()
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <Grid item xs={2}>
      <Box
        sx={{ 
          margin: 1, 
          border: 10,
          borderColor: '#FFA0A0',
          borderRadius: 2, 
          display:"flex",
      }}>
        <Grid container direction="column">
          <Grid item>
            <TableContainer sx={{height: 500, pt: 4, }}>
              <Table aria-label='custom pagination table'>
                <TableBody>
                  {orders.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pl: 10}}>
                      {row.time}
                    </TableCell>
                    <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pl: -5}}>
                      Table {row.tablenum}
                    </TableCell>
                    <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10}}>
                      {row.name}
                    </TableCell>
                    <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -5}}>  
                      {row.amount}
                    </TableCell>
                    <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: 10}}>  
                      <KitchenMarkOrder 
                        tableID={row.tablenum} 
                        itemName={row.name} 
                        amount={row.amount} 
                        state={row.state} 
                        setKitchen={setOrders}
                        is_prepared={row.is_prepared}
                        cookies={cookies}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default ListAllOrder;
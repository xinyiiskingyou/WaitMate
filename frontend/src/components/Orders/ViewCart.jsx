import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Button,
  Typography,
  TableContainer,
  Table,
  TableCell,
  TableBody,
  TableRow,
  Box,
} from "@mui/material";
import WestIcon from '@mui/icons-material/West';
import ListTableOrder from "./ListTableOrder";
import SubmitCoupon from "../Checkout/SubmitCoupon";
import SubmitTips from "../Checkout/SubmitTips";
import GetBill from "../Checkout/GetBill";

const ViewCart = () => {
  const id = useParams();
  const [orders, setOrders] = useState([]);
  const [tips] = useState('');

  const backLink = `/browse/${id.id}` 

  useEffect(() => {
    const fetchData = async () => {
      const order_list = await ListTableOrder(id.id);
      setOrders(order_list);
    };

    fetchData();
  }, [id.id]);

  return (
    <Container>
      <Grid container direction="column" spacing={2}>
        <Grid item xs={2}>
          <Link to={backLink}>
            <Button              
              sx={{ 
                border: 5,
                borderColor: '#FFFFFF',
                background: '#FFFFFF',
                borderRadius: 2,
                color: 'black',
              }}>
              <WestIcon/>
            </Button>
          </Link>
        </Grid>

        <Grid item xs={8}>
          <Typography 
            variant="h5" 
            component="h1" 
            align="center"
            noWrap
            fontWeight="bold"
            >
            View Order Summary 
          </Typography>
        </Grid>

        <Grid item xs={2}>
          <GetBill id={id.id} />
        </Grid>
      </Grid>

      <Grid item xs={2}>
        <Box
          sx={{ 
            margin: 1, 
            border: 10,
            borderColor: '#FFFFFF',
            background: "#FFFFFF",
            borderRadius: 2, 
            display:"flex",
          }}>
        </Box>
        <Grid container direction="column">
          <Grid item>
            <TableContainer sx={{
              height: 500,
              pt: 4,  
            }}>
              <Table aria-label='custom pagination table' >
                <TableBody>
                  {orders.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify="space-between" align="center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10 }}>
                        {row.name}
                      </TableCell>
                      <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify="space-between" align="center" sx={{ fontSize: 27, borderBottom: 'none', pr: -5 }}>
                        {row.amount}
                      </TableCell>
                      <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify="space-between" align="center" sx={{ fontSize: 27, borderBottom: 'none', pl: 10 }}>
                        ${row.cost}
                      </TableCell>
                      <TableCell style={{ width: '20%', textAlign: 'center', color: row.is_prepared === 0 ? 'orange' : row.is_served === 1 ? 'green' : 'blue' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pl: 10}}>
                      {row.is_prepared === 0 ? "Preparing" : row.is_served === 1 ? "Served" : "Ready"}
                    </TableCell>
                    </TableRow>
                  ))}

                  <TableRow>
                    <TableCell style={{ width: '20%', textAlign: 'center', fontWeight: 'bold' }} component='th' scope='row' justify="space-between" align="center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10 }}>
                      Coupon Code?
                    </TableCell>
                    <SubmitCoupon id={id} />
                  </TableRow>

                  <TableRow>
                    <TableCell style={{ width: '20%', textAlign: 'center', fontWeight: 'bold' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10}}>
                      Tips?
                    </TableCell>
                    <SubmitTips id={id} tip={tips}/>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ViewCart;

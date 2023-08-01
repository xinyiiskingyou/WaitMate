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
import GetBill from "../Checkout/GetBill";
import customTableCell,  { CustomCell } from './CellStyle';

const ViewCart = () => {
  const id = useParams();
  const [orders, setOrders] = useState([]);

  const backLink = `/customer/browse/${id.id}` 

  useEffect(() => {
    const fetchData = async () => {
      const order_list = await ListTableOrder(id.id);
      setOrders(order_list);
    };

    fetchData();
  }, [id.id]);

  return (
    <Container>
      <Grid container direction="row" spacing={2} style={{ marginTop: '7vh', marginBottom: '3vh' }}>
        <Grid item xs={2}>
          <Link to={backLink}>
            <Button              
              sx={{ 
                border: 5,
                borderColor: '#FFFFFF',
                background: '#FFFFFF',
                borderRadius: 2,
                color: 'black',
                marginLeft: '20px',
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

        <Grid item xs={2} style={{ marginLeft: '-40px'}}>
          <GetBill id={id.id} />
        </Grid>
      </Grid>

      <Grid item xs={2}>
        <Box sx={{ 
          margin: 1, 
          border: 10,
          borderColor: '#FFFFFF',
          background: "#FFFFFF",
          borderRadius: 2, 
          display:"flex",
        }}>
          <Grid container direction="column">
            <Grid item>
              <TableContainer sx={{ height: '70vh', pt: 4, }}>
                <Table aria-label='custom pagination table' >
                  <TableBody>
                    <TableRow>
                      {customTableCell('Qty x Item')}
                      {customTableCell('Price')}
                      {customTableCell('Status')}
                    </TableRow>
                    {orders.map((row) => (
                      <TableRow key={row.name}>
                        <CustomCell content={`${row.amount} x ${row.name.toUpperCase()}`} width="23%"/>
                        <CustomCell content={`$${row.cost}`} paddingRight={1}/>
                        <CustomCell
                          content={row.is_prepared === 0 ? "Preparing" : row.is_served === 1 ? "Served" : "Ready"}
                          color={row.is_prepared === 0 ? '#C9A735' : row.is_served === 1 ? '#A1C935' : '#35A1C9'}
                        />
                      </TableRow>
                    ))}
                  </TableBody> 
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Container>
  );
}

export default ViewCart;

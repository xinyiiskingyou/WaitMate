import React, { useEffect, useState }  from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';


function createData(name, amount) {
  return { name, amount };
}

const rows = [
  createData('Frozen yoghurt', 1),
  createData('Ice cream sandwich', 2),
  createData('Eclair', 1),
  createData('Cupcake', 1),

];

const Cart = () => {
  const [amount, setAmount] = useState(0);
  let [orders, setOrder] = useState([])
  const emptyRows = 5 - orders.length;

  const printhello = () => {
    console.log('hello')
  };
  
  let getCart = async () => {
    let response = await fetch('http://localhost:8000/order/cart/list/1')
    let data = await response.json()
    let order_list = []
    for (var i of data) {
      console.log(i)
      order_list.push({name: i[0], amount: i[1]})
    }
    setOrder(order_list)
  }

  useEffect(() => {
    getCart()
  }, [])

  return (
    <Container >
    <Grid container direction="column" spacing={2}>
      <Grid item xs={2}>
      <Box
        sx={{ 
          margin: 2, 
          mt: 4, 
          borderRadius: 2, 
          height: '100%',
          display:"flex",
          flexDirection:"column"
        }}>

        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Link to="/">
              <Button              
                sx={{ 
                  border: 5,
                  borderColor: '#F5BBCC',
                  borderRadius: 2,
                  color: 'black' 
                }}>
                <Typography variant="h4">Back</Typography>
              </Button>
            </Link>
          </Grid>
          
          <Grid item xs={8}>
            <Typography 
            variant="h3" 
            component="h1" 
            align="center"
            noWrap
            >
              View Cart
            </Typography>
          </Grid>

        </Grid>
      </Box>
    </Grid>

    <Grid item xs={2}>
      <Box
        sx={{ 
          margin: 2, 
          border: 10,
          borderColor: '#F5BBCC',
          borderRadius: 2, 
          display:"flex",
        }}>
        <Grid container direction="column">
          <Grid item>
            <TableContainer  sx={{
                height: 500,
                pt: 4,  
              }}>
              <Table aria-label='custom pagination table' >
                <TableBody>
                  {orders.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component='th' scope='row' sx={{ fontSize: 30, borderBottom: 'none', pl: 10}}>
                        {row.name}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align='right' sx={{ fontSize: 25, borderBottom: 'none', pr: 10}}>
                        {row.amount}
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
    </Grid>  
    </Container>

    )
}

export default Cart;
import React, { useState }  from 'react';
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
];

const Cart = () => {
  const [amount, setAmount] = useState(0);
  const emptyRows = 5 - rows.length;

  const printhello = () => {
    console.log('hello')
  };
  
  const handleAddAmount = (itemname) => {
    rows.forEach(function(element, index, array){
        if (element.name === itemname) {
          array[index].amount++;
          setAmount(amount+1);
          console.log(array[index]);
        }
    });
  };

  const handleSubAmount = (itemname) => {
    rows.forEach(function(element, index, array){
      if (element.name === itemname) {
        if (array[index].amount === 1) {
          return;
        }
        array[index].amount--;
        setAmount(amount-1);
        console.log(array[index]);
      }
    });
  };

  let getCart = async () => {
    let response = await fetch('http://localhost:8000/order/cart/0')
    let data = await response.json()
  }

  return (
    <Container >
    <Grid container direction="column" spacing={2}>
      <Grid item xs={2}>
      <Box
        sx={{ 
          margin: 2, 
          borderRadius: 2, 
          bgcolor: '#ECEBEB',
          height: '100%',
          display:"flex",
          flexDirection:"column"
        }}>

        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Link to="/">
              <Button variant="outlined" color="primary" >
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
          border: 5,
          borderColor: '#F5BBCC',
          borderRadius: 2, 
          display:"flex",
        }}>
        <Grid container direction="column">
          <Grid item>
            <TableContainer>
              <Table aria-label='custom pagination table'>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component='th' scope='row' sx={{ fontSize: 20, borderBottom: 'none'}}>
                        {row.name}
                      </TableCell>
                      <TableCell style={{ width: 160 }} align='right' sx={{borderBottom: 'none' }}>
                        <Button onClick={() => handleSubAmount(row.name)}>-</Button>
                          {row.amount}
                        <Button onClick={() => handleAddAmount(row.name)}>+</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 90 * emptyRows}} >
                      <TableCell colSpan={1} sx={{ borderBottom: 'none' }}/>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item align='right'>
            <Button onClick={() => printhello()}       
              sx={{ 
              margin: 2, 
              border: 5,
              borderColor: '#F5BBCC',
              borderRadius: 2, 
              }}>
              Order
            </Button>
          </Grid>
        </Grid>
      </Box>
      </Grid>
    </Grid>  
    </Container>

    )
}

export default Cart;
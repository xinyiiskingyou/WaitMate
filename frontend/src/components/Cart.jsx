import React, { useEffect, useState }  from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, Container, Grid, Table, TableContainer, TableBody, TableRow, TableCell 
} from '@mui/material';
import WestIcon from '@mui/icons-material/West';

const buttonStyle = { 
  border: '4px solid #FFA0A0', 
  height: '7vh', 
  width: '12vw',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#FFCFCF",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
}

const Cart = () => {
  let [orders, setOrder] = useState([])
  const id = useParams();
  const backLink = `/Browse/${id.id}` 
  const billLink = `/Bill/${id.id}`
  const [value, setValue] = useState(null);
  let [error, setError] = useState(false);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setError(isNaN(inputValue));
  };
  
  let getCart = async () => {

    await fetch(`http://localhost:8000/order/cart/list?table_id=${id.id}`, {
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to view order summary. Please try again.');
      }
    }).then((data) => {
      console.log(data)
      if (data === null) {
        return;
      }
      let order_list = []
      for (var i of data) {
        console.log(i)
        order_list.push({name: i[0], amount: i[1], cost: i[4]})
      }
      setOrder(order_list)
    }).catch(error => {
      console.log(error);
      alert(error);
    })    
  }

  useEffect(() => {
    getCart()
  }, [])

  return (
  <Container>
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
            <Link to={backLink}>
              <Button              
                sx={{ 
                  border: 5,
                  borderColor: '#FFA0A0',
                  borderRadius: 2,
                  color: 'black',
                }}>
                <WestIcon/>
              </Button>
            </Link>
          </Grid>
          
          <Grid item xs={8}>
            <Typography 
              variant="h3" 
              component="h1" 
              align="center"
              noWrap
              fontWeight="bold"
              >
              View Order Summary 
            </Typography>
          </Grid>

          <Grid item xs={2}>
          <Link to={billLink}>
              <Button variant="contained" color="primary" style={buttonStyle}>
                Request Bill
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Grid>

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
            <TableContainer sx={{
                height: 500,
                pt: 4,  
              }}>
              <Table aria-label='custom pagination table' >
                <TableBody>
                  {orders.map((row) => (
                    <TableRow key={row.name}>
                       <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10}}>
                        {row.name}
                      </TableCell>
                      <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -5}}>  
                        {row.amount}
                      </TableCell>
                      <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pl: 10}}>
                        ${row.cost}
                      </TableCell>
                    </TableRow> 
                  ))}
                  <TableRow>
                      <TableCell style={{ width: '20%', textAlign: 'center', fontWeight: 'bold' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10}}>
                        Voucher Code?
                      </TableCell>
                      <TextField
                        required
                        id="standard-required"
                        label="Enter NUMBERS Only"
                        value={value}
                        // onChange={handleInputChange}
                        helperText={error && 'Invalid input: must be a number'}
                        size="small"
                        margin= 'normal'
                        type="number" 
                        fullWidth
                        inputProps={{
                          step: "1",
                          min: "1"
                        }}/>  
                  </TableRow>
                  <TableRow>
                      <TableCell style={{ width: '20%', textAlign: 'center', fontWeight: 'bold' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10}}>
                        Tips?
                      </TableCell>
                      <TextField
                        required
                        id="standard-required"
                        label="Enter NUMBERS Only"
                        value={value}
                        // onChange={handleInputChange}
                        helperText={error && 'Invalid input: must be a number'}
                        size="small"
                        margin= 'normal'
                        type="number" 
                        fullWidth
                        inputProps={{
                          step: "1",
                          min: "1"
                        }}/>  
                    </TableRow>
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
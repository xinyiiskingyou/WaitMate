import React, { useEffect, useState }  from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import WestIcon from '@mui/icons-material/West';

function createData(time, tablenum, name, amount) {
  return { time, tablenum, name, amount };
}

// function ccyFormat(num) {
//   return `${num.toFixed(2)}`;
// }

// const invoiceSubtotal = subtotal(rows);
// const invoiceTotal = invoiceTaxes + invoiceSubtotal;

const buttonStyle = { 
  border: '4px solid #A1C935', 
  height: '7vh', 
  width: '12vw',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#A1C935",
  color: 'black',
  fontWeight: "bolder",
  borderRadius: 8,
}

const Bill = () => {
  let [orders, setKitchen] = useState([])
  let amount = "$10"
  let getKitchenList = async () => {
    let response = await fetch('http://localhost:8000/order/listall')
    let data = await response.json()
    let order_list = []
    for (var i of data) {
      console.log(i)
      order_list.push({time: i[0], tablenum: i[1], name: i[2], amount: i[3]})
    }
    setKitchen(order_list)
  }

  useEffect(() => {
    getKitchenList()
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
                  borderColor: '#FFA0A0',
                  borderRadius: 2,
                  color: 'black' 
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
            >
              Bill
            </Typography>
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
            <TableContainer  sx={{
                maxheight: 500,
                pt: 4,  
              }}>
              <Table aria-label='custom pagination table' >
                <TableBody>
                  {orders.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell style={{ width: '33%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10}}>
                        {row.name}
                      </TableCell>
                      <TableCell style={{ width: '33%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -5}}>  
                        {row.amount}
                      </TableCell>
                      <TableCell style={{ width: '33%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pl: 10}}>
                        {row.time}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
            <TableCell rowSpan={4}/>
            <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "left" sx={{ fontSize: 27, borderBottom: 'none'}}>
              Subtotal
            </TableCell>
            <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "right" align= "right" sx={{ fontSize: 27, borderBottom: 'none'}}>
              {amount}
            </TableCell>         
             </TableRow>
          <TableRow>
          <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "left" sx={{ fontSize: 27, borderBottom: 'none'}}>
            Voucher
          </TableCell>
          <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "right" sx={{ fontSize: 27, borderBottom: 'none'}}>
              {amount}
            </TableCell>          
            </TableRow>
          <TableRow>
          <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "left" sx={{ fontSize: 27, borderBottom: 'none'}}>
            Tips
          </TableCell>            
          <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "right" sx={{ fontSize: 27, borderBottom: 'none'}}>
              {amount}
            </TableCell>          
            </TableRow>
          <TableRow>
          <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "left" sx={{ fontSize: 27, borderBottom: 'none'}}>
            Total
          </TableCell>
            <TableCell style={{ width: '20%', textAlign: 'center' }} component='th' scope='row' justify= "space-between" align= "right" sx={{ fontSize: 27, borderBottom: 'none'}}>
              {amount}
            </TableCell>
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

export default Bill;
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
import WestIcon from '@mui/icons-material/West';
import { useCookies } from 'react-cookie';

function createData(time, tablenum, name, amount) {
  return { time, tablenum, name, amount };
}

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

const rows = [
  createData("13:02", "Table 9", 'Frozen yoghurt', 1),
  createData("13:02", "Table 9", 'Ice cream sandwich', 2),
  createData("13:02", "Table 9", 'Eclair', 1),
  createData("13:02", "Table 9", 'Cupcake', 3),
  createData("13:05", "Table 3", 'Meat Pizza', 1),
  createData("13:08", "Table 2", 'Lemon Tea', 2),
  createData("13:10", "Table 8", 'Salad', 1),
  createData("13:12", "Table 1", 'Cheesecake', 2),
  createData("13:15", "Table 5", 'Cocktail', 2),
  createData("13:15", "Table 5", 'Meat Pizza', 1),
];

const Kitchenlist = () => {
  let [orders, setKitchen] = useState([])
  const [cookies] = useCookies(['token']);
  
  let getKitchenList = async () => {
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
              Order List
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
                height: 500,
                pt: 4,  
              }}>
              <Table aria-label='custom pagination table' >
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
                        <Button variant="contained" color="primary" style={buttonStyle}>
                          Prepared
                        </Button>
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

export default Kitchenlist;
import React, { useEffect, useState }  from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Button, TextField, Typography, Container, Grid, Table, TableContainer, TableBody, TableRow, TableCell 
} from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import Bill from "./Bill";

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

const SmallbuttonStyle = { 
  border: '4px solid #FFA0A0', 
  height: '5vh', 
  width: '10vw',
  textAlign: 'center', 
  justifyContent: 'center',
  background: "#FFCFCF",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
  marginLeft: '1vw',
  marginTop: '0.6vh',
}

const Cart = () => {
  const id = useParams();
  const backLink = `/Browse/${id.id}` 
  const navigate = useNavigate();

  let [value, setValue] = useState(null);
  let [error, setError] = useState(false);
  let [orders, setOrder] = useState([])
  let [tips, setTips] = useState('')
  let [tipsSubmitted, setTipsSubmitted] = useState('')
  let [coupon, setCoupon] = useState('')
  let [couponSubmitted, setCouponSubmitted] = useState('')
  
  const billLink = `/Bill/${id.id}?tips=${tips}`

  const handleRequestBill = () => {
    navigate(billLink);
  };

  const handleCouponInput = (event) => {
    const inputCoupon = event.target.value;
    if (!isNaN(inputCoupon)) {
      setCoupon(inputCoupon);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleInputChange = (event) => {
    const inputTips = event.target.value;
    if (!isNaN(inputTips)) {
      setTips(inputTips);
      setError(false);
    } else {
      setError(true);
    }
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

  let handleCouponSubmit = async () => {
    const payload = {
      id: parseInt(id.id, 10),
      amount: parseInt(tips, 10)
    };

    await fetch(`http://localhost:8000/checkout/bill/coupon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then((data) => {
      console.log(data)
      if (data === null) {
        return;
      }
      setCouponSubmitted(true);
     } ).catch(e => {
      console.log(error);
      alert(e);
    })
  }
    
  let handleTipsSubmit = async () => {
    const payload = {
      id: parseInt(id.id, 10),
      amount: parseInt(tips, 10)
    };

    await fetch(`http://localhost:8000/checkout/bill/tips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then((data) => {
      console.log(data)
      if (data === null) {
        return;
      }
      setTipsSubmitted(true);
     } ).catch(e => {
      alert(e);
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
            <Button variant="contained" color="primary" style={buttonStyle} onClick={handleRequestBill}>
              Request Bill
            </Button>
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
                        Coupon Code?
                      </TableCell>
                      <TableCell style={{ width: '20%', textAlign: 'center' }}>
                      {couponSubmitted ? (
                        <Typography variant="body1">${coupon}</Typography>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            required
                            id='standard-required'
                            label='Enter NUMBERS Only'
                            value={coupon}
                            onChange={handleCouponInput}
                            size='small'
                            margin='normal'
                            fullWidth
                          />
                          <Button variant='contained' color='primary' onClick={handleCouponSubmit} style={SmallbuttonStyle}>
                            Submit
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell style={{ width: '20%', textAlign: 'center', fontWeight: 'bold' }} component='th' scope='row' justify= "space-between" align= "center" sx={{ fontSize: 27, borderBottom: 'none', pr: -10}}>
                      Tips?
                    </TableCell>
              
                    <TableCell style={{ width: '20%', textAlign: 'center' }}>
                      {tipsSubmitted ? (
                        <Typography variant="body1">${tips}</Typography>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <TextField
                            required
                            id='standard-required'
                            label='Enter NUMBERS Only'
                            value={tips}
                            onChange={handleInputChange}
                            helperText={error && 'Invalid input: must be a number'}
                            size='small'
                            margin='normal'
                            type='number'
                            fullWidth
                            inputProps={{
                              step: '1',
                              min: '1',
                            }}
                          />
                          <Button variant='contained' color='primary' onClick={handleTipsSubmit} style={SmallbuttonStyle}>
                            Submit
                          </Button>
                        </div>
                      )}
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

export default Cart;
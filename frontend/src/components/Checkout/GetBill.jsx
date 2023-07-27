import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  Paper,
  Button,
  DialogActions,
  Divider
} from '@mui/material'
import ErrorHandler from '../ErrorHandler';
import ListTableOrder from "../Orders/ListTableOrder";

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

const GetBill = ({ tips }) => {
  const [orders, setOrders] = useState([]);
  const { handleShowSnackbar, showError } = ErrorHandler();
  const [total, setTotal] = useState(0)
  const [coupon, setCoupon] = useState(0)
  const [open, setOpen] = useState(false);

  const id = useParams();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      const order_list = await ListTableOrder(id.id);
      setOrders(order_list);
      console.log(orders)
    };

    fetchData();
  }, [id.id]);

  const getTotal = async () => {
    console.log('Fetching total...')
    if (!orders) {
      return;
    }
    await fetch(`http://localhost:8000/checkout/bill/${id.id}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to view bill. Please try again.');
      }
    }).then((data) => {
      console.log(data)
      setTotal(data.total);
      setCoupon(data.coupon)
    }).catch(error => {
      console.log(error);
      handleShowSnackbar(error.message);
    })    
  }

  useEffect(() => {
    getTotal();
  }, [])

  return (
    <>
      <Button variant="contained" color="primary" style={buttonStyle} onClick={() => setOpen(true)}>
        Request Bill
      </Button>
      <Dialog open={open} onClose={handleClose} sx={{
        "& .MuiDialog-paper": {
          border: "8px solid #FFA0A0",
          borderRadius: 7,
          width: 400,
          height: '65%',
        },
      }}>
        <Paper elevation={3} sx={{ textAlign: 'left', margin: 'auto', padding: '16px', width: '300px' }}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '30px' }}>
          <b>Bill</b>
          <br /> 
        </DialogTitle>
          Table ID: {id.id}
          <Divider />
          {orders.map((order) => (
            <div key={order.name} style={{ fontSize: '25px', display: 'flex', justifyContent: 'space-between' }}>
              <span>
                {order.amount}x {order.name.toUpperCase()}
              </span>
              <span>
                ${order.cost}
              </span>
            </div>
          ))}
          <Divider />
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Discount: -${coupon}
          </p>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Tips: ${tips}
          </p>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
            Total: ${total}
          </p>
          <Divider />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <p style={{ fontSize: '16px', margin: 0 }}>Date: {formattedDate}</p>
            <p style={{ fontSize: '16px', margin: 0, marginLeft: '20px' }}>{formattedTime}</p>
          </div>
        </Paper>
        
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button
            size="small"
            onClick={handleClose} 
            style={{
              background: '#81c784', 
              color: 'black',
              fontWeight: 'bold',
              fontSize: '1vw',
              width: '6vw',
              height: '4vh',
              borderRadius: 10,
            }}
          >
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
      {showError}
    </>
  )
}

export default GetBill;

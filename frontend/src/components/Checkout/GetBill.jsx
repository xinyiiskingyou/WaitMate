import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  Paper,
  Button,
  DialogActions,
  Divider
} from '@mui/material'
import ListTableOrder from "../Orders/ListTableOrder";
import bill from "../../assets/bill.png"
import SubmitCoupon from "../Checkout/SubmitCoupon";
import SubmitTips from "../Checkout/SubmitTips";

const buttonStyle = { 
  border: '4px solid #FFA0A0', 
  height: '43px', 
  width: '200px',
  justifyContent: 'space-evenly',
  background: "#FFCFCF",
  color: 'black',
  fontWeight: "bold",
  borderRadius: 8,
}

const GetBill = ({id}) => {

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [tips, setTips] = useState(0);

  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setOpen(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      const order_list = await ListTableOrder(id);
      setOrders(order_list);
    };

    fetchData();
  }, [id]);

  const getTotal = async () => {
    console.log('Fetching total...')
    if (!orders) {
      return;
    }
    await fetch(`http://localhost:8000/checkout/bill/${id}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to view bill. Please try again.');
      }
    }).then((data) => {
      console.log(data);
      setTotal(data.total);
      setDiscount(data.discount);
      setTips(data.tip);
    }).catch(error => {
      console.log(error);
    })    
  }

  useEffect(() => {
    getTotal();
  })

  return (
    <>
      <Button variant="contained" color="primary" style={buttonStyle} onClick={() => setDialogOpen(true)}>
        Request Bill
        <img src={bill} alt="BillIcon" style={{
          width: '36px',
          height: '32px',
        }}/>
      </Button>
      
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle style={{ textAlign: 'center', fontSize: '17px' }}>
          <b>Would you like to use a coupon code or add tip?</b>
          <br /> 
        </DialogTitle>
          <SubmitTips id={id} tip={tips} />
          <SubmitCoupon id={id} />

          <DialogActions style={{ justifyContent: 'center' }}>
            <Button
              size="small"
              onClick={handleDialogClose} 
              style={{
                background: '#81c784', 
                color: 'black',
                fontWeight: 'bold',
                fontSize: '14px',
                width: '6vw',
                height: '4vh',
                borderRadius: 10,
              }}
            >
              CONFIRM
            </Button>
            <Button
              size="small"
              onClick={() => setDialogOpen(false)} 
              style={{
                background: '#81A9C7', 
                color: 'black',
                fontWeight: 'bold',
                fontSize: '14px',
                width: '6vw',
                height: '4vh',
                borderRadius: 10,
              }}
            >
              Cancel
            </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={handleClose} sx={{
        "& .MuiDialog-paper": {
          width: 400,
          height: '65%',
        },
      }}>
        <Paper elevation={5} sx={{ textAlign: 'left', margin: 'auto', padding: '25px', width: '300px' }}>
          <DialogTitle style={{ textAlign: 'center', fontSize: '30px' }}>
            <b>Bill</b>
            <br /> 
          </DialogTitle>
            Table ID: {id}
            <Divider />
            {orders.map((order) => (
              <div key={order.name} style={{ fontSize: '23px', display: 'flex', justifyContent: 'space-between', margin: '6px 0' }}>
                <span>
                  {order.amount}x {order.name.toUpperCase()}
                </span>
                <span>
                  ${order.cost}
                </span>
              </div>
            ))}
        
            <Divider />
            
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0' }}>
              Discount: -${discount}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0' }}>
              Tips: ${tips}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0' }}>
              Total: ${total}
            </div>

            <Divider />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <p style={{ fontSize: '16px', margin: 0 }}>Date: {formattedDate}</p>
              <p style={{ fontSize: '16px', margin: 0, marginLeft: '20px' }}>{formattedTime}</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <b>Please pay at the counter! Thank you!</b>
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
    </>
  )
}

export default GetBill;

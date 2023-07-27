import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardActions, CardContent, Container, Drawer, Box, Button, Typography, TextField, ButtonGroup, Grid } from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from 'date-fns/locale/en-GB';
import { v4 as uuidv4 } from "uuid";
import { useCookies } from 'react-cookie';

const Coupon = () => {
  const drawWidth = 220;
  const [mobileViewOpen, setMobileViewOpen] = useState(false);
  const [cookies] = useCookies(['token']);

  const handleToggle = () => {
      setMobileViewOpen(!mobileViewOpen);
  };

  const responsiveDrawer = (
      <div style={{ height: "100%" }}>
        <div style={{
          margin: "5%", 
          borderRadius: 8, 
          backgroundColor: '#ECEBEB',
          height: "97%",
          flexDirection:"column",
          }}>

          <Typography
              sx={{ textAlign: "center", pt: 4, 
                  color: "green", fontSize: 20 }}
          >
            Coupons
          </Typography>
        </div>

      </div>
  );
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState(null);
  const [coupons, setCoupons] = useState([]);

  const handleSubmit = async (e) => {
    const date = expiryDate.toDateString();
    const payload = {
      code: code,
      amount: discount,
      expiry: date,
    }
    fetch('http://localhost:8000/checkout/coupon/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.token}`
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          e.preventDefault();

          const newCoupon = {
            id: uuidv4(),
            code: code.toUpperCase(),
            discount,
            expiryDate,
          };
      
          setCoupons([...coupons, newCoupon]);
          setCode("");
          setDiscount("");
          setExpiryDate(null);
          return response.json();
        } else {
          throw new Error('Failed to save category');
        }
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await fetch('http://localhost:8000/checkout/coupon/view', {
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${cookies.token}`
        },
      });
      const data = await response.json();
      console.log('co', data);
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      alert(error)
    }
  };

  const handleRemove = (index) => {
    console.log(index);
    const payload = {
      code: index
    };
    fetch('http://localhost:8000/checkout/coupon/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${cookies.token}`
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (response.ok) {
          handleRemoveCoupon(index);
          return response.json();
        } else {
          throw new Error('Failed to remove item. Please try again.');
        }
      });
  }
  const handleRemoveCoupon = (index) => {
    setCoupons((prevCoupons) => {
      const updatedCoupons = [...prevCoupons];
      updatedCoupons.splice(index, 1);
      return updatedCoupons;
    });
  }

  return (
    <div>
    <div>
        <Box sx={{ display: "flex" }}>

            <Box
                component="nav"
                sx={{ width: { sm: drawWidth }, 
                    flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileViewOpen}
                    onClose={handleToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: "220",
                        },
                    }}
                >
                    {responsiveDrawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawWidth,
                        },
                    }}
                    open
                >
                <div style={{ height: "100%" }}>
                  <div style={{
                    margin: "5%", 
                    borderRadius: 8, 
                    backgroundColor: '#ECEBEB',
                    height: "97%",
                    flexDirection:"column"
                    }}>

                    <Typography
                        sx={{ textAlign: "center", pt: 4, 
                            color: "green", fontSize: 20 }}
                    >
                      Coupons
                    </Typography>
                    <div style={{margin: "5%"}}>
                          {coupons.map((coupon) => (
                            <Card key={coupon.code} style={{ marginTop: "20px" }}>
                              <CardContent>
                                <h3>{coupon.code}</h3>
                                <p>{coupon.amount}% off</p>
                                <p>{coupon.expiry}</p>
                                <Button variant='contained' style={{fontSize: "10px"}} onClick={() => handleRemove(coupon.code)}>Remove</Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                  </div>

                </div>
                </Drawer>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${220}px)` },
                }}
            >
            <div style={{border: "3px solid #FFA0A0", borderRadius: "10%", width: "20%", padding: "5%"} }>
              <form 
                onSubmit={handleSubmit}
                style={{display: "flex", flexDirection: "column"}}
              >
                <TextField
                  label="Coupon Code"
                  variant="outlined"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  margin="normal"
                />

                <TextField
                  label="Discount"
                  type='number'
                  variant="outlined"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                  margin="normal"
                  inputProps={{
                    step: '0.05',
                    min: '1',
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DatePicker
                  label="Expiry Date"
                  value={expiryDate}
                  onChange={(date) => setExpiryDate(date)}
                  renderInput={(params) => <TextField {...params} variant="outlined" />}
                  required
                  margin="normal"
                />
                </LocalizationProvider>

                <Button type="submit" variant="outlined" style={{marginTop: "5%", color: "#FFA0A0",borderColor: "#FFA0A0"}}>
                  Create Coupon
                </Button>
              </form>

            </div>
            </Box>
        </Box>
    </div>
</div>
  );
};
export default Coupon;

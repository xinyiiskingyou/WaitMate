import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardActions, CardContent, Container, Drawer, Box, Button, Typography, TextField, ButtonGroup, Grid } from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import enGB from 'date-fns/locale/en-GB';

import { v4 as uuidv4 } from "uuid";

const Coupon = () => {
  const drawWidth = 220;
  const [mobileViewOpen, setMobileViewOpen] = useState(false);
  
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

  const handleSubmit = (e) => {
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
  };
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
                            <Card key={coupon.id} style={{ marginTop: "20px" }}>
                              <CardContent>
                                <h3>{coupon.code}</h3>
                                <p>{coupon.discount}% off</p>
                                <p>{coupon.expiryDate && coupon.expiryDate.toDateString()}</p>
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
                  variant="outlined"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                  margin="normal"
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

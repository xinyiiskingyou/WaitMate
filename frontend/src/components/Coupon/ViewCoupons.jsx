import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  Divider,
  Pagination,
} from "@mui/material";
import './CouponCard.css';
import RemoveCoupon from "./RemoveCoupon";

const ITEMSPERPAGE = 12;

const ViewCoupons = ({coupons, setCoupons}) => {
  const [cookies] = useCookies(['token']);

  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastItem = currentPage * ITEMSPERPAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMSPERPAGE;
  const currentCoupons = Object.entries(coupons).slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(Object.entries(coupons).length / ITEMSPERPAGE);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

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
    }
  };

  useEffect(() => {
    fetchCoupons();
  });

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
    }}>
      <Paper elevation={10} sx={{
        padding: "20px",
        borderRadius: "20px",
        width: "1200px", 
        height: "580px", 
        marginTop: '7vh'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1vw',
          gridRowGap: '3vw',
          marginLeft: '60px',
          marginTop: '20px',
        }}>
          {currentCoupons.map(([index, coupon]) => (
            <Grid item key={index}>
              <Card className="custom-card">
                <RemoveCoupon index={coupon.code} setCoupons={setCoupons}/>
                <CardContent className="pink-section">
                  <Typography variant="h5" component="h2">
                    <b>{coupon.code}</b> 
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Discount: {coupon.amount}%
                  </Typography>
                </CardContent>
                <Divider />
                <CardContent className="expiry-date">
                  <Typography variant="body2" color="textSecondary">
                    Expiry Date: {coupon.expiry}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </div>
        <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)' }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </div>
      </Paper>
    </div>
  );
}

export default ViewCoupons;

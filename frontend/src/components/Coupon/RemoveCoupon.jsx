import React from "react";
import { useCookies } from 'react-cookie';
import { IconButton } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';

const RemoveCoupon = ( {index, setCoupons}) => {
  const [cookies] = useCookies(['token']);

  const handleRemove = async (index) => {
    console.log(index);
    const payload = {
      code: index
    };

    try {
      const response = await fetch('http://localhost:8000/checkout/coupon/delete', {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        handleRemoveCoupon(index);
        return response.json();
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.detail);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  const handleRemoveCoupon = (index) => {
    setCoupons((prevCoupons) => {
      const updatedCoupons = [...prevCoupons];
      updatedCoupons.splice(index, 1);
      return updatedCoupons;
    });
  };

  return (
    <IconButton style={{ position: 'absolute', marginLeft: '180px'}} onClick={() => handleRemove(index)}>
      <CloseIcon />
    </IconButton>
  );
};

export default RemoveCoupon;

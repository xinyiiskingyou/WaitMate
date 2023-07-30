import React, { useState } from "react";

import Manager from "../UserInterface/ManagerInterface";
import CreateCoupon from "./CreateCoupon";
import ViewCoupons from "./ViewCoupons";

const Coupon = () => {

  const [ coupons, setCoupons ] = useState([]);

  return (
    <>
      <Manager />
      <ViewCoupons coupons={coupons} setCoupons={setCoupons} />
      <CreateCoupon coupons={coupons} setCoupons={setCoupons}/>
    </>
  );
}

export default Coupon;
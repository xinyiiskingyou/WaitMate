import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from './components/Home';
import BrowseMenu from './components/Menu/BrowseMenu'
import ViewCart from './components/Orders/ViewCart';
import Staff from './components/Staff/Staff';
import ManagerLogin from './components/Staff/ManagerLogin'
import ManageMenu from './components/Menu/ManageMenu';
import ManagerSettings from './components/Staff/ManagerSettings';
import Coupon from './components/Coupon/CouponPage';
import KitchenstaffLogin from './components/Staff/KitchenstaffLogin'
import KitchenInterface from './components/Staff/KitchenInterface';
import WaitstaffLogin from './components/Staff/WaitstaffLogin';
import WaitStaffInterface from './components/Staff/WaitStaffInterface';

import { getToken } from './auth.js';

function App() {
  const [manager, setManager] = React.useState("false");
  async function isAuth () {
    const body = {
      'stafftype': ['manager']
    }
  
    fetch('http://localhost:8000/auth/user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(body),
    }).then(response => {
      if (response.ok) {
        setManager(true);
      } else {
        setManager(false);
      }
    })
  }

  React.useEffect(() => {
    isAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse/:id" element={<BrowseMenu />} />
        <Route path="/cart/:id" element={<ViewCart />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/menu" element={ manager ? (<ManageMenu />) : (<Navigate to='/manager/login'/>)} />
        <Route path="/manager/setting" element={ manager ? (<ManagerSettings />) : (<Navigate to='/manager/login'/> )} />
        <Route path="/manager/coupon" element={manager ? (<Coupon />) : (<Navigate to='/manager/login'/>)} />
        <Route path="/waitstaff/login" element={<WaitstaffLogin />} />
        <Route path="/waitstaff/list" element={<WaitStaffInterface />} />
        <Route path="/kitchenstaff/login" element={<KitchenstaffLogin />} />
        <Route path="/kitchenstaff/list" element={<KitchenInterface />} />
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)

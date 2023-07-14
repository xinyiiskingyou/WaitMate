import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Menu from './components/Menu';
import Staff from './components/Staff';
import WaitStaff from './components/WaitStaff';
import Kitchenlist from './components/Kitchenlist';
import Cart from './components/Cart';
import Browse from './components/Browse';
import ManagerLogin from './components/ManagerLogin';
import KitchenstaffLogin from './components/KitchenstaffLogin';
import WaitstaffLogin from './components/WaitstaffLogin';
import Manager from './components/ManagerInterface';
import Coupon from './components/CouponPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/waitstaff" element={<WaitStaff />} />
        <Route path="/Kitchenlist" element={<Kitchenlist />} />
        <Route path="/Cart/:id" element={<Cart />} />
        <Route path="/Browse/:id" element={<Browse />} />
        <Route path="/ManagerLogin" element={<ManagerLogin />} />
        <Route path="/WaitstaffLogin" element={<WaitstaffLogin />} />
        <Route path="/KitchenstaffLogin" element={<KitchenstaffLogin />} />


        <Route path="/Manager" element={<Manager />} />
        <Route path="/coupon" element={<Coupon />} />
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
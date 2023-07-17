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
import Manager from './components/ManagerInterface';
import Coupon from './components/CouponPage';
import Bill from './components/Bill';

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
        <Route path="/Manager" element={<Manager />} />
        <Route path="/coupon" element={<Coupon />} />
        <Route path="/Bill/:id" element={<Bill />} />
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
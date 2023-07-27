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
import Settings from './components/Settings';
import Manager from './components/ManagerInterface';
import Coupon from './components/CouponPage';
import { Navigate } from 'react-router-dom';
import { getToken } from './auth.js';
import Bill from './components/Bill';
import Memory from './components/Memory';


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
        <Route path="/menu" element={ manager ? (<Menu />) : (<Navigate to='/ManagerLogin'/>)} />
        <Route path="/Settings" element={ manager ? (<Settings />) : (<Navigate to='/ManagerLogin'/> )} />
        <Route path="/Manager" element={manager ? (<Manager />) : (<Navigate to='/ManagerLogin'/>)} />
        <Route path="/coupon" element={manager ? (<Coupon />) : (<Navigate to='/ManagerLogin'/>)} />

        <Route path="/staff" element={<Staff />} />
        <Route path="/waitstaff" element={<WaitStaff />} />
        <Route path="/Kitchenlist" element={<Kitchenlist />} />
        <Route path="/Cart/:id" element={<Cart />} />
        <Route path="/Browse/:id" element={<Browse />} />
        <Route path="/ManagerLogin" element={<ManagerLogin />} />
        <Route path="/WaitstaffLogin" element={<WaitstaffLogin />} />
        <Route path="/KitchenstaffLogin" element={<KitchenstaffLogin />} />
        <Route path="/Bill/:id" element={<Bill />} />
        <Route path="/Memory/:id" element={<Memory />} />

      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
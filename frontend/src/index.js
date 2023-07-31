
import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from './components/Home';
import BrowseMenu from './components/Menu/BrowseMenu'
import ViewCart from './components/Orders/ViewCart';
import Staff from './components/StaffType';
import ManagerLogin from './components/LoginPage/ManagerLogin'
import ManageMenu from './components/Menu/ManageMenu';
import ManageMeme from './components/Meme/ManageMeme';
import SettingPage from './components/LoginPage/ManagerSettingsPage';
import Coupon from './components/Coupon/CouponPage';
<<<<<<< HEAD
import KitchenstaffLogin from './components/LoginPage/KitchenstaffLogin'
import KitchenInterface from './components/UserInterface/KitchenInterface';
import WaitstaffLogin from './components/LoginPage/WaitstaffLogin';
import WaitStaffInterface from './components/UserInterface/WaitStaffInterface';
import { getToken } from './auth.js';
import GamePage from './components/Activity/ActivityGamePage';
=======
import KitchenstaffLogin from './components/Staff/KitchenstaffLogin'
import KitchenInterface from './components/Staff/KitchenInterface';
import WaitstaffLogin from './components/Staff/WaitstaffLogin';
import WaitStaffInterface from './components/Staff/WaitStaffInterface';
import { getToken } from './auth.js';
>>>>>>> 0f929a4f4 (merged with s3sunnie)
import CustomerTooBored from './components/Activity/CustomerTooBored';
import CustomerMeme from './components/Meme/CustomerMeme';

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
        <Route path="/customer/browse/:id" element={<BrowseMenu />} />
        <Route path="/customer/cart/:id" element={<ViewCart />} />
        <Route path="/customer/activity/:id" element={<CustomerTooBored />} />
<<<<<<< HEAD
        <Route path="/customer/activity/gamepage/:id" element={<GamePage />} />

=======
>>>>>>> 83281f792 (add path for meme)
        <Route path="/customer/meme/:id" element={<CustomerMeme />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route path="/manager/menu" element={ manager ? (<ManageMenu />) : (<Navigate to='/manager/login'/>)} />
        <Route path="/manager/meme" element={ manager ? (<ManageMeme />) : (<Navigate to='/manager/login'/>)} />
        <Route path="/manager/setting" element={ manager ? (<SettingPage />) : (<Navigate to='/manager/login'/> )} />
        <Route path="/manager/coupon" element={manager ? (<Coupon />) : (<Navigate to='/manager/login'/>)} />
        <Route path="/waitstaff/login" element={<WaitstaffLogin />} />
        <Route path="/waitstaff/list" element={<WaitStaffInterface />} />
        <Route path="/kitchenstaff/login" element={<KitchenstaffLogin />} />
        <Route path="/kitchenstaff/list" element={<KitchenInterface />} />
<<<<<<< HEAD
        <Route path="/customer/activity/:id" element={<CustomerTooBored />} />
        <Route path="/customer/meme/:id" element={<CustomerMeme />} />
=======
        <Route path="/toobored/:id" element={<CustomerTooBored />} />
        <Route path="/customermeme/:id" element={<CustomerMeme />} />
>>>>>>> 0f929a4f4 (merged with s3sunnie)
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)

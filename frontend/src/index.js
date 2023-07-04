import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Button from '@mui/material/Button';
import Home from './components/Home';
// import Card from './components/Card';
import Menu from './components/Menu';
import Staff from './components/Staff';
import WaitStaff from './components/WaitStaff';
import SelectTable from './components/SelectTable';
import CustomerMain from './components/CustomerMain';
import CustomerMenuPage from './components/CustomerMenuPage';
import Kitchenlist from './components/Kitchenlist';
import Cart from './components/Cart';
import Browse from './components/Browse';
import ManagerLogin from './components/ManagerLogin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/waitstaff" element={<WaitStaff />} />
        <Route path="/SelectTable" element={<SelectTable />} />
        <Route path="/CustomerMain/:id" element={<CustomerMain />} />
        <Route path="/CustomerMenuPage/:id" element={<CustomerMenuPage />} />
        <Route path="/Kitchenlist" element={<Kitchenlist />} />
        <Route path="/customerMenu" element={<customerMenu />} />
        <Route path="/Cart/:id" element={<Cart />} />
        <Route path="/Browse/:id" element={<Browse />} />
        <Route path="/ManagerLogin" element={<ManagerLogin />} />

      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
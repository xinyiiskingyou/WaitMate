

import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Button from '@mui/material/Button';
import Home from './components/Home';
// import Card from './components/Card';
import Menu from './components/Menu';
import Staff from './components/Staff';
import SelectTable from './components/SelectTable';
import CustomerMain from './components/CustomerMain';
import CustomerMenuPage from './components/CustomerMenuPage';
import Kitchenlist from './components/Kitchenlist';
import Cart from './components/Cart';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/SelectTable" element={<SelectTable />} />
        <Route path="/CustomerMain/:id" element={<CustomerMain />} />
        <Route path="/CustomerMenuPage/:id" element={<CustomerMenuPage />} />
        <Route path="/Kitchenlist" element={<Kitchenlist />} />
        <Route path="/customerMenu" element={<customerMenu />} />
        <Route path="/Cart/:id" element={<Cart />} />

      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
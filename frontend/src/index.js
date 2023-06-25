

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/SelectTable" element={<SelectTable />} />
        <Route path="/CustomerMain" element={<CustomerMain />} />
        <Route path="/CustomerMenuPage" element={<CustomerMenuPage />} />
      </Routes>
    </Router>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
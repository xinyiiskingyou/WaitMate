

import * as React from 'react';
import { render } from 'react-dom';
import Button from '@mui/material/Button';
import Home from './components/Home';
import Card from './components/Card';
export default function App() {
  return (
    <div>
      <Home />
    </div>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
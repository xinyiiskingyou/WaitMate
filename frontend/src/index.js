

import * as React from 'react';
import { render } from 'react-dom';
import Button from '@mui/material/Button';
import MyComponent from './components/Header';

export default function App() {
  return (
    <div>
      <MyComponent />
    </div>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
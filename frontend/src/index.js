

import * as React from 'react';
import { render } from 'react-dom';
import Button from '@mui/material/Button';

export default function App() {
  return (
    <div>
      <Button variant="contained">Hello World</Button>
    </div>
  );
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
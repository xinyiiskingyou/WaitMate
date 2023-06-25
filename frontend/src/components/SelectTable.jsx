import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {Link} from 'react-router-dom';

const SelectTable = () => {
  const buttonStyle = {
    width: '120px',
    height: '50px',
    fontSize: '20px'
  };
  const headingStyle = {
    textAlign: 'center',
    fontSize: '30px',
    marginBottom: '20px'
  };
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);
  const handleInputChange = (event) => {
    const value = event.target.value;
    if (value === '' || Number.isInteger(Number(value))) {
      setInputValue(value);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={"100vh"}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <h2 style={headingStyle}>Enter Table Number Shown on Table</h2>
        </Grid>
        <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
            <TextField
                label="Enter NUMBERS Only"
                // value={tablenum}
                size="small"
                margin= 'normal'
                fullWidth
            />  
            </Box> 
        </Grid>     
        <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Link to="/CustomerMain">
                <Button variant='contained' color='primary' style={buttonStyle}>
                    Confirm
                </Button>
            </Link>
        </Grid>
        </Grid>
    </Box>
  )
  const handleSubmit = () => {
    if (inputValue === '' || Number.isInteger(Number(inputValue))) {
      // Handle successful submission
    } else {
      setError(true);
    }
  };
  return (
    <div>
      <TextField
        label="Number"
        variant="outlined"
        value={inputValue}
        onChange={handleInputChange}
        error={error}
        helperText={error ? 'Please enter a valid integer' : ''}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
export default SelectTable;

{/* const buttonStyle = {
  width: '120px',
  height: '50px',
  fontSize: '20px'
};
const headingStyle = {
  textAlign: 'center',
  fontSize: '30px',
  marginBottom: '20px'
};
return (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height={"100vh"}
  >
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <h2 style={headingStyle}>Enter Table Number Shown on Table</h2>
      </Grid>
      <Grid container spacing={0} justifyContent="center" alignItems="center">
          <Box
              component="form"
              sx={{
                  '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
          >
          <TextField
              label="Enter NUMBERS Only"
              // value={tablenum}
              size="small"
              margin= 'normal'
              fullWidth
          />  
          </Box> 
      </Grid>     
      <Grid container spacing={0} justifyContent="center" alignItems="center">
          <Link to="/CustomerMain">
              <Button variant='contained' color='primary' style={buttonStyle}>
                  Confirm
              </Button>
          </Link>
      </Grid>
      </Grid>
  </Box>
); */}

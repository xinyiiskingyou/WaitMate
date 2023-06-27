import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {Link} from 'react-router-dom';

const SelectTable = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setError(isNaN(inputValue));
  };
  const handleSubmit = () => {
    if (error) {
      console.log('Invalid input: must be a number');
      return;
    }
    console.log('Submitted value:', Number(value));
  };

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
                value={value}
                onChange={handleInputChange}
                error={error}
                helperText={error && 'Invalid input: must be a number'}
                size="small"
                margin= 'normal'
                fullWidth
            />  
            </Box> 
        </Grid>     
        <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Link to="/CustomerMain">
                <Button variant='contained' color='primary' style={buttonStyle} onClick={handleSubmit}>
                    Confirm
                </Button>
            </Link>
        </Grid>
        </Grid>
    </Box>
  );
}

export default SelectTable;

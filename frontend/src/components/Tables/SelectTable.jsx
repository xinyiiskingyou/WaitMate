import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ErrorHandler from '../ErrorHandler';

const buttonStyle = {
  width: '7.5vw',
  height: '4vh',
  fontSize: '1vw',
  background: '#FFFFFF',
  fontWeight: 'bold',
  color: 'black',
  borderRadius: 5
};

const SelectTable = () => {
  const [value, setValue] = useState('');
  const { showSnackbar, handleShowSnackbar, showError } = ErrorHandler(); 

  const navigate = useNavigate();
  const nextLink = `/browse/${value}`;

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
  };

  const handleSelectTable = async () => {
    // do nothing if there is no input
    if (!value) {
      return;
    }
    console.log('value:', value);
    const table = { table_id : value };
    try {
      const response = await fetch('http://localhost:8000/table/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(table),
      });

      if (response.ok) {
        navigate(nextLink);
      } else {
        const errorResponse = await response.json();
        handleShowSnackbar(errorResponse.detail);
        setValue('');
      }
    } catch (error) {
      console.error(error);
      handleShowSnackbar(error.message);
      setValue('');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault(); 
    }}>
      <Grid container alignItems="center" justifyContent="center" columnSpacing={1}>
        <Grid item>
          <TextField
            required
            id="standard-required"
            label="Enter NUMBERS Only"
            value={value}
            onChange={handleInputChange}
            helperText={showSnackbar && 'Invalid input: must be a number'}
            size="small"
            margin= 'normal'
            type="number" 
            fullWidth
            inputProps={{
              step: "1",
              min: "1"
            }}/>  
        </Grid>
        <Grid item>
          <Link onClick={handleSelectTable}>
            <Button variant='contained' color='primary' type='submit' style={buttonStyle}>
              Confirm
            </Button>
          </Link>
        </Grid>
      </Grid>
      {showError}
    </form>
  );
}  

export default SelectTable;

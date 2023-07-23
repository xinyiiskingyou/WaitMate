import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import manage from '../assets/management.png'
import welcome from '../assets/welcome.png'

const Home = () => {

  const [value, setValue] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const nextLink = `/Browse/${value}`; 
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setError(isNaN(inputValue));
  };

  const handleSnackbarClose = () => {
    setShowSnackbar(false); // Close the Snackbar
  };

  const handleSelectTable = async () => {
    console.log('value:', value);
    const table = { table_id : value };
    try {
      const response = await  fetch('http://localhost:8000/table/select', {
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
        setErrorMessage(errorResponse.detail);
        setShowSnackbar(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
      navigate("/");
      setShowSnackbar(true);
    }
  };

  const buttonStyle = {
    width: '7.5vw',
    height: '3.3vh',
    fontSize: '1vw',
    background: '#FFA0A0',
    borderRadius: 5,
  };

  return (
    <Container maxWidth="sm">
      <Box>
        <Typography variant="h4" component="h1" align="center" style={{marginTop: '8vh', fontWeight: "bold"}}>
        <img 
          src={welcome} 
          alt="WIcon" 
          style={{
            width: '20vw',
            height: '37vh',
            verticalAlign: 'middle',
          }}/>
          <br />
          <span style={{ marginRight: '1vw' }}>
            Customer Board <br />
          </span>
        </Typography>
        <Typography variant="h6" align="center">Please select your table number.</Typography>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={0} justifyContent="center" alignItems="center">
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
            <form onSubmit={(e) => {
              e.preventDefault(); // Prevent default form submission behavior
            }}>
            <Grid container alignItems="center" justifyContent="center" columnSpacing={1}>
              <Grid item>
                <TextField
                  required
                  id="standard-required"
                  label="Enter NUMBERS Only"
                  value={value}
                  onChange={handleInputChange}
                  error={error !== ''}
                  helperText={error && 'Invalid input: must be a number'}
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
            </form>
            </Box> 
          </Grid>  
        </Grid>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={1500} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          <AlertTitle>Error</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>

      <Link to="/staff">
        <Button
          variant="contained"
          color="secondary"
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            fontWeight: "bolder",
            background: "#FFA0A0"
          }}
        >
        <img 
          src={manage} 
          alt="ManageIcon" 
          style={{
            width: '6vh',
            height: '6vh',
            borderRadius: 3,
            marginRight: '0.5vw'
          }}/>
          Staff Login
        </Button>
      </Link>
    </Container>

  );
};

export default Home;
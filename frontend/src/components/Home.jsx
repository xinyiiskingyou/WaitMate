import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Grid';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import manage from '../assets/management.png'
import welcome from '../assets/welcome.png'

const Home = () => {

  const [value, setValue] = useState(null);
  let [error, setError] = useState(false);

  const nextLink = `/Browse/${value}`; 
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setValue(inputValue);
    setError(isNaN(inputValue));
  };

  const handleSubmit = () => {

    console.log('value:', value);
    const table = { table_id : value };

    fetch("http://localhost:8000/table/select", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(table)
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to select table. Please try again.');
      }
    }).then(() => {
      navigate(nextLink);
    })
    .catch(errors => {
      console.log(errors);
      alert(errors);
      navigate("/");
    })
  };

  const buttonStyle = {
    width: '10vw',
    height: '4vh',
    fontSize: '1vw',
    background: '#FFA0A0',
    marginLeft: '1.5vw',
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
              <TextField
                required
                id="standard-required"
                label="Enter NUMBER Only"
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
              <Link onClick={handleSubmit}>
                <Button variant='contained' color='primary' type='submit' style={buttonStyle}>
                  Confirm
                </Button>
              </Link>
            </form>
            </Box> 
          </Grid>  
        </Grid>
      </Box>

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
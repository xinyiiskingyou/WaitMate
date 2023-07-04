import React from 'react';
import Grid from '@mui/material/Grid';
import { auth } from "./firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {Link, useParams} from 'react-router-dom';
import { Container, Box, Button, Typography, TextField } from '@mui/material';

const ManagerLogin = () => {
  
  return (
    <Grid container direction='column' justifyContent='center' spacing={0}
      sx={{ minHeight: '100vh' , p: 20}}>
      <h2>Manager Login</h2>
      <Grid>ID</Grid>
      <TextField />
      <Grid>Password</Grid>
      <TextField />
    </Grid>

  
  )
}

export default ManagerLogin;

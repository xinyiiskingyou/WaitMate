import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ErrorHandler = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleShowSnackbar = (message) => {
    setErrorMessage(message);
    setShowSnackbar(true);
  };

  const handleHideSnackbar = () => {
    setShowSnackbar(false);
  };

  const showError = (
    <Snackbar
      open={showSnackbar}
      autoHideDuration={1500}
      onClose={handleHideSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="error" onClose={handleHideSnackbar} sx={{ width: '100%' }}>
        <AlertTitle>Error</AlertTitle>
        {errorMessage}
      </Alert>
    </Snackbar>
  );

  return {
    showSnackbar,
    handleShowSnackbar,
    showError,
  };
};

export default ErrorHandler;

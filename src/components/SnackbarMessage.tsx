import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface SnackbarMessageProps {
  open: boolean;
  message: string | null;
  severity?: 'error' | 'success' | 'info' | 'warning';
  onClose: () => void;
}

export const SnackbarMessage = ({ open, message, severity = 'info', onClose }: SnackbarMessageProps) => (
  <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
    <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
);

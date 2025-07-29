import React, { useState, useMemo, useEffect } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon for light mode
import Container from '@mui/material/Container';
import MainTabs from './components/MainTabs';
import '@fontsource/lexend';

// Import logo image
import Logo from './assets/logo.png'; // Adjust path and format accordingly

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    if (savedMode) setMode(savedMode);
  }, []);
  const toggleTheme = () => {
    setMode((prev) => {
      const newMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={4}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo */}
          <Box component="img" src={Logo} alt="Logo" sx={{ height: 32, mr: 2 }} />

          {/* App title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            FileLu API Client 
          </Typography>

          {/* Theme toggle button */}
          <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <MainTabs />
      </Container>
    </ThemeProvider>
  );
}

export default App;

import React, { Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import AppRoutes from './routes';
import theme from './theme';

// Loading component
const Loading: React.FC = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    height="100vh"
  >
    <CircularProgress />
  </Box>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <React.Suspense fallback={<Loading />}>
          <AppRoutes />
        </React.Suspense>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;

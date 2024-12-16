import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './Header';
import Navbar from '../Navbar/Navbar';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      position: 'relative' 
    }}>
      <CssBaseline />
      <Header />
      {user && <Navbar />}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          marginTop: user ? '64px' : 0 // Thêm margin-top khi có Navbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Lấy lý do từ state được truyền từ ProtectedRoute
  const reason = location.state?.reason || 'Không xác định';

  const handleGoBack = () => {
    logout(); // Đăng xuất và quay về trang login
  };

  return (
    <Container maxWidth="xs">
      <Box 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}
      >
        <Typography component="h1" variant="h5" color="error">
          Truy Cập Không Được Phép
        </Typography>
        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          Bạn không có quyền truy cập vào trang này.
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Lý do: {reason}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 3 }}
          onClick={handleGoBack}
        >
          Quay về trang đăng nhập
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;

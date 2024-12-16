import React from 'react';
import { Typography, Container } from '@mui/material';

const ManagerProfile: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Hồ Sơ Quản Lý
      </Typography>
      <Typography>
        Trang thông tin cá nhân của quản lý.
      </Typography>
    </Container>
  );
};

export default ManagerProfile;

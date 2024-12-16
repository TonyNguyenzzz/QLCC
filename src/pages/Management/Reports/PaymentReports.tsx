import React from 'react';
import { Typography, Container } from '@mui/material';

const PaymentReports: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Báo Cáo Thanh Toán
      </Typography>
      <Typography>
        Trang báo cáo thanh toán dành cho quản lý.
      </Typography>
    </Container>
  );
};

export default PaymentReports;

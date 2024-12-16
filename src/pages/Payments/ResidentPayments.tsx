import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Grid,
  Card,
  CardContent,
  Chip,
  Box,
  LinearProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WarningIcon from '@mui/icons-material/Warning';

// Định nghĩa interface cho khoản phí
interface Payment {
  id: number;
  type: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description?: string;
}

// Danh sách khoản phí mẫu (sau này sẽ kết nối với backend)
const mockPayments: Payment[] = [
  {
    id: 1,
    type: 'Phí quản lý',
    amount: 500000,
    dueDate: '2024-01-15',
    status: 'pending',
    description: 'Phí dịch vụ quản lý tòa nhà hàng tháng'
  },
  {
    id: 2,
    type: 'Phí điện nước',
    amount: 350000,
    dueDate: '2024-01-20',
    status: 'pending',
    description: 'Tiền điện nước tháng 12/2023'
  },
  {
    id: 3,
    type: 'Phí gửi xe',
    amount: 200000,
    dueDate: '2024-01-10',
    status: 'overdue',
    description: 'Phí giữ xe tháng 12/2023'
  }
];

const ResidentPayments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Trong tương lai, thay thế bằng API call
    setPayments(mockPayments);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const handlePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setOpenPaymentDialog(true);
    setPaymentSuccess(false);
  };

  const confirmPayment = () => {
    if (selectedPayment) {
      // Mô phỏng quá trình thanh toán
      let progress = 0;
      const timer = setInterval(() => {
        progress += 20;
        setPaymentProgress(progress);

        if (progress >= 100) {
          clearInterval(timer);
          const updatedPayments = payments.map(p => 
            p.id === selectedPayment.id 
              ? { ...p, status: 'paid' as const } 
              : p
          );
          setPayments(updatedPayments);
          setPaymentSuccess(true);
          setTimeout(() => {
            setOpenPaymentDialog(false);
            setPaymentProgress(0);
          }, 1500);
        }
      }, 300);
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status !== 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        <PaymentIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Quản Lý Thanh Toán
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tổng Quan</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tổng số khoản phí:</Typography>
                <Typography variant="body1" fontWeight="bold">{payments.length}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Chưa thanh toán:</Typography>
                <Typography variant="body1" color="error">
                  {payments.filter(p => p.status !== 'paid').length}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Tổng số tiền:</Typography>
                <Typography variant="body1" color="primary">
                  {totalAmount.toLocaleString()} VNĐ
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Còn phải trả:</Typography>
                <Typography variant="body1" color="error">
                  {pendingAmount.toLocaleString()} VNĐ
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Loại Phí</TableCell>
                  <TableCell align="right">Số Tiền</TableCell>
                  <TableCell align="right">Ngày Đến Hạn</TableCell>
                  <TableCell align="right">Trạng Thái</TableCell>
                  <TableCell align="right">Thao Tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow 
                    key={payment.id} 
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      backgroundColor: payment.status === 'overdue' 
                        ? 'rgba(255,0,0,0.05)' 
                        : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ReceiptIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Box>
                          <Typography variant="subtitle2">{payment.type}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {payment.description}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {payment.amount.toLocaleString()} VNĐ
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        {payment.status === 'overdue' && (
                          <WarningIcon color="error" sx={{ mr: 1 }} />
                        )}
                        {payment.dueDate}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Chip 
                        label={payment.status === 'pending' ? 'Chưa Thanh Toán' 
                             : payment.status === 'paid' ? 'Đã Thanh Toán' 
                             : 'Quá Hạn'}
                        color={getStatusColor(payment.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        disabled={payment.status === 'paid'}
                        onClick={() => handlePayment(payment)}
                      >
                        Thanh Toán
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog 
        open={openPaymentDialog} 
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác Nhận Thanh Toán</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedPayment.type}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Số tiền: {selectedPayment.amount.toLocaleString()} VNĐ
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedPayment.description}
              </Typography>
              
              {paymentProgress > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={paymentProgress} 
                    color="primary"
                  />
                </Box>
              )}

              {paymentSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Thanh toán thành công!
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenPaymentDialog(false)} 
            color="secondary"
            disabled={paymentProgress > 0}
          >
            Hủy
          </Button>
          <Button 
            onClick={confirmPayment} 
            color="primary" 
            variant="contained"
            disabled={paymentProgress > 0 || paymentSuccess}
          >
            Xác Nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResidentPayments;

import React, { useState, useEffect, useMemo } from 'react';
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
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  AssessmentOutlined as ReportIcon,
  FilterList as FilterIcon,
  PaymentOutlined as PaymentIcon,
  WarningAmber as WarningIcon,
  CheckCircleOutline as SuccessIcon,
  PendingOutlined as PendingIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

// Định nghĩa interface cho khoản phí
interface Payment {
  id: number;
  residentName: string;
  apartmentCode: string;
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
    residentName: 'Nguyễn Văn A',
    apartmentCode: 'A101',
    type: 'Phí quản lý',
    amount: 500000,
    dueDate: '2024-01-15',
    status: 'pending',
    description: 'Phí dịch vụ quản lý tòa nhà tháng 1/2024'
  },
  {
    id: 2,
    residentName: 'Trần Thị B',
    apartmentCode: 'B202',
    type: 'Phí điện nước',
    amount: 350000,
    dueDate: '2024-01-20',
    status: 'pending',
    description: 'Tiền điện nước tháng 12/2023'
  },
  {
    id: 3,
    residentName: 'Lê Văn C',
    apartmentCode: 'C303',
    type: 'Phí gửi xe',
    amount: 200000,
    dueDate: '2024-01-10',
    status: 'overdue',
    description: 'Phí giữ xe tháng 12/2023'
  }
];

const ManagerPayments: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Trong tương lai, thay thế bằng API call
    setPayments(mockPayments);
    setFilteredPayments(mockPayments);
  }, []);

  // Lọc và tìm kiếm payments
  const processedPayments = useMemo(() => {
    let result = payments;

    // Lọc theo status
    if (filterStatus !== 'all') {
      result = result.filter(p => p.status === filterStatus);
    }

    // Tìm kiếm theo tên hoặc mã căn hộ
    if (searchTerm) {
      result = result.filter(p => 
        p.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.apartmentCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [payments, filterStatus, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <PendingIcon color="warning" />;
      case 'paid': return <SuccessIcon color="success" />;
      case 'overdue': return <WarningIcon color="error" />;
      default: return null;
    }
  };

  const getTotalAmount = (paymentList: Payment[]) => {
    return paymentList.reduce((total, payment) => total + payment.amount, 0);
  };

  const handlePaymentConfirmation = (payment: Payment) => {
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
          setFilteredPayments(updatedPayments);
          setPaymentSuccess(true);
          setTimeout(() => {
            setOpenPaymentDialog(false);
            setPaymentProgress(0);
          }, 1500);
        }
      }, 300);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ReportIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
        <Typography variant="h4" gutterBottom>
          Quản Lý Thanh Toán
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Tìm kiếm (Tên/Mã Căn Hộ)"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <FilterIcon sx={{ mr: 2, color: 'text.secondary' }} />
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Trạng Thái</InputLabel>
            <Select
              value={filterStatus}
              label="Trạng Thái"
              onChange={(e) => setFilterStatus(e.target.value)}
              startAdornment={<FilterIcon sx={{ mr: 2 }} />}
            >
              <MenuItem value="all">Tất Cả</MenuItem>
              <MenuItem value="pending">Chưa Thanh Toán</MenuItem>
              <MenuItem value="paid">Đã Thanh Toán</MenuItem>
              <MenuItem value="overdue">Quá Hạn</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">Tổng Quan</Typography>
                  <Typography variant="body1">
                    Tổng số khoản phí: {processedPayments.length}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Tổng số tiền: {getTotalAmount(processedPayments).toLocaleString()} VNĐ
                  </Typography>
                </Box>
                <PaymentIcon sx={{ fontSize: 50, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên Cư Dân</TableCell>
              <TableCell>Mã Căn Hộ</TableCell>
              <TableCell>Loại Phí</TableCell>
              <TableCell align="right">Số Tiền</TableCell>
              <TableCell align="right">Ngày Đến Hạn</TableCell>
              <TableCell align="right">Trạng Thái</TableCell>
              <TableCell align="right">Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedPayments.map((payment) => (
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
                    {getStatusIcon(payment.status)}
                    <Box sx={{ ml: 1 }}>
                      <Typography variant="subtitle2">{payment.residentName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {payment.description}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{payment.apartmentCode}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell align="right">
                  {payment.amount.toLocaleString()} VNĐ
                </TableCell>
                <TableCell align="right">{payment.dueDate}</TableCell>
                <TableCell align="right">
                  <Chip 
                    label={
                      payment.status === 'pending' ? 'Chưa Thanh Toán' 
                      : payment.status === 'paid' ? 'Đã Thanh Toán' 
                      : 'Quá Hạn'
                    }
                    color={getStatusColor(payment.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Xác nhận thanh toán">
                    <IconButton 
                      color="primary"
                      disabled={payment.status === 'paid'}
                      onClick={() => handlePaymentConfirmation(payment)}
                    >
                      <PaymentIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog xác nhận thanh toán */}
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
                {selectedPayment.residentName} - {selectedPayment.apartmentCode}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Khoản phí: {selectedPayment.type}
              </Typography>
              <Typography variant="body1" gutterBottom color="primary">
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
                <Alert 
                  severity="success" 
                  sx={{ mt: 2 }}
                  icon={<SuccessIcon fontSize="inherit" />}
                >
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

export default ManagerPayments;

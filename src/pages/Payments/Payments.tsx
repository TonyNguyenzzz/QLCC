// src/pages/Payments/Payments.tsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Snackbar,
  Alert,
  LinearProgress,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  AccountBalance as BankIcon,
  CreditCard as CardIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { Payment } from '../../types/payment';
import { Building } from '../../types/building';
import PaymentReports from './PaymentReports';
import { buildingsData, paymentsData } from '../../data/paymentsData';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

const Payments: React.FC = () => {
  const theme = useTheme();
  const [buildings] = useState<Building[]>(buildingsData);
  const [payments, setPayments] = useState<Payment[]>(paymentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  const [activeTab, setActiveTab] = useState(0);

  const handleOpenDialog = (payment?: Payment) => {
    setSelectedPayment(payment || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedPayment(null);
    setOpenDialog(false);
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    handleCloseDialog();
    setSnackbar({
      open: true,
      message: selectedPayment 
        ? 'Thông tin thanh toán đã được cập nhật thành công' 
        : 'Thanh toán mới đã được thêm thành công',
      severity: 'success',
    });
  };

  const handleDelete = (id: number) => {
    setPayments(payments.filter(payment => payment.id !== id));
    setSnackbar({
      open: true,
      message: 'Thanh toán đã được xóa',
      severity: 'success',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'pending':
        return theme.palette.warning.main;
      case 'overdue':
        return theme.palette.error.main;
      case 'cancelled':
        return theme.palette.grey[500];
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'pending':
        return <WarningIcon />;
      case 'overdue':
        return <ErrorIcon />;
      default:
        return <ErrorIcon />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Đã thanh toán';
      case 'pending':
        return 'Chờ thanh toán';
      case 'overdue':
        return 'Quá hạn';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPaymentTypeText = (type: string) => {
    switch (type) {
      case 'rent':
        return 'Tiền thuê';
      case 'maintenance':
        return 'Phí bảo trì';
      case 'utility':
        return 'Tiền điện nước';
      case 'other':
        return 'Khác';
      default:
        return type;
    }
  };

  const getPaymentMethodIcon = (method?: string): React.ReactElement => {
    switch (method) {
      case 'cash':
        return <MoneyIcon />;
      case 'bank_transfer':
        return <BankIcon />;
      case 'credit_card':
        return <CardIcon />;
      default:
        return <MoneyIcon />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy');
  };

  const handleDateChange = (newValue: Date | null) => {
    setDateRange({ ...dateRange, start: newValue });
  };

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        payment.residentName.toLowerCase().includes(searchLower) ||
        payment.apartmentId.toLowerCase().includes(searchLower);
      const matchesType = typeFilter === 'all' || payment.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      const matchesDateRange = (!dateRange.start || payment.dueDate >= dateRange.start) &&
                           (!dateRange.end || payment.dueDate <= dateRange.end);
      return matchesSearch && matchesType && matchesStatus && matchesDateRange;
    });
  }, [payments, searchQuery, typeFilter, statusFilter, dateRange]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Danh sách thanh toán" />
        <Tab label="Báo cáo" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Quản lý thanh toán
            </Typography>
            <Typography color="text.secondary">
              Quản lý và theo dõi các khoản thanh toán của cư dân
            </Typography>
          </Box>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Loại thanh toán</InputLabel>
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    label="Loại thanh toán"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="rent">Tiền thuê</MenuItem>
                    <MenuItem value="maintenance">Phí bảo trì</MenuItem>
                    <MenuItem value="utility">Tiền điện nước</MenuItem>
                    <MenuItem value="other">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Trạng thái"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="pending">Chờ thanh toán</MenuItem>
                    <MenuItem value="completed">Đã thanh toán</MenuItem>
                    <MenuItem value="overdue">Quá hạn</MenuItem>
                    <MenuItem value="cancelled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                  <DatePicker
                    label="Ngày đến hạn"
                    value={dateRange.start}
                    onChange={handleDateChange}
                    sx={{ width: '100%' }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Thêm mới
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Cư dân</TableCell>
                  <TableCell>Căn hộ</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Ngày đến hạn</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Phương thức</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          {payment.residentName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HomeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          {payment.apartmentId}
                        </Box>
                      </TableCell>
                      <TableCell>{getPaymentTypeText(payment.type)}</TableCell>
                      <TableCell>{formatCurrency(payment.amount)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          {formatDate(payment.dueDate)}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(payment.status)}
                          label={getStatusText(payment.status)}
                          size="small"
                          sx={{
                            bgcolor: getStatusColor(payment.status),
                            color: 'white',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {payment.paymentMethod && (
                          <Tooltip title={payment.paymentMethod}>
                            <IconButton size="small">
                              {getPaymentMethodIcon(payment.paymentMethod)}
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(payment)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(payment.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredPayments.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Số dòng mỗi trang"
            />
          </TableContainer>

          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>
              {selectedPayment ? 'Chỉnh sửa thanh toán' : 'Thêm thanh toán mới'}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên cư dân"
                    defaultValue={selectedPayment?.residentName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mã căn hộ"
                    defaultValue={selectedPayment?.apartmentId}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số tiền"
                    type="number"
                    defaultValue={selectedPayment?.amount}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">VND</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Loại thanh toán</InputLabel>
                    <Select
                      defaultValue={selectedPayment?.type || 'rent'}
                      label="Loại thanh toán"
                    >
                      <MenuItem value="rent">Tiền thuê</MenuItem>
                      <MenuItem value="maintenance">Phí bảo trì</MenuItem>
                      <MenuItem value="utility">Tiền điện nước</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
                    <DatePicker
                      label="Ngày đến hạn"
                      value={selectedPayment?.dueDate || null}
                      onChange={() => {}}
                      sx={{ width: '100%' }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      defaultValue={selectedPayment?.status || 'pending'}
                      label="Trạng thái"
                    >
                      <MenuItem value="pending">Chờ thanh toán</MenuItem>
                      <MenuItem value="completed">Đã thanh toán</MenuItem>
                      <MenuItem value="overdue">Quá hạn</MenuItem>
                      <MenuItem value="cancelled">Đã hủy</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Phương thức thanh toán</InputLabel>
                    <Select
                      defaultValue={selectedPayment?.paymentMethod || ''}
                      label="Phương thức thanh toán"
                    >
                      <MenuItem value="cash">Tiền mặt</MenuItem>
                      <MenuItem value="bank_transfer">Chuyển khoản</MenuItem>
                      <MenuItem value="credit_card">Thẻ tín dụng</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả"
                    multiline
                    rows={3}
                    defaultValue={selectedPayment?.description}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Hủy</Button>
              <Button onClick={handleSave} variant="contained">
                {selectedPayment ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              severity={snackbar.severity}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      ) : (
        <PaymentReports />
      )}
    </Container>
  );
};

export default Payments;

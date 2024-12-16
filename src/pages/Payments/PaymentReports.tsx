import React, { useState, useMemo } from 'react';
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
  Box,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  FilterList as FilterIcon,
  Print as PrintIcon,
  GetApp as DownloadIcon,
  Money as MoneyIcon,
  AccountBalance as BankIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

import { usePaymentData } from '../../hooks/usePaymentData';

const PaymentReports = () => {
  const { payments, buildings } = usePaymentData();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    buildingId: ''
  });

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const paymentDate = new Date(payment.dueDate);
      const matchDate = (!filters.startDate || paymentDate >= new Date(filters.startDate)) &&
                        (!filters.endDate || paymentDate <= new Date(filters.endDate));
      const matchStatus = !filters.status || payment.status === filters.status;
      const matchBuilding = !filters.buildingId || payment.buildingId.toString() === filters.buildingId;
      return matchDate && matchStatus && matchBuilding;
    });
  }, [payments, filters]);

  // Thống kê tổng quan
  const overviewStats = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = filteredPayments.filter(p => p.status === 'completed');
    const pendingPayments = filteredPayments.filter(p => p.status === 'pending');

    return {
      total: totalAmount,
      completed: completedPayments.length,
      pending: pendingPayments.length,
      averageAmount: totalAmount / filteredPayments.length || 0
    };
  }, [filteredPayments]);

  // Dữ liệu biểu đồ
  const chartData = useMemo(() => {
    const monthlyData = filteredPayments.reduce((acc, payment) => {
      const month = format(new Date(payment.dueDate), 'MM/yyyy');
      if (!acc[month]) {
        acc[month] = { month, amount: 0, count: 0 };
      }
      acc[month].amount += payment.amount;
      acc[month].count += 1;
      return acc;
    }, {} as Record<string, { month: string, amount: number, count: number }>);

    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.month.split('/').reverse().join('-')).getTime() - 
      new Date(b.month.split('/').reverse().join('-')).getTime()
    );
  }, [filteredPayments]);

  // Xuất PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Báo Cáo Thanh Toán', 14, 15);
    
    const tableColumn = ['Mã', 'Tòa Nhà', 'Số Tiền', 'Ngày', 'Trạng Thái'];
    const tableRows = filteredPayments.map(payment => [
      payment.id,
      buildings.find(b => b.id.toString() === payment.buildingId.toString())?.name || 'N/A',
      payment.amount.toLocaleString() + ' VNĐ',
      format(new Date(payment.dueDate), 'dd/MM/yyyy'),
      payment.status
    ]);

    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    doc.save('bao_cao_thanh_toan.pdf');
  };

  // Xuất Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredPayments.map(payment => ({
      'Mã': payment.id,
      'Tòa Nhà': buildings.find(b => b.id.toString() === payment.buildingId.toString())?.name || 'N/A',
      'Số Tiền': payment.amount,
      'Ngày': format(new Date(payment.dueDate), 'dd/MM/yyyy'),
      'Trạng Thái': payment.status
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Báo Cáo');
    XLSX.writeFile(workbook, 'bao_cao_thanh_toan.xlsx');
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Container maxWidth="xl">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          <ReportIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Báo Cáo Thanh Toán
        </Typography>
        <Box>
          <Button 
            startIcon={<FilterIcon />} 
            onClick={() => setFilterOpen(true)}
            sx={{ mr: 1 }}
            variant="outlined"
          >
            Lọc
          </Button>
          <Button 
            startIcon={<PrintIcon />} 
            onClick={exportPDF}
            sx={{ mr: 1 }}
            variant="outlined"
            color="secondary"
          >
            Xuất PDF
          </Button>
          <Button 
            startIcon={<DownloadIcon />} 
            onClick={exportExcel}
            variant="outlined"
            color="success"
          >
            Xuất Excel
          </Button>
        </Box>
      </Box>

      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)}>
        <DialogTitle>Bộ lọc báo cáo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Từ ngày"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Đến ngày"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status}
                  label="Trạng thái"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                  <MenuItem value="pending">Đang chờ</MenuItem>
                  <MenuItem value="overdue">Quá hạn</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Tòa nhà</InputLabel>
                <Select
                  value={filters.buildingId}
                  label="Tòa nhà"
                  onChange={(e) => handleFilterChange('buildingId', e.target.value)}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {buildings.map(building => (
                    <MenuItem key={building.id} value={building.id}>
                      {building.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MoneyIcon sx={{ mr: 2, color: 'green' }} />
                <Typography variant="h6">Tổng Thu</Typography>
              </Box>
              <Typography variant="h4" color="green">
                {overviewStats.total.toLocaleString()} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <BankIcon sx={{ mr: 2, color: 'blue' }} />
                <Typography variant="h6">Trạng Thái Thanh Toán</Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Chip 
                  label={`Hoàn Thành: ${overviewStats.completed}`} 
                  color="success" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Đang Chờ: ${overviewStats.pending}`} 
                  color="warning" 
                  variant="outlined" 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <ReportIcon sx={{ mr: 2, color: 'purple' }} />
                <Typography variant="h6">Trung Bình</Typography>
              </Box>
              <Typography variant="h4" color="purple">
                {overviewStats.averageAmount.toLocaleString()} VNĐ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Biểu Đồ Thanh Toán Theo Tháng</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" name="Tổng Tiền" fill="#8884d8" />
                  <Bar dataKey="count" name="Số Lượng" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã</TableCell>
                  <TableCell>Tòa Nhà</TableCell>
                  <TableCell>Số Tiền</TableCell>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Trạng Thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>
                      {buildings.find(b => b.id.toString() === payment.buildingId.toString())?.name || 'N/A'}
                    </TableCell>
                    <TableCell>{payment.amount.toLocaleString()} VNĐ</TableCell>
                    <TableCell>{format(new Date(payment.dueDate), 'dd/MM/yyyy')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={
                          payment.status === 'completed' ? 'Hoàn Thành' : 
                          payment.status === 'pending' ? 'Đang Chờ' : 'Quá Hạn'
                        }
                        color={
                          payment.status === 'completed' ? 'success' : 
                          payment.status === 'pending' ? 'warning' : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentReports;

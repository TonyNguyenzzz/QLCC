import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Payment } from '../../../types/payment';
import { Building } from '../../../types/building';
import { format } from 'date-fns';

interface PaymentDetailedAnalysisProps {
  payments: Payment[];
  buildings: Building[];
}

const PaymentDetailedAnalysis: React.FC<PaymentDetailedAnalysisProps> = ({ payments, buildings }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Xuất báo cáo Excel
  const exportToExcel = (buildingId?: string) => {
    let dataToExport = buildingId 
      ? paymentsByBuilding[buildingId] 
      : payments;

    // Tạo nội dung CSV
    const headers = [
      'Mã Thanh Toán', 
      'Tòa Nhà', 
      'Căn Hộ', 
      'Tên Cư Dân', 
      'Loại Thanh Toán', 
      'Số Tiền', 
      'Ngày Đến Hạn', 
      'Trạng Thái'
    ];

    const csvData = dataToExport.map(payment => [
      payment.id,
      buildings.find(b => b.id === Number(payment.buildingId))?.name,
      payment.apartmentId,
      payment.residentName,
      payment.type === 'rent' ? 'Tiền thuê' :
      payment.type === 'maintenance' ? 'Phí bảo trì' :
      payment.type === 'utility' ? 'Tiền điện nước' : 'Khác',
      payment.amount,
      format(new Date(payment.dueDate), 'dd/MM/yyyy'),
      payment.status === 'completed' ? 'Đã thanh toán' :
      payment.status === 'pending' ? 'Chờ thanh toán' :
      payment.status === 'overdue' ? 'Quá hạn' : 'Khác'
    ]);

    // Tạo nội dung CSV
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Tạo Blob và tải xuống
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `BaoCaoThanhToan_${buildingId || 'TatCa'}_${format(new Date(), 'ddMMyyyyHHmmss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Nhóm thanh toán theo tòa nhà
  const paymentsByBuilding = useMemo(() => {
    const grouped: { [buildingId: string]: Payment[] } = {};
    payments.forEach(payment => {
      if (!grouped[payment.buildingId]) {
        grouped[payment.buildingId] = [];
      }
      grouped[payment.buildingId].push(payment);
    });
    return grouped;
  }, [payments]);

  // Thống kê chi tiết cho từng tòa nhà
  const buildingStatistics = useMemo(() => {
    return Object.entries(paymentsByBuilding).map(([buildingId, buildingPayments]) => {
      const building = buildings.find(b => b.id === Number(buildingId));
      
      const totalAmount = buildingPayments.reduce((sum, p) => sum + p.amount, 0);
      const completedAmount = buildingPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      const pendingAmount = buildingPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
      const overdueAmount = buildingPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        buildingId,
        buildingName: building?.name || 'Không xác định',
        totalPayments: buildingPayments.length,
        totalAmount,
        completedAmount,
        pendingAmount,
        overdueAmount,
        completionRate: totalAmount > 0 ? (completedAmount / totalAmount) * 100 : 0,
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [paymentsByBuilding, buildings]);

  // Lọc và hiển thị thanh toán
  const filteredPayments = useMemo(() => {
    let filtered = selectedBuilding 
      ? paymentsByBuilding[selectedBuilding] 
      : payments;

    if (paymentTypeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === paymentTypeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    return filtered;
  }, [selectedBuilding, payments, paymentTypeFilter, statusFilter]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Phân Tích Chi Tiết Thanh Toán
      </Typography>

      {/* Bảng thống kê tổng quan */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Thống Kê Tổng Quan
        </Typography>
        <Grid container spacing={2}>
          {buildingStatistics.map(stats => (
            <Grid item xs={12} md={4} key={stats.buildingId}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2">{stats.buildingName}</Typography>
                <Typography>Tổng Số Thanh Toán: {stats.totalPayments}</Typography>
                <Typography>Tổng Số Tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.totalAmount)}</Typography>
                <Typography>Tỷ Lệ Hoàn Thành: {stats.completionRate.toFixed(2)}%</Typography>
                <Button 
                  size="small" 
                  onClick={() => {
                    setSelectedBuilding(stats.buildingId);
                    setOpenDetailDialog(true);
                  }}
                >
                  Xem Chi Tiết
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Bộ lọc */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Tòa Nhà</InputLabel>
              <Select
                value={selectedBuilding || ''}
                label="Tòa Nhà"
                onChange={(e) => setSelectedBuilding(e.target.value || null)}
              >
                <MenuItem value="">Tất Cả</MenuItem>
                {buildings.map(building => (
                  <MenuItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Loại Thanh Toán</InputLabel>
              <Select
                value={paymentTypeFilter}
                label="Loại Thanh Toán"
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
              >
                <MenuItem value="all">Tất Cả</MenuItem>
                <MenuItem value="rent">Tiền Thuê</MenuItem>
                <MenuItem value="maintenance">Phí Bảo Trì</MenuItem>
                <MenuItem value="utility">Tiền Điện Nước</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Trạng Thái</InputLabel>
              <Select
                value={statusFilter}
                label="Trạng Thái"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tất Cả</MenuItem>
                <MenuItem value="completed">Đã Thanh Toán</MenuItem>
                <MenuItem value="pending">Chờ Thanh Toán</MenuItem>
                <MenuItem value="overdue">Quá Hạn</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Danh sách thanh toán */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="subtitle1">
            Danh Sách Thanh Toán
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => exportToExcel(selectedBuilding || undefined)}
          >
            Xuất CSV
          </Button>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Thanh Toán</TableCell>
                <TableCell>Tòa Nhà</TableCell>
                <TableCell>Căn Hộ</TableCell>
                <TableCell>Tên Cư Dân</TableCell>
                <TableCell>Loại Thanh Toán</TableCell>
                <TableCell>Số Tiền</TableCell>
                <TableCell>Ngày Đến Hạn</TableCell>
                <TableCell>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map(payment => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>
                    {buildings.find(b => b.id === Number(payment.buildingId))?.name}
                  </TableCell>
                  <TableCell>{payment.apartmentId}</TableCell>
                  <TableCell>{payment.residentName}</TableCell>
                  <TableCell>
                    {payment.type === 'rent' ? 'Tiền thuê' :
                     payment.type === 'maintenance' ? 'Phí bảo trì' :
                     payment.type === 'utility' ? 'Tiền điện nước' : 'Khác'}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(payment.amount)}
                  </TableCell>
                  <TableCell>{format(new Date(payment.dueDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    {payment.status === 'completed' ? 'Đã thanh toán' :
                     payment.status === 'pending' ? 'Chờ thanh toán' :
                     payment.status === 'overdue' ? 'Quá hạn' : 'Khác'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Chi tiết tòa nhà */}
      <Dialog 
        open={openDetailDialog} 
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chi Tiết Thanh Toán 
          {selectedBuilding && ` - ${buildings.find(b => b.id === Number(selectedBuilding))?.name}`}
        </DialogTitle>
        <DialogContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={buildingStatistics.filter(s => s.buildingId === selectedBuilding)}
            >
              <XAxis dataKey="buildingName" />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(value)
                } 
              />
              <Tooltip 
                formatter={(value) => 
                  new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(value as number)
                } 
              />
              <Bar dataKey="completedAmount" stackId="a" fill="#82ca9d" name="Đã Thanh Toán" />
              <Bar dataKey="pendingAmount" stackId="a" fill="#ffc658" name="Chờ Thanh Toán" />
              <Bar dataKey="overdueAmount" stackId="a" fill="#ff7300" name="Quá Hạn" />
            </BarChart>
          </ResponsiveContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => exportToExcel(selectedBuilding || undefined)}
          >
            Xuất CSV
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentDetailedAnalysis;

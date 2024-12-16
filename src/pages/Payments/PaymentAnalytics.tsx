import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer 
} from 'recharts';
import { 
  AssessmentOutlined as ReportIcon,
  DateRangeOutlined as DateIcon,
  MonetizationOnOutlined as MoneyIcon,
  ReceiptOutlined as ReceiptIcon,
  TrendingUpOutlined as TrendIcon
} from '@mui/icons-material';

// Định nghĩa interface cho khoản phí
interface Payment {
  id: number;
  residentName: string;
  apartmentCode: string;
  type: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
}

// Mock data báo cáo
const mockPayments: Payment[] = [
  { id: 1, residentName: 'Nguyễn Văn A', apartmentCode: 'A101', type: 'Phí quản lý', amount: 500000, dueDate: '2024-01-15', status: 'paid' },
  { id: 2, residentName: 'Trần Thị B', apartmentCode: 'B202', type: 'Phí điện nước', amount: 350000, dueDate: '2024-01-20', status: 'pending' },
  { id: 3, residentName: 'Lê Văn C', apartmentCode: 'C303', type: 'Phí gửi xe', amount: 200000, dueDate: '2024-01-10', status: 'overdue' },
  { id: 4, residentName: 'Phạm Thị D', apartmentCode: 'D404', type: 'Phí quản lý', amount: 450000, dueDate: '2024-01-25', status: 'paid' },
  { id: 5, residentName: 'Hoàng Văn E', apartmentCode: 'E505', type: 'Phí điện nước', amount: 300000, dueDate: '2024-01-30', status: 'pending' }
];

const PaymentAnalytics: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [timeFilter, setTimeFilter] = useState<string>('thisMonth');

  useEffect(() => {
    // Trong tương lai, thay thế bằng API call
    setPayments(mockPayments);
  }, []);

  // Phân tích doanh thu theo loại phí
  const revenueByType = useMemo(() => {
    const typeGroups = payments.reduce((acc, payment) => {
      if (payment.status === 'paid') {
        acc[payment.type] = (acc[payment.type] || 0) + payment.amount;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeGroups).map(([type, amount]) => ({ type, amount }));
  }, [payments]);

  // Phân tích trạng thái thanh toán
  const paymentStatusAnalytics = useMemo(() => {
    const statusGroups = payments.reduce((acc, payment) => {
      acc[payment.status] = (acc[payment.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusGroups).map(([status, count]) => ({ 
      status, 
      count,
      color: status === 'paid' ? '#4caf50' : status === 'pending' ? '#ff9800' : '#f44336'
    }));
  }, [payments]);

  // Tổng quan về thanh toán
  const paymentOverview = useMemo(() => {
    const totalPayments = payments.length;
    const paidPayments = payments.filter(p => p.status === 'paid');
    const totalRevenue = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const averagePayment = totalPayments > 0 ? totalRevenue / paidPayments.length : 0;

    return {
      totalPayments,
      paidPayments: paidPayments.length,
      totalRevenue,
      averagePayment
    };
  }, [payments]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <ReportIcon sx={{ mr: 2, fontSize: 40 }} color="primary" />
        <Typography variant="h4" gutterBottom>
          Báo Cáo & Phân Tích Thanh Toán
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Tổng quan */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <MoneyIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Tổng Quan</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1">
                Tổng số khoản phí: <strong>{paymentOverview.totalPayments}</strong>
              </Typography>
              <Typography variant="body1">
                Khoản phí đã thanh toán: <strong>{paymentOverview.paidPayments}</strong>
              </Typography>
              <Typography variant="body1" color="primary">
                Tổng doanh thu: <strong>{paymentOverview.totalRevenue.toLocaleString()} VNĐ</strong>
              </Typography>
              <Typography variant="body1">
                Trung bình/khoản: <strong>{paymentOverview.averagePayment.toLocaleString()} VNĐ</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ doanh thu theo loại phí */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <ReceiptIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Doanh Thu Theo Loại Phí</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Thời Gian</InputLabel>
                  <Select
                    value={timeFilter}
                    label="Thời Gian"
                    onChange={(e) => setTimeFilter(e.target.value)}
                  >
                    <MenuItem value="thisMonth">Tháng Này</MenuItem>
                    <MenuItem value="lastMonth">Tháng Trước</MenuItem>
                    <MenuItem value="thisYear">Năm Nay</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value.toLocaleString() + ' VNĐ', 'Doanh Thu']} />
                  <Bar dataKey="amount" fill="#3f51b5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Biểu đồ trạng thái thanh toán */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <TrendIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Trạng Thái Thanh Toán</Typography>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStatusAnalytics}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentStatusAnalytics.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'status' ? 'Trạng Thái' : 'Số Lượng']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentAnalytics;

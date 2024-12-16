import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { Payment } from '../../../types/payment';
import { Building } from '../../../types/building';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import AdvancedFilters, { FilterValues } from './AdvancedFilters';

interface PaymentAnalyticsProps {
  payments: Payment[];
  buildings: Building[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PaymentAnalytics: React.FC<PaymentAnalyticsProps> = ({ payments, buildings }) => {
  const [filteredPayments, setFilteredPayments] = React.useState<Payment[]>(payments);

  React.useEffect(() => {
    setFilteredPayments(payments);
  }, [payments]);

  const handleFilterChange = (filters: FilterValues) => {
    let filtered = [...payments];

    // Lọc theo khoảng thời gian
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.dueDate);
        return paymentDate >= filters.dateRange.startDate! &&
               paymentDate <= filters.dateRange.endDate!;
      });
    }

    // Lọc theo tòa nhà
    if (filters.buildingId) {
      filtered = filtered.filter(payment => payment.buildingId === filters.buildingId);
    }

    // Lọc theo loại thanh toán
    if (filters.paymentType) {
      filtered = filtered.filter(payment => payment.type === filters.paymentType);
    }

    // Lọc theo trạng thái
    if (filters.status) {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }

    setFilteredPayments(filtered);
  };

  // Phân tích xu hướng theo tháng
  const monthlyTrends = React.useMemo(() => {
    const end = new Date();
    const start = subMonths(end, 11); // 12 tháng gần nhất
    const months: Date[] = [];
    let current = start;
    
    while (current <= end) {
      months.push(current);
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthPayments = filteredPayments.filter(p => {
        const paymentDate = new Date(p.dueDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      const total = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      const completed = monthPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      const pending = monthPayments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0);
      const overdue = monthPayments
        .filter(p => p.status === 'overdue')
        .reduce((sum, p) => sum + p.amount, 0);

      return {
        month: format(month, 'MM/yyyy', { locale: vi }),
        total,
        completed,
        pending,
        overdue,
        count: monthPayments.length,
      };
    });
  }, [filteredPayments]);

  // Phân tích phương thức thanh toán
  const paymentMethodData = React.useMemo(() => {
    const methods: { [key: string]: number } = {};
    filteredPayments.forEach(payment => {
      if (payment.paymentMethod) {
        methods[payment.paymentMethod] = (methods[payment.paymentMethod] || 0) + 1;
      }
    });
    return Object.entries(methods).map(([method, count]) => ({
      name: method === 'bank_transfer' ? 'Chuyển khoản' :
           method === 'cash' ? 'Tiền mặt' :
           method === 'credit_card' ? 'Thẻ tín dụng' : 'Khác',
      value: (count / filteredPayments.length) * 100,
    }));
  }, [filteredPayments]);

  // Phân tích theo căn hộ
  const apartmentAnalysis = React.useMemo(() => {
    const apartmentStats: { [key: string]: any } = {};
    
    filteredPayments.forEach(payment => {
      if (!payment.apartmentId) return;
      
      if (!apartmentStats[payment.apartmentId]) {
        apartmentStats[payment.apartmentId] = {
          totalAmount: 0,
          completedAmount: 0,
          pendingAmount: 0,
          overdueAmount: 0,
          completedCount: 0,
          totalCount: 0,
        };
      }

      const stats = apartmentStats[payment.apartmentId];
      stats.totalAmount += payment.amount;
      stats.totalCount++;

      switch (payment.status) {
        case 'completed':
          stats.completedAmount += payment.amount;
          stats.completedCount++;
          break;
        case 'pending':
          stats.pendingAmount += payment.amount;
          break;
        case 'overdue':
          stats.overdueAmount += payment.amount;
          break;
      }
    });

    return Object.entries(apartmentStats)
      .map(([apartmentId, stats]) => ({
        apartmentId,
        ...stats,
        paymentRate: (stats.completedAmount / stats.totalAmount) * 100,
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10);
  }, [filteredPayments]);

  // Tính toán tổng quan và dự báo
  const overallStats = React.useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const completedAmount = filteredPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = filteredPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = filteredPayments
      .filter(p => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);

    // Dự báo dựa trên xu hướng 3 tháng gần nhất
    const recent3Months = monthlyTrends.slice(-3);
    const avgMonthlyCollection = recent3Months.reduce((sum, m) => sum + m.completed, 0) / 3;
    const avgMonthlyTotal = recent3Months.reduce((sum, m) => sum + m.total, 0) / 3;
    const collectionRate = (completedAmount / totalAmount) * 100;
    const projectedRate = (avgMonthlyCollection / avgMonthlyTotal) * 100;

    return {
      totalAmount,
      completedAmount,
      pendingAmount,
      overdueAmount,
      collectionRate,
      projectedRate,
      trend: projectedRate - collectionRate,
    };
  }, [filteredPayments, monthlyTrends]);

  return (
    <Box>
      <AdvancedFilters
        buildings={buildings}
        onFilterChange={handleFilterChange}
      />
      <Grid container spacing={3}>
        {/* Thống kê tổng quan */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng số tiền
                  </Typography>
                  <Typography variant="h5">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(overallStats.totalAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Đã thu
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(overallStats.completedAmount)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {overallStats.collectionRate.toFixed(1)}% tổng số
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Chờ thu
                  </Typography>
                  <Typography variant="h5" color="warning.main">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(overallStats.pendingAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Quá hạn
                  </Typography>
                  <Typography variant="h5" color="error.main">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(overallStats.overdueAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Xu hướng theo thời gian */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Xu hướng thanh toán theo tháng
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('vi-VN', {
                        notation: 'compact',
                        compactDisplay: 'short',
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stackId="1"
                    stroke="#4caf50"
                    fill="#4caf50"
                    name="Đã thu"
                  />
                  <Area
                    type="monotone"
                    dataKey="pending"
                    stackId="1"
                    stroke="#ff9800"
                    fill="#ff9800"
                    name="Chờ thu"
                  />
                  <Area
                    type="monotone"
                    dataKey="overdue"
                    stackId="1"
                    stroke="#f44336"
                    fill="#f44336"
                    name="Quá hạn"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Phân tích phương thức thanh toán */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Phân tích phương thức thanh toán
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      name,
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius + 25;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#333"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          style={{ fontSize: '12px' }}
                        >
                          {`${name} (${value.toFixed(1)}%)`}
                        </text>
                      );
                    }}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Tỷ lệ']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Phân tích theo căn hộ */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Top 10 căn hộ theo doanh thu
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={apartmentAnalysis}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 50,
                    bottom: 25,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="apartmentId"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat('vi-VN', {
                        notation: 'compact',
                        compactDisplay: 'short',
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) =>
                      new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(value)
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="completedAmount"
                    name="Đã thu"
                    stackId="a"
                    fill="#4caf50"
                  />
                  <Bar
                    dataKey="pendingAmount"
                    name="Chờ thu"
                    stackId="a"
                    fill="#ff9800"
                  />
                  <Bar
                    dataKey="overdueAmount"
                    name="Quá hạn"
                    stackId="a"
                    fill="#f44336"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Dự báo và xu hướng */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Dự báo và xu hướng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body1">
                  Tỷ lệ thu hồi hiện tại: {overallStats.collectionRate.toFixed(1)}%
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body1">
                  Dự báo tỷ lệ thu hồi: {overallStats.projectedRate.toFixed(1)}%
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ mr: 1 }}>
                    Xu hướng:
                  </Typography>
                  {overallStats.trend > 0 ? (
                    <>
                      <TrendingUp color="success" />
                      <Typography color="success.main" sx={{ ml: 0.5 }}>
                        +{overallStats.trend.toFixed(1)}%
                      </Typography>
                    </>
                  ) : (
                    <>
                      <TrendingDown color="error" />
                      <Typography color="error.main" sx={{ ml: 0.5 }}>
                        {overallStats.trend.toFixed(1)}%
                      </Typography>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentAnalytics;

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
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
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Payment } from '../../../types/payment';
import { Building } from '../../../types/building';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface PaymentChartsProps {
  payments: Payment[];
  buildings: Building[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PaymentCharts: React.FC<PaymentChartsProps> = ({ payments, buildings }) => {
  // Biểu đồ tổng quan doanh thu theo tháng
  const monthlyRevenueChart = React.useMemo(() => {
    const now = new Date();
    const monthlyData: { month: string; amount: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));
      
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.dueDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      const monthTotal = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      monthlyData.push({
        month: format(monthStart, 'MM/yyyy'),
        amount: monthTotal,
      });
    }

    return monthlyData;
  }, [payments]);

  // Biểu đồ tròn: Phân bổ thanh toán theo loại
  const paymentTypeDistribution = React.useMemo(() => {
    const typeAmounts: { [type: string]: number } = {
      rent: 0,
      maintenance: 0,
      utility: 0,
      other: 0
    };

    payments.forEach(payment => {
      typeAmounts[payment.type] += payment.amount;
    });

    return Object.entries(typeAmounts).map(([type, amount]) => ({
      name: type === 'rent' ? 'Tiền thuê' :
            type === 'maintenance' ? 'Phí bảo trì' :
            type === 'utility' ? 'Tiền điện nước' : 'Khác',
      value: amount,
    }));
  }, [payments]);

  // Biểu đồ trạng thái thanh toán
  const paymentStatusChart = React.useMemo(() => {
    const statusAmounts: { [status: string]: number } = {
      completed: 0,
      pending: 0,
      overdue: 0
    };

    payments.forEach(payment => {
      statusAmounts[payment.status] += payment.amount;
    });

    return Object.entries(statusAmounts).map(([status, amount]) => ({
      name: status === 'completed' ? 'Đã thanh toán' :
            status === 'pending' ? 'Chờ thanh toán' :
            status === 'overdue' ? 'Quá hạn' : 'Khác',
      value: amount,
    }));
  }, [payments]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Biểu Đồ Thanh Toán
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Doanh Thu Hàng Tháng
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueChart}>
                <XAxis dataKey="month" />
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
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Phân Bổ Thanh Toán Theo Loại
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {paymentTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => 
                    new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(value as number)
                  } 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Trạng Thái Thanh Toán
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusChart}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {paymentStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => 
                    new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND' 
                    }).format(value as number)
                  } 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentCharts;

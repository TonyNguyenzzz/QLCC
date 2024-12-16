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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Payment } from '../../../types/payment';
import { Building } from '../../../types/building';
import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  subMonths 
} from 'date-fns';

interface PaymentForecastProps {
  payments: Payment[];
  buildings: Building[];
}

const PaymentForecast: React.FC<PaymentForecastProps> = ({ payments, buildings }) => {
  // Dự báo doanh thu trong 6 tháng tới
  const revenueForecast = React.useMemo(() => {
    const monthlyRevenue: { [key: string]: number } = {};
    
    // Tính toán doanh thu 6 tháng qua
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = endOfMonth(subMonths(now, i));
      
      const monthPayments = payments.filter(p => {
        const paymentDate = new Date(p.dueDate);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      const monthTotal = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      monthlyRevenue[format(monthStart, 'MM/yyyy')] = monthTotal;
    }

    // Dự báo 6 tháng tới bằng cách lấy trung bình 6 tháng qua
    const averageMonthlyRevenue = Object.values(monthlyRevenue).reduce((a, b) => a + b, 0) / 6;
    
    const forecastData = [];
    for (let i = 0; i < 6; i++) {
      const forecastMonth = addMonths(now, i);
      forecastData.push({
        month: format(forecastMonth, 'MM/yyyy'),
        amount: Math.round(averageMonthlyRevenue * (1 + Math.random() * 0.2 - 0.1)), // Dự báo với độ biến động ±10%
      });
    }

    return forecastData;
  }, [payments]);

  // Dự báo số lượng thanh toán theo loại
  const paymentTypeForecast = React.useMemo(() => {
    const typeAmounts: { [type: string]: number } = {
      rent: 0,
      maintenance: 0,
      utility: 0,
      other: 0
    };

    const now = new Date();
    const sixMonthsAgo = subMonths(now, 6);

    payments
      .filter(p => new Date(p.dueDate) >= sixMonthsAgo)
      .forEach(payment => {
        typeAmounts[payment.type] += payment.amount;
      });

    return Object.entries(typeAmounts).map(([type, totalAmount]) => ({
      type: type === 'rent' ? 'Tiền thuê' :
            type === 'maintenance' ? 'Phí bảo trì' :
            type === 'utility' ? 'Tiền điện nước' : 'Khác',
      forecastAmount: Math.round(totalAmount / 6 * (1 + Math.random() * 0.2 - 0.1)), // Dự báo với độ biến động ±10%
    }));
  }, [payments]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Dự Báo Thanh Toán
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Dự Báo Doanh Thu 6 Tháng Tới
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueForecast}>
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
                <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Dự Báo Thanh Toán Theo Loại
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentTypeForecast}>
                <XAxis dataKey="type" />
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
                <Line type="monotone" dataKey="forecastAmount" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentForecast;

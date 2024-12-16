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
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Payment } from '../../../types/payment';
import { Building } from '../../../types/building';
import { format, subMonths } from 'date-fns';

interface PaymentComparisonProps {
  payments: Payment[];
  buildings: Building[];
}

const PaymentComparison: React.FC<PaymentComparisonProps> = ({ payments, buildings }) => {
  // So sánh thanh toán giữa các tòa nhà
  const buildingComparison = React.useMemo(() => {
    const buildingTotals: { [buildingId: string]: number } = {};
    
    payments.forEach(payment => {
      if (!buildingTotals[payment.buildingId]) {
        buildingTotals[payment.buildingId] = 0;
      }
      buildingTotals[payment.buildingId] += payment.amount;
    });

    return Object.entries(buildingTotals).map(([buildingId, total]) => {
      const building = buildings.find(b => b.id === Number(buildingId));
      return {
        buildingName: building?.name || 'Không xác định',
        totalAmount: total,
      };
    }).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [payments, buildings]);

  // So sánh thanh toán theo loại trong 6 tháng gần nhất
  const paymentTypeComparison = React.useMemo(() => {
    const sixMonthsAgo = subMonths(new Date(), 6);
    
    const typeAmounts: { [type: string]: number } = {
      rent: 0,
      maintenance: 0,
      utility: 0,
      other: 0
    };

    payments
      .filter(p => new Date(p.dueDate) >= sixMonthsAgo)
      .forEach(payment => {
        typeAmounts[payment.type] += payment.amount;
      });

    return Object.entries(typeAmounts).map(([type, amount]) => ({
      type: type === 'rent' ? 'Tiền thuê' :
            type === 'maintenance' ? 'Phí bảo trì' :
            type === 'utility' ? 'Tiền điện nước' : 'Khác',
      amount,
    }));
  }, [payments]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        So Sánh Thanh Toán
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              So Sánh Thanh Toán Theo Tòa Nhà
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={buildingComparison}>
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
                <Bar dataKey="totalAmount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              So Sánh Thanh Toán Theo Loại (6 Tháng Gần Nhất)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={paymentTypeComparison}>
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
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentComparison;

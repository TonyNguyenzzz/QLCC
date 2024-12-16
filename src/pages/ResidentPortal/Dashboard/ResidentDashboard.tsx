import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardHeader,
  Button,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Home as HomeIcon,
  Notifications as NotificationIcon,
  Build as RepairIcon
} from '@mui/icons-material';

// Import data
import { 
  Payment, 
  Notification, 
  mockPayments, 
  mockNotifications 
} from '../../../data/resident/dashboardData';

const ResidentDashboard: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock data - sau này sẽ thay bằng API thực
    setPayments(mockPayments);
    setNotifications(mockNotifications);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Trang Cá Nhân Cư Dân
      </Typography>

      <Grid container spacing={3}>
        {/* Thanh Toán */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <CardHeader 
              avatar={<PaymentIcon color="primary" />}
              title="Thanh Toán"
            />
            <CardContent>
              {payments.map(payment => (
                <Card 
                  key={payment.id} 
                  variant="outlined" 
                  sx={{ mb: 1 }}
                >
                  <CardContent>
                    <Typography variant="subtitle2">
                      {payment.type === 'rent' ? 'Tiền Thuê' : 
                       payment.type === 'maintenance' ? 'Phí Bảo Trì' : 'Tiện Ích'}
                    </Typography>
                    <Typography variant="body2">
                      Số Tiền: {payment.amount.toLocaleString()} VND
                    </Typography>
                    <Typography 
                      variant="body2"
                      color={
                        payment.status === 'pending' ? 'warning.main' :
                        payment.status === 'overdue' ? 'error.main' : 
                        'success.main'
                      }
                    >
                      Trạng Thái: {
                        payment.status === 'pending' ? 'Chưa Thanh Toán' :
                        payment.status === 'overdue' ? 'Quá Hạn' : 
                        'Đã Thanh Toán'
                      }
                    </Typography>
                    <Typography variant="caption">
                      Hạn Thanh Toán: {payment.dueDate}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                Thanh Toán Ngay
              </Button>
            </CardContent>
          </Paper>
        </Grid>

        {/* Thông Báo */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <CardHeader 
              avatar={<NotificationIcon color="primary" />}
              title="Thông Báo Mới"
            />
            <CardContent>
              {notifications.map(noti => (
                <Card 
                  key={noti.id} 
                  variant="outlined" 
                  sx={{ mb: 1 }}
                >
                  <CardContent>
                    <Typography variant="subtitle2">
                      {noti.title}
                    </Typography>
                    <Typography variant="body2">
                      {noti.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {noti.date}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Paper>
        </Grid>

        {/* Yêu Cầu Dịch Vụ */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ height: '100%' }}>
            <CardHeader 
              avatar={<RepairIcon color="primary" />}
              title="Dịch Vụ"
            />
            <CardContent>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mb: 2 }}
                startIcon={<RepairIcon />}
              >
                Gửi Yêu Cầu Bảo Trì
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<HomeIcon />}
              >
                Đăng Ký Dịch Vụ
              </Button>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResidentDashboard;

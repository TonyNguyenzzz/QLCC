import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Person,
  Build,
  Payment,
  Notifications,
  HomeWork,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardData } from '../../data/homeData';

const ActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}> = ({ title, description, icon, path }) => {
  const navigate = useNavigate();
  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate(path)}>
          Xem chi tiết
        </Button>
      </CardActions>
    </Card>
  );
};

const ResidentHome: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Xin chào, {user?.name || 'Cư Dân'}
        </Typography>
        <Typography color="text.secondary">
          Chào mừng bạn đến với cổng thông tin cư dân
        </Typography>
      </Box>

      {/* Thông báo gần đây */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Thông Báo Mới
            </Typography>
            <Box>
              {dashboardData.recentNotifications.slice(0, 3).map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <Box sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Notifications sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="subtitle1">
                        {notification.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                  {index < 2 && <Divider />}
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Truy cập nhanh */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <ActionCard
                title="Hồ Sơ Cá Nhân"
                description="Quản lý thông tin cá nhân"
                icon={<Person color="primary" />}
                path="/profile"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ActionCard
                title="Tòa Nhà"
                description="Thông tin và tiện ích"
                icon={<HomeWork color="secondary" />}
                path="/buildings"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ActionCard
                title="Thanh Toán"
                description="Quản lý khoản phí"
                icon={<Payment color="primary" />}
                path="/resident-payments"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ActionCard
                title="Dịch Vụ"
                description="Đăng ký dịch vụ"
                icon={<Build color="secondary" />}
                path="/resident-services"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ResidentHome;
